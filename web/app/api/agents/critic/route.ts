import { NextResponse } from 'next/server';

const OPENAI_KEY = process.env.OPENAI_API_KEY;

function isBadAnswer(text: string) {
  if (!text) return true;
  const t = text.trim();

  if (t.length < 15) return true;
  if (/^[a-zA-Z\s]+$/.test(t) && t.split(' ').length < 3) return true;

  return false;
}

export async function POST(req: Request) {
  try {
    const { session_id, questions } = await req.json();

    const validatedQuestions = questions.map((q: any) => ({
      ...q,
      is_invalid: isBadAnswer(q.user_answer),
    }));

    // 🔥 Build prompt
    const prompt = `
You are a STRICT FAANG interviewer.

Evaluate the following interview.

IMPORTANT RULES:
- If answer is invalid (empty, vague, meaningless) → score MUST be 0
- DO NOT give generic suggestions
- Suggestions must be SPECIFIC to the answer
- Be detailed and constructive
- Give ideal answers that are high-quality

${validatedQuestions.map((q: any, i: number) => `
Q${i + 1}: ${q.question_text}
Answer: ${q.user_answer}
Invalid: ${q.is_invalid}
`).join('\n')}

Return ONLY JSON:
{
  "questions": [
    {
      "score": number,
      "feedback": "detailed evaluation",
      "ideal_answer": "strong example answer",
      "suggestions": "very specific improvements"
    }
  ]
}
`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 1000,
        messages: [
          { role: 'system', content: 'You are a strict technical interviewer.' },
          { role: 'user', content: prompt }
        ]
      }),
    });

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { questions: [] };
    }

    // 🔥 FORCE INVALID TO ZERO
    parsed.questions = parsed.questions.map((q: any, i: number) => {
      if (validatedQuestions[i].is_invalid) {
        return {
          score: 0,
          feedback: "Valid Response Missing",
          ideal_answer: "Provide a structured and complete response.",
          suggestions:
            "Explain your approach step-by-step, include reasoning, and give a complete answer instead of a short response."
        };
      }
      return q;
    });

    return NextResponse.json(parsed);

  } catch (err) {
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}