import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as Blob;

  // Convert blob → file
  const audioFile = new File([file], 'audio.webm');

  const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: (() => {
      const fd = new FormData();
      fd.append("file", audioFile);
      fd.append("model", "whisper-1");
      return fd;
    })()
  });

  const data = await openaiRes.json();

  return NextResponse.json({
    text: data.text || "Could not transcribe"
  });
}