// components/ClientAuthSync.tsx  (Client Component)
'use client';
import { useEffect } from 'react';
import { supabaseBrowser } from '../lib/supabaseClient';
import { syncProfile } from '../lib/syncProfile';

export default function ClientAuthSync() {
  useEffect(() => {
    const supabase = supabaseBrowser();

    // Try once on load (may return no-session)
    syncProfile();

    // Listen for auth state changes and run syncProfile when session becomes available
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncProfile();
      }
    });

    return () => {
      try {
        listener.subscription.unsubscribe();
      } catch (e) {
        // ignore if already unsubscribed or not available
      }
    };
  }, []);

  // This component renders nothing visible
  return null;
}
