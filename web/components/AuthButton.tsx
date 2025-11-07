'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../lib/supabaseClient';

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.data?.subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
  };
  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="flex gap-2">
      {!user ? (
        <button onClick={handleLogin} className="px-3 py-1 rounded bg-black text-white">Login</button>
      ) : (
        <>
          <span className="text-sm">{user.email}</span>
          <button onClick={handleLogout} className="px-3 py-1 rounded border">Logout</button>
        </>
      )}
    </div>
  );
}
