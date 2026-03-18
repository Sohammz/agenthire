'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, StopCircle } from 'lucide-react';
import Nav from '../../components/Nav';

// 🔥 QUESTIONS
const QUESTION_POOL = [
  "Tell me about yourself",
  "Explain a challenging project you worked on",
  "What is binary search?",
  "Explain time complexity",
  "Tell me about a leadership experience",
  "What is recursion?",
  "Explain hashing",
  "Describe a failure and what you learned",
];

function getRandomQuestions(count = 5) {
  return QUESTION_POOL.sort(() => 0.5 - Math.random()).slice(0, count);
}

export default function InterviewPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const [questions] = useState(getRandomQuestions());
  const [stage, setStage] = useState<'instructions'|'prep'|'interview'|'analyzing'|'result'>('instructions');

  const [accepted, setAccepted] = useState(false);
  const [prepTimer, setPrepTimer] = useState(15);

  const [currentQ, setCurrentQ] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState<any[]>([]);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 🎥 CAMERA (FIXED ECHO)
  useEffect(() => {
    if (stage !== 'interview') return;

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
  }, [stage]);

  // ⏱ PREP TIMER
  useEffect(() => {
    if (stage !== 'prep') return;

    if (prepTimer === 0) {
      setStage('interview');
      return;
    }

    const t = setInterval(() => setPrepTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [prepTimer, stage]);

  // 🎤 START SPEECH
  const startSpeech = () => {
    const SR = (window as any).webkitSpeechRecognition;
    const r = new SR();

    r.continuous = true;
    r.interimResults = true;

    r.onresult = (e: any) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscript(text);
    };

    r.start();
    recognitionRef.current = r;
    setListening(true);
  };

  // 🛑 STOP SPEECH
  const stopSpeech = () => {
    recognitionRef.current?.stop();
    setListening(false);

    const updated = [
      ...conversation,
      { question: questions[currentQ], answer: transcript }
    ];

    setConversation(updated);
    setTranscript('');

    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setStage('analyzing');
      evaluate(updated);
    }
  };

  // 🧠 EVALUATE
  const evaluate = async (conv: any[]) => {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation: conv }),
    });

    const data = await res.json();

    setTimeout(() => {
      setResult(data);
      setStage('result');
    }, 5000);
  };

  // ================= INSTRUCTIONS =================
  if (stage === 'instructions') {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-b from-white to-slate-50 dark:from-gray-950 dark:to-gray-900">

      {/* LEFT SIDE — FULL PROFESSIONAL INSTRUCTIONS */}
      <div className="flex flex-col justify-center px-6 py-14 space-y-10">

        <div>
          <h1 className="text-5xl font-bold leading-tight">
            AI Proctored Interview Assessment
          </h1>

          <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-xl">
            This session simulates a real-world technical and behavioral interview environment. 
            Your performance will be continuously monitored and evaluated using AI-driven analysis 
            to provide structured, actionable feedback.
          </p>
        </div>

        {/* INSTRUCTIONS BLOCK */}
        <div className="space-y-8 text-gray-700 dark:text-gray-300">

          <div>
            <h3 className="text-purple-600 font-semibold text-lg mb-2">
              Interview Environment Requirements
            </h3>
            <p>
              Ensure that you are seated in a quiet, distraction-free environment with proper lighting. 
              Your face should remain clearly visible to the camera at all times. Avoid background noise 
              and interruptions, as they may affect transcription accuracy and evaluation quality.
            </p>
          </div>

          <div>
            <h3 className="text-purple-600 font-semibold text-lg mb-2">
              Communication Expectations
            </h3>
            <p>
              Speak clearly, confidently, and at a steady pace. Avoid filler words such as "um", "uh", 
              or incomplete thoughts. Your ability to articulate ideas, structure responses, and maintain 
              clarity will significantly impact your score.
            </p>
          </div>

          <div>
            <h3 className="text-purple-600 font-semibold text-lg mb-2">
              Behavioral Question Strategy
            </h3>
            <p>
              For behavioral questions, structure your responses using the STAR method 
              (Situation, Task, Action, Result). Provide concrete, real-world examples 
              rather than generic statements. Focus on impact, decision-making, and outcomes.
            </p>
          </div>

          <div>
            <h3 className="text-purple-600 font-semibold text-lg mb-2">
              Technical Question Approach
            </h3>
            <p>
              Clearly explain your thought process before arriving at a solution. Discuss edge cases, 
              trade-offs, and reasoning. Even if unsure, demonstrating structured thinking and logical 
              problem-solving is more valuable than arriving at a perfect answer.
            </p>

            <p className="mt-2 text-purple-600 font-medium">
              Assume reasonable test cases — your logic, clarity, and explanation are key evaluation factors.
            </p>
          </div>

          <div>
            <h3 className="text-purple-600 font-semibold text-lg mb-2">
              Monitoring & Evaluation
            </h3>
            <p>
              This interview is AI-proctored. Your speech patterns, response depth, engagement level, 
              and clarity will be continuously analyzed. Lack of response, vague answers, or 
              inconsistent communication may significantly reduce your overall score.
            </p>
          </div>

          <div>
            <h3 className="text-purple-600 font-semibold text-lg mb-2">
              Important Notes
            </h3>
            <p>
              This is not a casual practice session. Treat this as a real interview simulation. 
              Your goal should be to demonstrate structured thinking, clear communication, 
              and professional behavior throughout the session.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE — TERMS PANEL */}
      <div className="flex items-center justify-center px-10">

        <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border p-10 space-y-6">

          <h2 className="text-2xl font-semibold">
            Terms & Conditions
          </h2>

          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-4 max-h-[320px] overflow-y-auto pr-2 leading-relaxed">

            <p>
              • This interview is conducted using an AI-based evaluation system designed to simulate 
              real-world hiring scenarios.
            </p>

            <p>
              • Your audio responses will be recorded, transcribed, and analyzed to generate feedback 
              and scoring metrics.
            </p>

            <p>
              • You are expected to respond verbally. Silence, incomplete answers, or minimal effort 
              responses will result in significantly lower scores.
            </p>

            <p>
              • External assistance including search engines, notes, or third-party help is strongly discouraged.
            </p>

            <p>
              • Ensure that your microphone and camera permissions are enabled and functioning correctly 
              before starting the interview.
            </p>

            <p>
              • The evaluation is AI-generated and may not fully replicate human interviewer judgment, 
              but it follows structured industry-level criteria.
            </p>

            <p>
              • Any attempt to manipulate, bypass, or exploit the system may result in invalid results.
            </p>

            <p>
              • By proceeding, you acknowledge that this is a simulated assessment intended for practice 
              and self-improvement purposes.
            </p>

          </div>

          {/* CHECKBOX */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1"
            />
            <label className="text-sm text-gray-600 dark:text-gray-400">
              I have read, understood, and agree to the terms and conditions. 
              I am ready to proceed with the interview.
            </label>
          </div>

          {/* BUTTON */}
          <button
            disabled={!accepted}
            onClick={() => setStage('prep')}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition ${
              accepted
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Begin Interview
          </button>

        </div>
      </div>
    </div>
  );
}
  // ================= PREP =================
  if (stage === 'prep') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl mb-4">Get Ready...!</h1>
        <div className="text-6xl font-bold text-purple-600">{prepTimer}</div>
      </div>
    );
  }

  // ================= INTERVIEW =================
  if (stage === 'interview') {
    return (
      <div className="min-h-screen">
        <Nav />

        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-5 gap-6">

          {/* CAMERA */}
          <div className="md:col-span-3 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-2xl">
            <video ref={videoRef} autoPlay className="rounded-xl w-full h-[420px] object-cover" />

            <div className="mt-4">
              {!listening ? (
                <button onClick={startSpeech} className="bg-purple-600 text-white px-4 py-2 rounded-xl flex gap-2">
                 Start Speaking
                </button>
              ) : (
                <button onClick={stopSpeech} className="bg-red-500 text-white px-4 py-2 rounded-xl flex gap-2">
                  Stop
                </button>
              )}
            </div>
          </div>

          {/* QUESTION */}
          <div className="md:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl">
            <div className="text-sm text-gray-500">
              Question {currentQ + 1} / {questions.length}
            </div>

            <h2 className="text-lg font-semibold mt-2">
              {questions[currentQ]}
            </h2>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl min-h-[140px]">
              {transcript || "Start speaking..."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= ANALYZING =================
  if (stage === 'analyzing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
        <p className="mt-6 font-semibold">Analyzing your responses...</p>
      </div>
    );
  }

  // ================= RESULT =================
  if (stage === 'result' && result) {
    const percentage = result.score;

    return (
      <div className="min-h-screen flex items-center justify-center px-6">

        <div className="max-w-2xl w-full text-center space-y-8">

          <h1 className="text-2xl font-bold">Your Result</h1>

          {/* CIRCLE */}
          <div className="relative w-48 h-48 mx-auto">
            <svg className="transform -rotate-90 w-full h-full">
              <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="12" fill="none"/>
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#7c3aed"
                strokeWidth="12"
                fill="none"
                strokeDasharray={502}
                strokeDashoffset={502 - (502 * percentage)/100}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{result.score}</span>
              <span className="text-sm text-gray-500">out of 100</span>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="text-left text-gray-600 leading-relaxed bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            {result.summary?.split('\n').map((line: string, i: number) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>

          <button
            onClick={()=>window.location.href='/dashboard'}
            className="border px-6 py-3 rounded-xl"
          >
            Return to Dashboard
          </button>

        </div>
      </div>
    );
  }

  return null;
}