'use client';
import { supabaseBrowser } from '../../../lib/supabaseClient';
export default function LoginPage() {
  const signIn = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } });
  };
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Login</h2>
      <button onClick={signIn} className="px-3 py-2 rounded bg-black text-white">Continue with Google</button>
    </div>
  );
}
