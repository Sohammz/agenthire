'use client';
import { supabaseBrowser } from '../lib/supabaseClient';

export async function fetchProfile() {
  const supabase = supabaseBrowser();

  // Get current logged-in user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not logged in');

  // Fetch user profile by ID
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
