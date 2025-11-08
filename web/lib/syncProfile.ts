// lib/syncProfile.ts
'use client';
import { supabaseBrowser } from '../lib/supabaseClient';

export async function syncProfile() {
  try {
    const supabase = supabaseBrowser();

    // use getSession() first to be safer, then fallback to getUser()
    const sessionRes = await supabase.auth.getSession();
    const user = sessionRes?.data?.session?.user ?? (await supabase.auth.getUser()).data?.user;

    if (!user) {
      // No active session yet — silently return (caller should retry or use listener)
      console.log('syncProfile: no user session yet — skipping');
      return { created: false, reason: 'no-session' };
    }

    // Check if profile exists
    const { data: existingProfile, error: selectErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (selectErr) {
      console.log('syncProfile: error checking profile', selectErr);
      return { created: false, reason: 'select-error', error: selectErr };
    }

    if (!existingProfile) {
      const { error: insertErr } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.name ?? '',
        college_name: '',
        city: '',
        birth_date: null,
        highest_education: '',
        phone: user.phone ?? '',
        linkedin_url: '',
        github_url: '',
        resume_url: '',
        preferred_roles: '',
      });

      if (insertErr) {
        console.log('syncProfile: insert error', insertErr);
        return { created: false, reason: 'insert-error', error: insertErr };
      }
      console.log('syncProfile: created profile for', user.email);
      return { created: true };
    }

    // already exists
    return { created: false, reason: 'exists' };
  } catch (err) {
    console.log('syncProfile: unexpected error', err);
    return { created: false, reason: 'exception', error: err };
  }
}
