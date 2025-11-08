'use client';
import { supabaseBrowser } from '../lib/supabaseClient';

// Insert or update profile data after login
export async function insertProfile({
  full_name,
  college_name,
  city,
  birth_date,
  highest_education,
  phone,
  linkedin_url,
  github_url,
  resume_url,
  preferred_roles,
}: any) {
  const supabase = supabaseBrowser();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email,
    full_name,
    college_name,
    city,
    birth_date,
    highest_education,
    phone,
    linkedin_url,
    github_url,
    resume_url,
    preferred_roles,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  return { success: true };
}
