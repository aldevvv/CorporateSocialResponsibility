// app/api/ai-insight/route.ts
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const userMessage = messages[messages.length - 1].content;

  // 1. Ambil data konteks dari database
  const programs = await prisma.program.findMany({
    select: {
      judul: true,
      pilar: true,
      status: true,
      anggaranFinal: true,
    },
  });
  const context = JSON.stringify(programs, null, 2);

  // 2. Buat prompt yang detail untuk AI
  const prompt = `
    Anda adalah seorang asisten analis program TJSL untuk PLN UIP Sulawesi.
    Tugas Anda adalah menjawab pertanyaan dari manajer berdasarkan data program yang ada.
    Jawablah dengan ringkas, profesional, dan dalam Bahasa Indonesia.

    Berikut adalah data program dalam format JSON:
    ${context}

    Berdasarkan data di atas, jawablah pertanyaan berikut: "${userMessage}"
  `;

  // 3. Panggil model AI dan dapatkan hasilnya sebagai stream
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContentStream(prompt);

  // 4. Buat stream manual untuk dikirim ke frontend
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of result.stream) {
        const text = chunk.text();
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}