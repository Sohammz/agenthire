'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { supabaseBrowser } from '../lib/supabaseClient';
import { syncProfile } from '../lib/syncProfile';
// import ThemeToggle from './ThemeToggle'; // commented out for now

type UserPublic = {
  id: string;
  email?: string | null;
  avatar_url?: string | null;
  full_name?: string | null;
};

export default function Header() {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserPublic | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();

    // initial profile sync
    syncProfile().catch((e) => console.error('syncProfile error', e));

    // load user from supabase
    (async () => {
      try {
        const {
          data: { user: sUser },
        } = await supabase.auth.getUser();
        if (sUser) {
          setUser({
            id: sUser.id,
            email: sUser.email,
            avatar_url: (sUser.user_metadata as any)?.avatar_url || null,
            full_name: (sUser.user_metadata as any)?.full_name || null,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('getUser error', err);
        setUser(null);
      }
    })();

    // listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const sUser = session.user;
        setUser({
          id: sUser.id,
          email: sUser.email,
          avatar_url: (sUser.user_metadata as any)?.avatar_url || null,
          full_name: (sUser.user_metadata as any)?.full_name || null,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      try {
        listener?.subscription?.unsubscribe?.();
      } catch {
        // ignore
      }
    };
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  const handleLogout = async () => {
    try {
      const supabase = supabaseBrowser();
      await supabase.auth.signOut();
      setUser(null);
      // redirect to home after logout
      window.location.href = '/';
    } catch (e) {
      console.error('logout error', e);
    }
  };

  return (
    <header className="w-screen left-0 right-0 fixed top-0 border-b bg-white/100 dark:bg-gray-900/80 z-50">
      {/* full-width flexible container */}
      <div className="w-full flex items-center justify-between px-6 py-3">
        {/* Left: Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="inline-flex items-center">
            <span className="flex items-baseline">
              <span className="text-2xl italic font-medium tracking-tight" style={{ fontFamily: "'Sora', serif" }}>
                Agent
              </span>
              <span className="text-xl font-extrabold uppercase tracking-wide -ml-1.0">
                HIRE
              </span>
            </span>
          </Link>
        </div>

        {/* Right-aligned navigation (links + actions) */}
        <nav className="hidden lg:flex flex-1 items-center justify-end gap-4 px-6" aria-label="Primary">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm px-2 py-1 rounded-md transition ${path?.startsWith('/dashboard') ? 'font-semibold text-purple-600' : 'text-gray-700 dark:text-gray-200 hover:text-purple-600'}`}
              >
                Dashboard
              </Link>

              <Link
                href="/dashboard/profile"
                className={`text-sm px-2 py-1 rounded-md transition ${path?.startsWith('/dashboard/profile') ? 'font-semibold text-purple-600' : 'text-gray-700 dark:text-gray-200 hover:text-purple-600'}`}
              >
                My Profile
              </Link>

              <Link
                href="/dashboard/subscription"
                className="text-sm px-2 py-1 rounded-md transition text-gray-700 dark:text-gray-200 hover:text-purple-600"
              >
                Subscriptions
              </Link>

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

              {/* Desktop: show avatar + logout */}
              <div className="flex items-center gap-3">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || user.email || 'avatar'}
                    className="h-9 w-9 rounded-full object-cover border"
                    width={36}
                    height={36}
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center border">
                    <User size={16} className="text-gray-600 dark:text-gray-300" />
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1 rounded-md bg-white border shadow-sm text-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            // not signed in: only show Sign in / Sign up
            <>
              <Link href="/login" className="text-sm px-2 py-1 rounded-md text-gray-700 dark:text-gray-200 hover:text-purple-600">
                Sign in
              </Link>
              <Link href="/signup" className="text-sm px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition">
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile area: compact auth + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {user ? (
            <>
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || user.email || 'avatar'}
                  className="h-8 w-8 rounded-full object-cover border"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center border">
                  <User size={14} className="text-gray-600 dark:text-gray-300" />
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-2 py-1 rounded-md bg-white border text-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:text-purple-600">
                Sign in
              </Link>
              <Link href="/signup" className="px-3 py-1 rounded-md bg-purple-600 text-white text-sm hover:bg-purple-700 transition">
                Sign up
              </Link>
            </>
          )}

          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
            className="p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-white dark:bg-gray-900">
          <div className="px-4 py-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" className="px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  My Profile
                </Link>
                <Link href="/dashboard/subscription" className="px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Subscriptions
                </Link>

                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name || user.email || 'avatar'} className="h-9 w-9 rounded-full object-cover border" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center border">
                      <User size={16} className="text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.full_name || user.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Signed in</p>
                  </div>
                  <div className="ml-auto">
                    <button onClick={handleLogout} className="px-3 py-1 rounded-md bg-white border text-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition">Sign in</Link>
                <Link href="/signup" className="px-3 py-2 rounded-md bg-purple-600 text-white text-center hover:bg-purple-700 transition">Sign up</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
