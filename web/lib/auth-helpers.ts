// web/lib/auth-helpers.ts
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

// This is intended for Next.js Server Components (App Router)
export const supabaseServer = () => {
  return createServerComponentClient({
    cookies
  });
};
