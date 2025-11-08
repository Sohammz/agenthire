'use client';
import React, { useState } from 'react';
import Nav from '../../../components/Nav';
import { supabaseBrowser } from '../../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';

export default function SignupClient() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [msg, setMsg] = useState('');

  // Email magic link (logic unchanged)
  const signUpWithEmail = async () => {
    setMsg('Sending sign-in link...');
    try {
      const supabase = supabaseBrowser();
      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/dashboard/profile`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      try {
        localStorage.setItem('pending_profile', JSON.stringify({ name, college }));
      } catch {}

      setMsg('Check your email for the sign-in link.');
    } catch (err: any) {
      setMsg(err?.message ?? 'Unexpected error');
    }
  };

  // OAuth Google
  const signUpWithGoogle = async () => {
    try {
      const supabase = supabaseBrowser();
      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/dashboard/profile`;
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    } catch (err: any) {
      setMsg(err?.message ?? 'OAuth error');
    }
  };

  // OAuth GitHub
  const signUpWithGithub = async () => {
    try {
      const supabase = supabaseBrowser();
      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/dashboard/profile`;
      await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo } });
    } catch (err: any) {
      setMsg(err?.message ?? 'OAuth error');
    }
  };

  return (
    <>
      <Nav />

      {/* subtle animated background blobs (purely decorative) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} transition={{ duration: 1.2 }} className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-tr from-purple-400 to-purple-700 blur-3xl" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.06 }} transition={{ duration: 1.6, delay: 0.2 }} className="absolute -right-28 bottom-20 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 blur-3xl" />
      </div>

      <main className="mx-auto max-w-5xl px-6 py-20">
        <motion.section initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-2xl bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* LEFT: Social auth (Google + GitHub) */}
            <motion.div whileHover={{ scale: 1.01 }} className="p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/60 dark:to-gray-900/40 shadow-lg flex flex-col justify-top gap-6">
              <div>
                <h3 className="text-xl font-semibold">Sign up quickly</h3>
                <p className="text-sm text-gray-500 mt-1">Use Google or GitHub to create an account instantly.</p>
              </div>

              <div className="flex flex-col gap-3">
                <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={signUpWithGoogle} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border shadow-sm hover:shadow-md transition">
                  {/* Google inline SVG */}
                  <svg className="h-5 w-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M533.5 278.4c0-18.1-1.6-36.4-4.9-53.9H272v102.1h146.9c-6.3 34-25.3 62.8-54.1 82v68.1h87.4c51-47 80.3-116.4 80.3-198.3z" fill="#4285f4"/>
                    <path d="M272 544.3c73.5 0 135.3-24.2 180.4-65.7l-87.4-68.1c-24.2 16.3-55 25.9-93 25.9-71.5 0-132.1-48.3-153.9-113.1H28.5v70.9C73 486.6 166.6 544.3 272 544.3z" fill="#34a853"/>
                    <path d="M118.1 321.4c-10.9-32.4-10.9-67.6 0-100l-89.6-69.1C6.9 192.3 0 231.6 0 272s6.9 79.7 28.5 119.7l89.6-70.3z" fill="#fbbc04"/>
                    <path d="M272 107.6c39.9 0 75.7 13.7 103.9 40.5l78-78C408.4 24.5 345.6 0 272 0 166.6 0 73 57.7 28.5 144.8l89.6 69.1C139.9 156 200.5 107.6 272 107.6z" fill="#ea4335"/>
                  </svg>
                  <span className="text-sm font-medium">Continue with Google</span>
                </motion.button>

                <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={signUpWithGithub} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border shadow-sm hover:shadow-md transition">
                  {/* GitHub inline SVG */}
                  <svg className="h-5 w-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.6 7.6 0 018 4.58c.68.003 1.36.092 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  <span className="text-sm font-medium">Continue with GitHub</span>
                </motion.button>
              </div>

              {/* small caption */}
              <p className="text-xs text-gray-500">Fast sign-up — we only request essential permissions.</p>
            </motion.div>

            {/* RIGHT: Email form (no border as requested) */}
            <motion.div whileHover={{ scale: 1.01 }} className="p-6 rounded-2xl bg-gradient-to-br from-white/70 to-white/50 dark:from-gray-900/60 dark:to-gray-900/40 shadow-lg flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Sign up with email</h3>
                <p className="text-sm text-gray-500 mt-1">We’ll email a magic link to finish creating your account.</p>
              </div>

              <div className="grid gap-3 mt-4">
                <label className="text-xs text-gray-500">Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full px-4 py-3 rounded-lg bg-white/90 dark:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-purple-400 transition" />

                <label className="text-xs text-gray-500">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="w-full px-4 py-3 rounded-lg bg-white/90 dark:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-purple-400 transition" />

                <label className="text-xs text-gray-500">College / University</label>
                <input value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Your institution" className="w-full px-4 py-3 rounded-lg bg-white/90 dark:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-purple-400 transition" />

                <div className="flex items-center justify-between gap-3 mt-2">
                  <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={signUpWithEmail} className="flex-1 px-4 py-3 rounded-lg bg-purple-600 text-white font-medium shadow-md hover:bg-purple-700 transition">
                    Send Magic Link
                  </motion.button>
                </div>

                <AnimatePresence>
                  {msg && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="mt-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <CheckCircle className="text-green-500" />
                      <span>{msg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
