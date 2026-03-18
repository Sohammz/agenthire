import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { conversation } = await req.json();

    const noSpeech = conversation.every(
      (c: any) => !c.answer || c.answer.trim().length < 5
    );

    if (noSpeech) {
      return NextResponse.json({
        score: 0,
        summary:
          "You did not speak during the interview. Please check your microphone settings and ensure you respond verbally. Communication is a critical part of interviews."
      });
    }

    const prompt = `
You are a strict FAANG interviewer.

Evaluate the full interview.

${conversation.map((c: any, i: number) => `
Q${i + 1}: ${c.question}
A${i + 1}: ${c.answer}
`).join('\n')}

Rules:
- Score MUST be between 0 to 100
- Be strict
- No generic feedback
- Give detailed reasoning

Return JSON:
{
  "score": number,
  "summary": "10-12 line detailed explanation why this score was given, what was good, what was missing, how to improve"
}
`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'You are an expert interviewer.' },
          { role: 'user', content: prompt }
        ]
      }),
    });

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';

    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json({
        score: 50,
        summary: "Evaluation failed. Please retry."
      });
    }

  } catch {
    return NextResponse.json({
      score: 40,
      summary: "Unexpected error occurred."
    });
  }
}