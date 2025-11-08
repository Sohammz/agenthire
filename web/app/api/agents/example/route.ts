// web/app/api/agents/example/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseServer';

type Body = {
  role?: string;
  user_id?: string | null;
  behavioral_count?: number;
  technical_count?: number;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const role = (body.role || 'SWE Intern').trim();
    const behavioral_count = body.behavioral_count ?? 5;
    const technical_count = body.technical_count ?? 3;

    // create session
    const { data: session } = await supabaseAdmin
      .from('sessions')
      .insert([{ user_id: body.user_id || null, role }])
      .select()
      .single();

    // fetch behavioral questions for role
    const { data: behavioralRows } = await supabaseAdmin
      .from('questions')
      .select('id, role, type, text, ideal_answer, difficulty')
      .eq('role', role)
      .eq('type', 'behavioral')
      .order('created_at', { ascending: false })
      .limit(behavioral_count);

    // fetch technical questions for role
    const { data: technicalRows } = await supabaseAdmin
      .from('questions')
      .select('id, role, type, text, ideal_answer, difficulty')
      .eq('role', role)
      .eq('type', 'technical')
      .order('created_at', { ascending: false })
      .limit(technical_count);

    const behavioral = (behavioralRows && behavioralRows.length) ? behavioralRows : [
      { id: 'builtin-b-1', text: 'Tell me about a time you led a team to solve a hard problem.', type: 'behavioral' }
    ];

    const technical = (technicalRows && technicalRows.length) ? technicalRows : [
      { id: 'builtin-t-1', text: 'Find the first non-repeated character in a string.', type: 'technical' }
    ];

    return NextResponse.json({
      session_id: session?.id ?? null,
      role,
      behavioral,
      technical
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
