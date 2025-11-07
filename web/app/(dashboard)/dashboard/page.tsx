// web/app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../../lib/supabaseClient';
import Link from 'next/link';

export default function DashboardClient() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = supabaseBrowser();
    let mounted = true;

    // get current session user
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
      setLoading(false);
    });

    // listen for auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div>
        <h2 className="text-2xl">Not signed in</h2>
        <p>Please <Link className="underline" href="/login">login</Link> to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl">Dashboard</h2>
      <p>Welcome, {user.email}!</p>
      <p>Your AgentHire profile and mock interviews will appear here.</p>
    </div>
  );
}
