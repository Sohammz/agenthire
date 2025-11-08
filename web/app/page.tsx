'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  FileText,
  Users,
  Activity,
  Zap,
  Layers,
  Repeat,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import Nav from '../components/Nav'
import Footer from '../components/Footer'
/**
 * Upgraded HomePage — more professional, stronger animations & refined "How it works"
 * Accent: purple
 * Framer Motion variants typed as Record<string, any> to avoid TS issues
 */

const containerFade: Record<string, any> = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const cardRise: Record<string, any> = {
  hidden: { opacity: 0, y: 12, scale: 0.995 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 160, damping: 22 } },
};

const float: Record<string, any> = {
  floatA: { y: [0, -6, 0], transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } },
  floatB: { y: [0, -8, 0], transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } },
};

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 antialiased">
      <Nav/>
      {/* HERO */}

      <header className="pt-28 pb-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.18 }}
              variants={containerFade}
              className="lg:col-span-7 space-y-6"
            >
              <motion.p variants={cardRise} className="inline-flex items-center gap-3 text-sm uppercase tracking-wide text-purple-600 font-semibold">
                <Activity size={16} /> Research-driven • Multi-agent orchestration
              </motion.p>

              <motion.h1
                variants={cardRise}
                className="mt-2 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                <span className="italic font-medium" style={{ fontFamily: "'Sora', serif" }}>Agent</span>
                <span className="font-extrabold uppercase ml-0">HIRE</span>
              </motion.h1>

              <motion.p variants={cardRise} className="max-w-2xl text-lg text-gray-700 dark:text-gray-300">
                Practice like the interviews you’ll face. AgentHire composes specialized AI agents to analyze roles, craft questions,
                simulate realistic interviews and deliver structured, actionable feedback — so you improve with measurable sessions.
              </motion.p>

              <motion.div variants={cardRise} className="flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl shadow-2xl transition transform hover:-translate-y-0.5 active:scale-95"
                >
                  Get started <ArrowRight size={16} />
                </Link>

                <a
                  href="/ICIRSET2025-[201].pptx"
                  download
                  className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-100 bg-white/70 dark:bg-gray-800/50 hover:bg-gray-100 transition shadow"
                >
                  <FileText size={16} /> Read our paper
                </a>

                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <Play size={14} /> Quick demo
                </button>
              </motion.div>

              <motion.div variants={cardRise} className="mt-6">
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  <Stat label="Agents" value="5 specialized" />
                  <Stat label="Iterations" value="Adaptive loops" />
                  <Stat label="Domains" value="Engineering-first" />
                </div>
              </motion.div>
            </motion.div>

            {/* Right preview */}
            <motion.div
              variants={cardRise}
              className="lg:col-span-5"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="relative mx-auto w-full max-w-md">
                <div className="rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/4 overflow-hidden border">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">Mock Interview Snapshot</h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Real-time STAR analysis, scoring and concise improvement hints.
                      </p>

                      <div className="mt-4 grid gap-2">
                        <MiniChip label="STAR completeness" value="8 / 10" />
                        <MiniChip label="Conciseness" value="7 / 10" />
                        <MiniChip label="Tech accuracy" value="9 / 10" />
                      </div>

                      <div className="mt-5 flex gap-3 items-center">
                        <button className="px-3 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition shadow hover:-translate-y-0.5">Practice now</button>
                        <button className="px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-800 transition">View report</button>
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      <div className="h-20 w-20 rounded-lg bg-gradient-to-tr from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-700/10 flex items-center justify-center shadow">
                        <Users size={30} className="text-purple-700 dark:text-purple-300" />
                      </div>
                    </div>
                  </div>
                </div>

                {!prefersReducedMotion && (
                  <>
                    <motion.div variants={float} animate="floatA" className="absolute -left-6 -top-6 h-16 w-16 rounded-full bg-purple-50 dark:bg-purple-900/10 blur-md opacity-80" />
                    <motion.div variants={float} animate="floatB" className="absolute -right-6 -bottom-6 h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-800/10 blur-md opacity-70" />
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* HOW IT WORKS — redesigned timeline */}
      <main className="pb-24">
        <div className="mx-auto max-w-7xl px-6 space-y-20">
          <section id="how-it-works">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <h2 className="text-3xl font-bold font-sora">How AgentHire works</h2>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  A coordinated pipeline of agents—analysis, question generation, drafting, mock interviewing and critique—creates an efficient loop for measurable improvement.
                </p>

                <div className="mt-6 flex gap-3">
                  <a href="/ICIRSET2025-[201].pptx" download className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
                    Read paper <ArrowRight size={14} />
                  </a>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Try a mock
                  </Link>
                </div>
              </div>

              {/* timeline */}
              <div className="lg:col-span-2 ">
                <motion.div initial="hidden" whileInView="show" variants={containerFade} viewport={{ once: true }}>
                  <div className="relative">
                    {/* vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 hidden md:block" />

                    <div className="space-y-6 md:space-y-8 ml-9">
                      <TimelineStep
                        index={1}
                        title="Role Analysis"
                        desc="InfoAgent extracts role requirements, skills and company signals from public sources (jobs, Glassdoor, official pages)."
                        icon={<Zap size={16} />}
                      />
                      <TimelineStep
                        index={2}
                        title="Question Curation"
                        desc="ExampleAgent curates behavioral and technical questions tailored to the role and difficulty level."
                        icon={<Layers size={16} />}
                      />
                      <TimelineStep
                        index={3}
                        title="Mock Interview"
                        desc="MockInterviewAgent conducts a live session, records answers, and captures timestamps & code snippets when relevant."
                        icon={<Repeat size={16} />}
                      />
                      <TimelineStep
                        index={4}
                        title="Critique & Iterate"
                        desc="CriticAgent scores responses across STAR metrics and suggests actionable improvements — iteration continues until thresholds are met."
                        icon={<CheckCircle size={16} />}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section>
            <SectionTitle title="What makes AgentHire special" subtitle="Designed for measurable practice and fast iteration." />
            <motion.div initial="hidden" whileInView="show" variants={containerFade} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                title="Multi-Agent Orchestration"
                desc="Director, Info, Example, AnswerDraft, MockInterview and Critic — specialized agents that collaborate."
                icon={<Activity size={18} />}
              />
              <FeatureCard
                title="STAR-first Coaching"
                desc="Behavioral responses structured to STAR and improved automatically until they meet quality standards."
                icon={<Users size={18} />}
              />
              <FeatureCard
                title="Technical Mocking"
                desc="Adaptive coding prompts with hints, pseudocode outlines and follow-up questions."
                icon={<FileText size={18} />}
              />
            </motion.div>
          </section>

          {/* TEAM */}
          <section>
            <SectionTitle title="Team" subtitle="Creators & contributors" />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <TeamCard name="Prof. Vaishali Hirelkar" role="Guide" />
              <TeamCard name="Soham Wanganekar" role="Lead" />
              <TeamCard name="Deeksha Upadhyay" role="Co-Lead" />
              <TeamCard name="Manthan Rathod" role="Research" />
              <TeamCard name="Shubham Sonkusare" role="Database Administrator" />
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-2xl">
            <div className="md:flex md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl font-semibold">Ready to practice with purpose?</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">Start a session and get structured feedback in minutes.</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl shadow hover:bg-purple-700 transition"
                >
                  Start practicing <ArrowRight size={16} />
                </Link>
                <a className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition" href="#how-it-works">
                  Learn how
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      
    </div>

  );
}

/* ---------- Subcomponents ---------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}

function MiniChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md text-sm shadow-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1" id={title.toLowerCase().replace(/\s+/g, '-')}>
        {title}
      </h2>
      {subtitle && <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>}
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center text-purple-700">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{desc}</p>
        </div>
      </div>
    </motion.article>
  );
}

function TimelineStep({ index, title, desc, icon }: { index: number; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative md:pl-12"
    >
      <div className="absolute left-0 top-1 md:left-4 md:top-0">
        <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border shadow">
          <div className="text-purple-600">{icon}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow hover:shadow-2xl transition transform hover:-translate-y-1">
        <div className="flex items-center justify-between gap-4">
          <h4 className="font-semibold">{title}</h4>
          <div className="text-sm text-gray-500">Step {index}</div>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{desc}</p>
      </div>
    </motion.div>
  );
}

function TeamCard({ name, role, note }: { name: string; role?: string; note?: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-2xl transition">
      <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-700/10 flex items-center justify-center text-purple-700">
        <Users size={18} />
      </div>
      <div>
        <div className="font-semibold">{name}</div>
        {role && <div className="text-xs text-gray-500">{role}</div>}
        {note && <div className="text-xs text-gray-400 mt-1">{note}</div>}
      </div>
    </motion.div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg p-4 bg-white dark:bg-gray-900 shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}
