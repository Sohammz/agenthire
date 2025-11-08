'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '../lib/supabaseClient';
type AuthButtonProps = { compact?: boolean };

export default function AuthButton({ compact }: AuthButtonProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = supabaseBrowser();

    // Get current user at mount
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error) setUser(data.user ?? null);
    });

    // Keep in sync with auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      try {
        sub.subscription.unsubscribe();
      } catch (e) {
        // ignore if already unsubscribed
      }
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const supabase = supabaseBrowser();
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Sign out error', err);
    } finally {
      setLoading(false);
    }
  };

  // If user is signed in: show name/email + logout (and quick profile link)
  if (user) {
    const displayName = user.user_metadata?.name ?? user.email ?? user.phone ?? 'User';
    return (
      <div className="flex items-center gap-3">
        {/* <Link href="/dashboard/profile" className="text-sm hover:underline">
          {displayName}
        </Link> */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="px-3 py-1 rounded border text-sm"
        >
          {loading ? 'Signing out…' : 'Logout'}
        </button>
      </div>
    );
  }

  // Not signed in: show Sign in / Sign up buttons that navigate to your pages
  return (
    <div className="flex items-center gap-3">
      <Link href="/login" className="px-3 py-1 rounded border text-sm">Sign in</Link>
      <Link href="/signup" className="px-3 py-1 rounded bg-purple-700 text-white text-sm">Sign up</Link>
    </div>
  );
}
