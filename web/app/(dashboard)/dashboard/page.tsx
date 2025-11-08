// app/(dashboard)/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Nav from '../../../components/Nav';
import { supabaseBrowser } from '../../../lib/supabaseClient';
import { fetchProfile } from '../../../lib/fetchProfile';
import { syncProfile } from '../../../lib/syncProfile';
import Link from 'next/link';
import { User, Mail, Briefcase, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Professional Dashboard (client)
 * - Shows basic user/profile data
 * - Displays "Analytics coming soon" placeholders
 * - Preserves supabase auth logic (supabaseBrowser + syncProfile)
 */

export default function DashboardClient() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // keep profile synced
    syncProfile();

    const supabase = supabaseBrowser();
    let mounted = true;

    const load = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(data.user ?? null);

        // try to fetch extended profile via helper (if available)
        try {
          const p = await fetchProfile();
          if (mounted) setProfile(p ?? null);
        } catch (err) {
          // ignore profile fetch failure (still show basic user)
          console.warn('fetchProfile failed', err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      // optionally refresh profile on auth changes
      fetchProfile().then((p) => mounted && setProfile(p ?? null)).catch(() => {});
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  if (loading) {
    return (
      <>
        <Nav />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-gray-500">Loading dashboard…</div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Nav />
        <main className="mx-auto max-w-4xl px-6 py-12 mb-80">
          <div className="rounded-2xl p-8 bg-white dark:bg-gray-900 shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-2">Not signed in</h2>
            <p className="text-sm text-gray-600 mb-6">Please sign in to access your dashboard and mock interviews.</p>
            <Link href="/login" className="inline-block px-4 py-2 rounded-lg bg-purple-600 text-white">Login</Link>
          </div>
        </main>
      </>
    );
  }

  // display name fallback
  const displayName = (profile?.full_name || user.user_metadata?.full_name || user.email?.split?.('@')?.[0] || 'User').trim();

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-6xl px-6 py-18">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold" style={{ fontFamily: "'Sora', sans-serif" }}>Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, <span className="font-medium">{displayName}</span>.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/profile" className="px-3 py-2 rounded-lg border hover:bg-gray-50 transition text-sm">Edit profile</Link>
            <Link href="/agents" className="px-3 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition">Start mock interview</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Profile summary */}
          <section className="lg:col-span-4">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-purple-100 to-purple-300 flex items-center justify-center text-purple-700 text-xl font-semibold">
                  <User />
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-semibold truncate">{displayName}</div>
                  <div className="text-sm text-gray-500 truncate">{user.email}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <InfoRow label="College" value={profile?.college_name || 'Not provided'} icon={<Briefcase />} />
                <InfoRow label="City" value={profile?.city || 'Not provided'} icon={<Mail />} />
                <InfoRow label="Preferred roles" value={profile?.preferred_roles || 'Not specified'} icon={<PieChart />} />
              </div>
{/* 
              <div className="mt-6">
                <h4 className="text-sm text-gray-500 mb-2">Paper & slides</h4>
                <div className="flex gap-2">
                  <a href="/ICIRSET2025-[201].pptx" className="text-sm px-3 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition">Download slides</a>
                  <a href="/ResearchPaper.docx" className="text-sm px-3 py-2 rounded-md border hover:bg-gray-50 transition">Paper (docx)</a>
                </div>
                <p className="mt-3 text-xs text-gray-400">Research and conference material for AgentHire. :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3}</p>
              </div> */}
            </motion.div>
          </section>

          {/* RIGHT: Main area - basic stats + analytics placeholder */}
          <section className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Overview</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Mock interviews" value="0" note="No sessions yet" />
                <StatCard title="Average score" value="—" note="Will appear after first mock" />
                <StatCard title="Completed loops" value="—" note="Adaptive improvements will show here" />
              </div>

              <div className="mt-6">
                <div className="rounded-md border-dashed border-2 border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-1">
                  <div>
                    <h4 className="font-semibold">Analytics — coming soon</h4>
                    <p className="text-sm text-gray-500 mt-1">We’ll surface detailed session analytics (scores, trends, strengths & weaknesses) once you complete mock interviews. For now you can edit your profile and start a practice run.</p>
                  </div>

                  <div className="flex gap-3">
                    <Link href="/dashboard/interviews" className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">Start mock</Link>
                    {/* <Link href="/dashboard/profile" className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition">Edit profile</Link> */}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Quick actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ActionCard title="Run quick practice" desc="Short behavioral drills (5 minutes)" href="/practice/quick" />
                  <ActionCard title="Take full mock" desc="Full technical + behavioral session" href="/dashboard/interviews" />
                </div>
              </div>

              <div className="mt-6 text-xs text-gray-400">
                Note: analytics and visual reports are being built — they will appear here once you run mock interviews.
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </>
  );
}

/* -------------------- Small UI helpers -------------------- */

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-purple-600">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

function StatCard({ title, value, note }: { title: string; value: string; note?: string }) {
  return (
    <div className="rounded-lg p-4 bg-gray-50 dark:bg-gray-800/40">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {note && <div className="text-xs text-gray-400 mt-2">{note}</div>}
    </div>
  );
}

function ActionCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="rounded-lg p-4 border hover:shadow transition flex flex-col">
      <div className="font-medium">{title}</div>
      <div className="text-xs text-gray-500 mt-2">{desc}</div>
    </Link>
  );
}
