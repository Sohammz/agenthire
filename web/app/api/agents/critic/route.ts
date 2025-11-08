// web/app/api/agents/critic/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseServer';

type Body = {
  session_id: string;
  question_id: string;
  question_text: string;
  question_type: 'behavioral' | 'technical';
  user_answer: string;
  ideal_answer?: string;
};

const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(prompt: string) {
  if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY not set');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a concise technical interviewer critic. Output JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.0,
      max_tokens: 800
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }
  return (await res.json()) as any;
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { session_id, question_id, question_text, question_type, user_answer, ideal_answer } = body;

    let prompt = '';
    if (question_type === 'behavioral') {
      prompt = `
Evaluate the candidate answer using STAR rubric and return JSON ONLY.

Question: "${question_text}"
Candidate answer: "${user_answer}"
Ideal/notes: "${ideal_answer ?? ''}"

Return JSON exactly like:
{
  "score": <0-10>,
  "criteria": {
    "situation_present": true/false,
    "task_present": true/false,
    "action_present": true/false,
    "result_present": true/false,
    "conciseness": <0-5>,
    "suggestions": "<short actionable suggestions>"
  }
}
`;
    } else {
      prompt = `
You are a technical interviewer critic. Evaluate the candidate's answer w.r.t correctness, approach, complexity, and clarity. Return JSON ONLY.

Question: "${question_text}"
Candidate answer: "${user_answer}"
Ideal/notes: "${ideal_answer ?? ''}"

Return JSON exactly like:
{
  "score": <0-10>,
  "criteria": {
    "correctness": <0-5>,
    "approach_clarity": <0-3>,
    "complexity_discussed": true/false,
    "suggestions": "<concise actionable feedback>"
  }
}
`;
    }

    const openaiResp = await callOpenAI(prompt);
    const content = openaiResp?.choices?.[0]?.message?.content ?? '';

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      parsed = {
        score: 6,
        criteria: { suggestions: content }
      };
    }

    // save to supabase
    const { data: saved, error: saveErr } = await supabaseAdmin
      .from('responses')
      .insert([{
        session_id,
        question_id,
        user_answer,
        agent_feedback: parsed,
        score: parsed.score ?? null
      }])
      .select()
      .single();

    return NextResponse.json({ ok: true, feedback: parsed, saved: !!saved, saveErr: saveErr ?? null });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
