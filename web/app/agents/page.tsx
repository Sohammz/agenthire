'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

type Q = {
  id: string;
  text: string;
  type?: 'behavioral' | 'technical';
};

export default function AgentsPractice() {
  const [started, setStarted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, any>>({});
  const [index, setIndex] = useState(0);
  const [resultsVisible, setResultsVisible] = useState(false);

  async function startSession() {
    const res = await fetch('/api/agents/example', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ behavioral_count: 1, technical_count: 2 }),
    });

    const j = await res.json();
    const combined = [...(j.behavioral || []), ...(j.technical || [])];

    const formatted = combined.map((q: any, i: number) => ({
      id: q.id || String(i),
      text: q.text,
      type: q.type,
    }));

    const init: Record<string, string> = {};
    formatted.forEach((q: Q) => (init[q.id] = ''));

    setQuestions(formatted);
    setAnswers(init);
    setSessionId(j.session_id);
  }

  function setAnswer(qid: string, text: string) {
    setAnswers((prev) => ({ ...prev, [qid]: text }));
  }

  async function submitAll() {
    setLoading(true);

    await new Promise((r) => setTimeout(r, 5000));

    const res = await fetch('/api/agents/critic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        questions: questions.map(q => ({
          question_id: q.id,
          question_text: q.text,
          question_type: q.type,
          user_answer: answers[q.id],
        }))
      }),
    });

    const j = await res.json();

    const mapped: Record<string, any> = {};
    j.questions?.forEach((q: any, i: number) => {
      mapped[questions[i].id] = q;
    });

    setFeedbacks(mapped);
    setLoading(false);
    setResultsVisible(true);
  }

  const totalScore = Object.values(feedbacks).reduce(
    (acc: number, f: any) => acc + (f?.score || 0),
    0
  );

  const percentage = (totalScore / 30) * 100;

  // ================= INSTRUCTION =================
  if (!started) {
    return (
      <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-gray-900">

        {/* LEFT */}
        <div className="flex flex-col justify-center px-12 py-12 space-y-8">

          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Mock Interview Assessment
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              This assessment simulates a real-world technical and behavioral interview.
              Your responses will be evaluated to provide structured and actionable feedback.
            </p>
          </div>

          {/* INSTRUCTIONS */}
          <div className="space-y-6 text-gray-700 dark:text-gray-300">

            <div>
              <h3 className="font-semibold text-purple-600 mb-1">General Guidelines</h3>
              <p>
                Answer each question thoughtfully. Focus on clarity, logical flow, and communication.
                Avoid vague or one-line responses.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-600 mb-1">Behavioral Questions</h3>
              <p>
                Structure your responses using the STAR method (Situation, Task, Action, Result).
                Provide specific examples rather than generic statements.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-600 mb-1">Technical Questions</h3>
              <p>
                Write your solution in any programming language of your choice. Focus on explaining your approach,
                edge cases, and reasoning clearly.
              </p>
              <p className="mt-1 text-purple-600 font-medium">
                Assume reasonable test cases — your logic and correctness will be evaluated.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-purple-600 mb-1">Evaluation Criteria</h3>
              <p>
                Your performance will be assessed based on communication clarity, problem-solving approach,
                technical accuracy, and answer completeness.
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-8">

          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border p-8 space-y-6">

            <h2 className="text-xl font-semibold">Terms & Conditions</h2>

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3 max-h-48 overflow-y-auto pr-2">

              <p>• This is a simulated interview for practice and evaluation purposes only.</p>
              <p>• Your responses may be processed to generate feedback and improve the system.</p>
              <p>• Do not submit plagiarized or copied answers.</p>
              <p>• Ensure you are in a distraction-free environment.</p>
              <p>• The evaluation is AI-generated and may not fully reflect real interviewer judgment.</p>

            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <label className="text-sm">
                I have read and agree to the terms and guidelines.
              </label>
            </div>

            <button
              disabled={!accepted}
              onClick={() => {
                setStarted(true);
                startSession();
              }}
              className={`w-full py-3 rounded-xl ${accepted
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-300 text-gray-500'
                }`}
            >
              Start Assessment
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
        <p className="mt-6 text-lg font-semibold">
          Evaluating your performance...
        </p>
      </div>
    );
  }

  // ================= QUESTIONS =================
  if (started && !resultsVisible && questions.length > 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full mb-6">
          <div
            className="bg-purple-600 h-2 rounded-full"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={questions[index].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border"
          >
            <h2 className="text-xl font-semibold mb-6">
              {questions[index].text}
            </h2>

            <textarea
              className={`w-full p-4 rounded-xl ${questions[index].type === 'technical'
                  ? 'bg-[#0f172a] text-white font-mono min-h-[180px]'
                  : 'border min-h-[140px]'
                }`}
              value={answers[questions[index].id]}
              onChange={(e) =>
                setAnswer(questions[index].id, e.target.value)
              }
            />

            <div className="flex justify-between mt-6">
              <button onClick={() => setIndex(i => Math.max(i - 1, 0))}>
                <ArrowLeft />
              </button>

              {index < questions.length - 1 ? (
                <button
                  onClick={() => setIndex(i => i + 1)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl"
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={submitAll}
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl"
                >
                  Submit <CheckCircle size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ================= RESULT =================
  if (resultsVisible) {
    return (
      <div className="min-h-screen px-6 py-12">

        {/* SCORE */}
        <div className="text-center mb-10">

          <p className="text-sm text-purple-600 font-medium tracking-wide">
            Your Result
          </p>

          <div className="relative w-40 h-40 mx-auto mt-3">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="10" fill="none" />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#7c3aed"
                strokeWidth="10"
                fill="none"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * percentage) / 100}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
              {totalScore}/30
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-4">
            Interview Performance
          </h2>

          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            This score reflects your overall performance across behavioral and technical responses.
          </p>

          {/* 🔥 BUTTONS */}
          <div className="flex justify-center gap-4 mt-6">

            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 rounded-xl border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Return to Dashboard
            </button>

            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition"
            >
              Retry Test
            </button>

          </div>
        </div>
        {/* PER QUESTION */}
        <div className="max-w-4xl mx-auto space-y-6">
          {questions.map((q) => {
            const f = feedbacks[q.id];
            return (
              <div key={q.id} className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border">

                <h3 className="font-semibold mb-2">{q.text}</h3>

                <div className="text-sm text-gray-500">Your Answer</div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mt-1 whitespace-pre-wrap">
                  {answers[q.id]}
                </div>

                {f && (
                  <div className="mt-4 space-y-2">

                    <div className="text-purple-600 font-semibold">
                      Score: {f.score}/10
                    </div>

                    <div className="text-sm text-gray-600">
                      {f.feedback}
                    </div>

                    {f.feedback && (
                      <div className="text-sm text-gray-500">
                        {/* Suggestions: Improve clarity, structure, and completeness. */}
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    );
  }

  return null;
}