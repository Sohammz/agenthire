// components/AgentsPractice.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Q = {
  id: string;
  text: string;
  type?: 'behavioral' | 'technical';
  difficulty?: number;
  ideal_answer?: string | null;
};

export default function AgentsPractice() {
  // session / fetched questions
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [loading, setLoading] = useState(false);

  // UI state
  const [index, setIndex] = useState(0); // current question index
  const [answers, setAnswers] = useState<Record<string, string>>({}); // answers keyed by question id
  const [feedbacks, setFeedbacks] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [role, setRole] = useState('SWE Intern');

  // --- Start session: fetch a small number of questions (3 behavioral, 2 technical) ---
  async function startSession() {
    setLoading(true);
    setResultsVisible(false);
    setFeedbacks({});
    setAnswers({});
    setIndex(0);

    try {
      const res = await fetch('/api/agents/example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, behavioral_count: 1, technical_count: 2, user_id: 'user-demo' }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => 'no body');
        throw new Error(`startSession failed: ${res.status} ${text}`);
      }

      const j = await res.json();
      const b: Q[] = (j.behavioral ?? []).map((q: any, i: number) => ({ id: q.id ?? `b-${i}`, text: q.text ?? q.prompt ?? '', type: 'behavioral', difficulty: q.difficulty, ideal_answer: q.ideal_answer ?? q.ideal ?? null }));
      const t: Q[] = (j.technical ?? []).map((q: any, i: number) => ({ id: q.id ?? `t-${i}`, text: q.text ?? q.prompt ?? '', type: 'technical', difficulty: q.difficulty, ideal_answer: q.ideal_answer ?? q.ideal ?? null }));
      const combined = [...b, ...t];

      // initialize answers map (each question has its own textarea)
      const init: Record<string, string> = {};
      combined.forEach((q) => (init[q.id] = ''));
      setAnswers(init);

      setSessionId(j.session_id ?? String(Date.now()));
      setQuestions(combined);
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Could not start session');
    } finally {
      setLoading(false);
    }
  }

  // --- Update answer for a specific question (fixes the mirrored input bug) ---
  function setAnswer(qid: string, text: string) {
    setAnswers((prev) => ({ ...prev, [qid]: text }));
  }

  // --- Load ideal/model answer into that question's textarea ---
  function loadIdeal(q: Q) {
    setAnswers((prev) => ({ ...prev, [q.id]: q.ideal_answer ?? '' }));
  }

  // --- Submit all answers sequentially to critic and show pretty results ---
  async function submitAll() {
    if (!sessionId) {
      alert('Start a session first.');
      return;
    }

    // basic validation: ensure at least some answers present
    const allEmpty = Object.values(answers).every((a) => !a || a.trim() === '');
    if (allEmpty && !confirm('All answers are empty. Submit anyway?')) return;

    setSubmitting(true);
    setFeedbacks({});
    setResultsVisible(false);

    try {
      const newFeedbacks: Record<string, any> = {};

      for (const q of questions) {
        const payload = {
          session_id: sessionId,
          question_id: q.id,
          question_text: q.text,
          question_type: q.type ?? (q.id?.startsWith('t-') ? 'technical' : 'behavioral'),
          user_answer: (answers[q.id] ?? '').trim(),
          ideal_answer: q.ideal_answer ?? '',
        };

        const res = await fetch('/api/agents/critic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        let j: any;
        try {
          j = await res.json();
        } catch (e) {
          j = { raw: await res.text().catch(() => 'invalid response') };
        }

        newFeedbacks[q.id] = j.feedback ?? j;
        // small pacing delay so UI feels deliberate (optional)
        await new Promise((r) => setTimeout(r, 150));
      }

      setFeedbacks(newFeedbacks);
      setResultsVisible(true);
      // scroll top so user sees result
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert('Error submitting answers — check console.');
    } finally {
      setSubmitting(false);
    }
  }

  // --- friendly feedback renderer: try structured fields then fallback to pretty JSON ---
  function renderFeedback(qid: string) {
    const f = feedbacks[qid];
    if (!f) return <div className="text-sm text-gray-500">No feedback yet.</div>;

    // commonly useful keys: score, summary, suggestions, strengths, weaknesses
    const score = f.score ?? f.rating ?? f.score_overall ?? null;
    const summary = f.summary ?? f.overall ?? f.explanation ?? f.note ?? null;
    const suggestions = f.suggestions ?? f.improvements ?? f.recommendations ?? null;
    const strengths = f.strengths ?? null;
    const weaknesses = f.weaknesses ?? null;

    return (
      <div className="space-y-3">
        {score != null && (
          <div>
            <div className="text-xs text-gray-500">Score</div>
            <div className="text-lg font-semibold">{String(score)}</div>
          </div>
        )}

        {summary && (
          <div>
            <div className="text-xs text-gray-500">Summary</div>
            <div className="text-sm text-gray-800 dark:text-gray-200">{String(summary)}</div>
          </div>
        )}

        {strengths && Array.isArray(strengths) && (
          <div>
            <div className="text-xs text-gray-500">Strengths</div>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {strengths.map((s: any, i: number) => <li key={i}>{String(s)}</li>)}
            </ul>
          </div>
        )}

        {weaknesses && Array.isArray(weaknesses) && (
          <div>
            <div className="text-xs text-gray-500">Weaknesses</div>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {weaknesses.map((s: any, i: number) => <li key={i}>{String(s)}</li>)}
            </ul>
          </div>
        )}

        {suggestions && Array.isArray(suggestions) && (
          <div>
            <div className="text-xs text-gray-500">Suggestions</div>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {suggestions.map((s: any, i: number) => <li key={i}>{String(s)}</li>)}
            </ul>
          </div>
        )}

        {/* Fallback: pretty JSON if nothing matched */}
        {!score && !summary && !suggestions && !strengths && !weaknesses && (
          <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs overflow-auto">{JSON.stringify(f, null, 2)}</pre>
        )}
      </div>
    );
  }

  // --- simple motion variants ---
  const variants = { enter: { opacity: 0, y: 8 }, center: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: "'Sora', sans-serif" }}>AgentHire — Practice</h1>
          <p className="text-sm text-gray-500 mt-1">Answer one question at a time. Submit only at the end to get formatted feedback.</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 border rounded w-56"
            placeholder="Role (e.g. SWE Intern)"
          />
          <button
            onClick={startSession}
            disabled={loading}
            className={`px-4 py-2 rounded text-white font-medium shadow ${loading ? 'bg-purple-400 cursor-wait' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {loading ? 'Starting...' : 'Start Session'}
          </button>
        </div>
      </div>

      {sessionId && (
        <div className="mb-4 text-sm text-gray-600">
          Session ID: <span className="font-mono">{sessionId}</span>
        </div>
      )}

      {questions.length === 0 ? (
        <div className="rounded-2xl p-6 bg-white dark:bg-gray-900 shadow">
          <p className="text-sm text-gray-500">No questions loaded. Click <strong>Start Session</strong> to fetch a short set (3 behavioral + 2 technical).</p>
        </div>
      ) : (
        <>
          {/* Card showing single question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={questions[index].id}
              initial="enter"
              animate="center"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.22 }}
              className="rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-gray-500 uppercase">{questions[index].type ?? 'Question'}</div>
                  <h2 className="text-lg font-semibold mt-1">{questions[index].text}</h2>
                </div>

                <div className="text-right text-sm text-gray-400">
                  <div>Question {index + 1} / {questions.length}</div>
                  {questions[index].difficulty && <div className="mt-1">Difficulty: {questions[index].difficulty}</div>}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs text-gray-500">Your answer</label>
                <textarea
                  value={answers[questions[index].id] ?? ''}
                  onChange={(e) => setAnswer(questions[index].id, e.target.value)}
                  rows={questions[index].type === 'technical' ? 8 : 5}
                  placeholder={questions[index].type === 'technical' ? 'Explain approach / pseudocode / complexity...' : 'Write STAR formatted response (Situation, Task, Action, Result)...'}
                  className="w-full mt-2 p-3 rounded border resize-y bg-white/95 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button onClick={() => loadIdeal(questions[index])} className="px-3 py-1 rounded border text-sm">Load ideal answer</button>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setIndex((i) => Math.max(0, i - 1))}
                    disabled={index === 0}
                    className={`px-3 py-1 rounded text-sm ${index === 0 ? 'opacity-50 cursor-not-allowed' : 'border hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>

                  {index < questions.length - 1 ? (
                    <button
                      onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
                      className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={submitAll}
                      disabled={submitting}
                      className={`px-4 py-2 rounded text-white ${submitting ? 'bg-purple-400 cursor-wait' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                      {submitting ? 'Submitting...' : 'Submit & Get Feedback'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Results section (human-readable) */}
          {resultsVisible && (
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-semibold">Results</h3>

              {questions.map((q) => (
                <div key={q.id} className="rounded-lg p-4 bg-gray-50 dark:bg-gray-800/40 shadow">
                  <div className="flex items-start gap-4">
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500">{q.type?.toUpperCase()}</div>
                      <div className="font-medium">{q.text}</div>

                      <div className="mt-2">
                        <div className="text-xs text-gray-500">Your answer</div>
                        <div className="mt-1 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 bg-white/60 p-3 rounded">
                          {answers[q.id] ? answers[q.id] : <span className="text-gray-400">— no answer provided —</span>}
                        </div>
                      </div>

                      {q.ideal_answer && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-500">Ideal / Model answer</div>
                          <div className="mt-1 text-sm text-gray-700 dark:text-gray-300 bg-white/60 p-3 rounded">{q.ideal_answer}</div>
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="text-xs text-gray-500">Critic feedback</div>
                        <div className="mt-2">
                          {renderFeedback(q.id)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* helpful tip */}
          <div className="mt-6 text-sm text-gray-500">
            Tip: answer each question in its own box. Use <strong>Next</strong> to move forward and <strong>Submit</strong> on the last screen to get aggregated feedback.
          </div>
        </>
      )}
    </div>
  );
}
