'use client';

import React, { useEffect, useRef, useState } from 'react';
import Nav from '../../../../components/Nav';
import { fetchProfile } from '../../../../lib/fetchProfile';
import { insertProfile } from '../../../../lib/insertProfile';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  User as UserIcon,
  Mail as MailIcon,
  Link2,
  Save as SaveIcon,
} from 'lucide-react';

/**
 * Single-file Profile edit/add page (UI tweaks per request)
 * - Right inputs: simple, no animations
 * - Save button moved to left preview card
 * - GitHub and LinkedIn show icons and "Provided"/"Missing" labels; clicking opens link or focuses input
 * - Required fields marked with asterisk
 * - No Reset option
 * - Logic (fetchProfile / insertProfile / redirect) unchanged
 */

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const [email, setEmail] = useState('');
  const router = useRouter();

  // Editable fields
  const [full_name, setFullName] = useState('');
  const [college_name, setCollegeName] = useState('');
  const [city, setCity] = useState('');
  const [birth_date, setBirthDate] = useState('');
  const [highest_education, setEducation] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin_url, setLinkedin] = useState('');
  const [github_url, setGithub] = useState('');
  const [resume_url, setResume] = useState('');
  const [preferred_roles, setRoles] = useState('');

  // refs to focus inputs when user clicks "Missing"
  const linkedinRef = useRef<HTMLInputElement | null>(null);
  const githubRef = useRef<HTMLInputElement | null>(null);
  const resumeRef = useRef<HTMLInputElement | null>(null);
  const fullNameRef = useRef<HTMLInputElement | null>(null);
  const collegeRef = useRef<HTMLInputElement | null>(null);

  // Fetch profile on mount (logic preserved)
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProfile();
        if (data) {
          setEmail(data.email || '');
          setFullName(data.full_name || '');
          setCollegeName(data.college_name || '');
          setCity(data.city || '');
          setBirthDate(data.birth_date || '');
          setEducation(data.highest_education || '');
          setPhone(data.phone || '');
          setLinkedin(data.linkedin_url || '');
          setGithub(data.github_url || '');
          setResume(data.resume_url || '');
          setRoles(data.preferred_roles || '');
        }
      } catch (err: any) {
        setMsg(err?.message || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const validateRequired = () => {
    const missing: string[] = [];
    if (!full_name.trim()) missing.push('Full name');
    if (!college_name.trim()) missing.push('College / University');
    if (!email.trim()) missing.push('Email');
    if (missing.length) {
      setMsg(`Please fill required: ${missing.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setMsg('');
    setSavedOk(false);

    if (!validateRequired()) return;

    setSaving(true);

    try {
      await insertProfile({
        full_name,
        college_name,
        city,
        birth_date,
        highest_education,
        phone,
        linkedin_url,
        github_url,
        resume_url,
        preferred_roles,
      });

      setMsg('Profile updated successfully');
      setSavedOk(true);

      // small UX delay then redirect (keeps your original behavior)
      setTimeout(() => {
        router.push('/dashboard');
      }, 900);
    } catch (err: any) {
      setMsg(err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-sm text-gray-500"
  >
    Loading profile...
  </motion.div></div>;

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-6xl px-6 py-18">
        {/* <motion.h1 initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
          My Profile
        </motion.h1> */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Profile preview card (Save moved here) */}
          <motion.section initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-2xl p-6 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/60 dark:to-gray-900/40 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-purple-100 to-purple-300 flex items-center justify-center text-purple-700 text-xl font-semibold shadow-inner">
                    {full_name ? full_name.split(' ').map(n => n[0]).slice(0, 2).join('') : <UserIcon />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-semibold truncate">{full_name || 'Your name'}</div>
                    <div className="text-sm text-gray-500 truncate">{email || '—'}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Stat label="College" value={college_name || '—'} />
                  <Stat label="City" value={city || '—'} />
                  <Stat label="Education" value={highest_education || '—'} />
                  <Stat label="Preferred" value={preferred_roles || '—'} />
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  {/* Save button on the left preview card as requested */}
                  {/* <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium shadow-md transition ${saving ? 'bg-purple-500 cursor-wait' : 'bg-purple-600 hover:bg-purple-700'}`}
                  >
                    <SaveIcon size={14} />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button> */}

                  {/* no Reset option anymore */}
                </div>
              </div>

              <div className="rounded-2xl p-6 bg-white/60 dark:bg-gray-900/60 shadow-lg">
                <h3 className="text-sm font-semibold mb-3">Links</h3>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm">
                        {/* LinkedIn inline SVG */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.25 11.268h-3v-5.5c0-1.378-.028-3.152-1.92-3.152-1.919 0-2.214 1.5-2.214 3.051v5.601h-3v-10h2.881v1.367h.041c.401-.76 1.381-1.56 2.843-1.56 3.041 0 3.604 2.001 3.604 4.6v5.593z" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">LinkedIn</div>
                        <div className="text-xs text-gray-500 truncate">{linkedin_url || 'Not provided'}</div>
                      </div>
                    </div>

                    <div>
                      {linkedin_url ? (
                        <a href={linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline">Open</a>
                      ) : (
                        <button
                          onClick={() => linkedinRef.current?.focus()}
                          className="text-xs text-gray-500 underline"
                        >
                          Missing
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm">
                        {/* GitHub inline SVG */}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                          <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.6 7.6 0 018 4.58c.68.003 1.36.092 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">GitHub</div>
                        <div className="text-xs text-gray-500 truncate">{github_url || 'Not provided'}</div>
                      </div>
                    </div>

                    <div>
                      {github_url ? (
                        <a href={github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline">Open</a>
                      ) : (
                        <button onClick={() => githubRef.current?.focus()} className="text-xs text-gray-500 underline">Missing</button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm">
                        {/* resume icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M6 2h7l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM13 3.5V9h5.5L13 3.5z" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">Resume</div>
                        <div className="text-xs text-gray-500 truncate">{resume_url || 'Not provided'}</div>
                      </div>
                    </div>

                    <div>
                      {resume_url ? (
                        <a href={resume_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 hover:underline">Open</a>
                      ) : (
                        <button onClick={() => resumeRef.current?.focus()} className="text-xs text-gray-500 underline">Missing</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 shadow-inner text-sm">
                <div className="flex items-start gap-3">
                  <MailIcon className="text-gray-500 mt-1" />
                  <div>
                    <div className="text-xs text-gray-500">Signed in as</div>
                    <div className="font-medium">{email || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* RIGHT: Editable form (simple inputs, no animation) */}
          <section className="lg:col-span-8">
            <div className="rounded-2xl bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/60 dark:to-gray-900/40 shadow-lg p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!saving) handleSave();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={fullNameRef}
                      value={full_name}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-3 py-2  rounded bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      College / University <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={collegeRef}
                      value={college_name}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="College name"
                      className="w-full px-3 py-2  rounded bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full px-3 py-2  rounded bg-white" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full px-3 py-2  rounded bg-white" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Birthdate</label>
                    <input type="date" value={birth_date || ''} onChange={(e) => setBirthDate(e.target.value)} className="w-full px-3 py-2  rounded bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Highest education</label>
                    <select value={highest_education} onChange={(e) => setEducation(e.target.value)} className="w-full px-3 py-2  rounded bg-white">
                      <option value="">Select highest education</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="PhD">PhD</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Preferred roles (comma separated)</label>
                    <input value={preferred_roles} onChange={(e) => setRoles(e.target.value)} placeholder="e.g., SDE, ML Engineer" className="w-full px-3 py-2 rounded bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn URL</label>
                    <input ref={linkedinRef} value={linkedin_url} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full px-3 py-2  rounded bg-white" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">GitHub URL</label>
                    <input ref={githubRef} value={github_url} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." className="w-full px-3 py-2 rounded bg-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Resume / Portfolio URL</label>
                  <input ref={resumeRef} value={resume_url} onChange={(e) => setResume(e.target.value)} placeholder="https://..." className="w-full px-3 py-2  rounded bg-white" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">About / Short bio</label>
                  <textarea value={''} onChange={() => { }} placeholder="(Optional) A short bio shown on your public profile" rows={3} className="w-full px-3 py-2  rounded bg-white" />
                  <div className="text-xs text-gray-400 mt-2">Tip: keep it short — 1–2 lines describing your focus and goals.</div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-2">
                  <div className="text-sm text-gray-500">{msg}</div>

                  <div >
                    
                    <button type="button" onClick={() => router.push('/dashboard')} className="px-4 py-1.5 mr-4 rounded-lg border hover:bg-gray-50 hover:text-purple-600 transition">
                      Cancel
                    </button>
                    <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium shadow-md transition ${saving ? 'bg-purple-500 cursor-wait' : 'bg-purple-600 hover:bg-purple-700'}`}
                  >
                    <SaveIcon size={14} />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      {/* success toast */}
      <AnimatePresence>
        {savedOk && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25 }} className="fixed right-6 bottom-6 z-50">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border rounded-lg px-4 py-3 shadow-lg">
              <CheckCircle className="text-green-500" />
              <div>
                <div className="font-semibold">Saved</div>
                <div className="text-sm text-gray-500">Your profile has been updated — redirecting…</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- small subcomponents ---------------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg p-3 bg-white/60 dark:bg-gray-900/60">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium truncate max-w-[12rem]">{value}</div>
    </div>
  );
}
