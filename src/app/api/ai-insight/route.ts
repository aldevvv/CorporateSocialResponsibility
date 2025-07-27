// app/api/ai-insight/route.ts
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import crypto from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Encryption key - should match the one in api-keys route
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!!';

// Decrypt API key function
function decryptApiKey(encryptedApiKey: string): string {
  try {
    if (!encryptedApiKey.includes(':')) {
      // Fallback: decode base64 for development
      return Buffer.from(encryptedApiKey, 'base64').toString('utf8');
    }
    
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    
    const [ivHex, encrypted] = encryptedApiKey.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedApiKey; // Return as-is if decryption fails
  }
}

// Function to get AI response based on provider
async function getAIResponse(provider: string, apiKey: string, model: string, prompt: string, temperature: number, maxTokens: number) {
  switch (provider) {
    case 'GOOGLE':
      const genAI = new GoogleGenerativeAI(apiKey);
      const googleModel = genAI.getGenerativeModel({
        model: model,
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens,
        }
      });
      return await googleModel.generateContentStream(prompt);

    case 'OPENAI':
      const openai = new OpenAI({ apiKey });
      return await openai.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: temperature,
        max_tokens: maxTokens,
        stream: true,
      });

    case 'ANTHROPIC':
      const anthropic = new Anthropic({ apiKey });
      return await anthropic.messages.stream({
        model: model,
        max_tokens: maxTokens,
        temperature: temperature,
        messages: [{ role: 'user', content: prompt }],
      });

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

// Function to log AI usage
async function logAIUsage(
  promptId: string | null,
  apiKeyId: string | null,
  model: string,
  provider: string,
  userId: string | null,
  userAgent: string | null,
  ipAddress: string | null,
  responseTime: number,
  status: 'SUCCESS' | 'ERROR' | 'TIMEOUT' | 'RATE_LIMITED' = 'SUCCESS',
  errorMessage?: string,
  requestTokens?: number,
  responseTokens?: number,
  totalTokens?: number
) {
  try {
    // Validate provider enum
    const validProviders = ['OPENAI', 'ANTHROPIC', 'GOOGLE', 'COHERE', 'CUSTOM'];
    const validProvider = validProviders.includes(provider) ? provider : 'CUSTOM';
    
    await prisma.aIUsageLog.create({
      data: {
        promptId,
        apiKeyId,
        model,
        provider: validProvider as 'OPENAI' | 'GOOGLE' | 'ANTHROPIC', // Cast to enum
        userId,
        userAgent,
        ipAddress,
        responseTime,
        status,
        errorMessage,
        requestTokens,
        responseTokens,
        totalTokens,
      }
    });
  } catch (logError) {
    console.error('Failed to log AI usage:', logError);
    // Don't throw error to avoid breaking the main request
  }
}

export async function POST(req: Request) {
  const startTime = Date.now();
  let activePrompt: {
    id: string;
    systemPrompt: string;
    userPrompt: string;
    model: string;
    temperature: number;
    maxTokens: number;
    apiKeyId: string;
    apiKey: {
      provider: string;
      apiKey: string;
    };
  } | null = null;
  let userId: string | null = null;
  
  try {
    // Get session for user tracking
    const session = await getServerSession(authOptions) as { user?: { id: string } } | null;
    userId = session?.user?.id || null;
    
    // Get request metadata
    const userAgent = req.headers.get('user-agent') || null;
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
    
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    // 1. Get active AI prompt for general chatbot (fallback to first active prompt)
    try {
      activePrompt = await prisma.aIPrompt.findFirst({
        where: {
          isActive: true,
          category: 'GENERAL'
        },
        include: {
          apiKey: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // If no GENERAL prompt found, get any active prompt
      if (!activePrompt) {
        activePrompt = await prisma.aIPrompt.findFirst({
          where: {
            isActive: true
          },
          include: {
            apiKey: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      }
    } catch (dbError) {
      console.log('Database error fetching AI prompt, using fallback:', dbError);
    }

    // 2. Check if no active prompt found (should not happen with default data)
    if (!activePrompt) {
      console.error('No active AI prompt found in database. Please configure AI Settings.');
      
      const errorStream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode('AI Assistant belum dikonfigurasi. Silakan hubungi administrator untuk mengatur AI Settings.'));
          controller.close();
        },
      });

      return new Response(errorStream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // 3. Get program data for context
    const programs = await prisma.program.findMany({
      select: {
        judul: true,
        pilar: true,
        status: true,
        anggaranFinal: true,
        lokasiKabupaten: true,
        lokasiKecamatan: true,
        penanggungJawab: {
          select: {
            name: true
          }
        }
      },
    });
    const context = JSON.stringify(programs, null, 2);

    // 4. Build the complete prompt using the configured system and user prompts
    const systemPrompt = activePrompt.systemPrompt;
    const userPromptTemplate = activePrompt.userPrompt;
    
    // Replace placeholders in user prompt template
    const processedUserPrompt = userPromptTemplate
      .replace('{context}', context)
      .replace('{userMessage}', userMessage);

    const fullPrompt = `${systemPrompt}\n\n${processedUserPrompt}`;

    // 5. Decrypt API key and get AI response
    const decryptedApiKey = decryptApiKey(activePrompt.apiKey.apiKey);
    const aiResponse = await getAIResponse(
      activePrompt.apiKey.provider,
      decryptedApiKey,
      activePrompt.model,
      fullPrompt,
      activePrompt.temperature,
      activePrompt.maxTokens
    );

    // 6. Create stream based on provider with usage logging
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let totalResponseText = '';
        
        try {
          if (activePrompt!.apiKey.provider === 'GOOGLE') {
            const googleResponse = aiResponse as { stream: AsyncIterable<{ text(): string }> };
            for await (const chunk of googleResponse.stream) {
              const text = chunk.text();
              totalResponseText += text;
              controller.enqueue(encoder.encode(text));
            }
          } else if (activePrompt!.apiKey.provider === 'OPENAI') {
            const openaiResponse = aiResponse as AsyncIterable<{ choices: Array<{ delta?: { content?: string } }> }>;
            for await (const chunk of openaiResponse) {
              const text = chunk.choices[0]?.delta?.content || '';
              if (text) {
                totalResponseText += text;
                controller.enqueue(encoder.encode(text));
              }
            }
          } else if (activePrompt!.apiKey.provider === 'ANTHROPIC') {
            const anthropicResponse = aiResponse as AsyncIterable<{ type: string; delta?: { text?: string } }>;
            for await (const chunk of anthropicResponse) {
              if (chunk.type === 'content_block_delta' && chunk.delta) {
                const text = chunk.delta.text || '';
                if (text) {
                  totalResponseText += text;
                  controller.enqueue(encoder.encode(text));
                }
              }
            }
          }
          
          // Log successful usage
          const responseTime = Date.now() - startTime;
          const requestTokens = Math.ceil(fullPrompt.length / 4); // Rough estimate: 4 chars per token
          const responseTokens = Math.ceil(totalResponseText.length / 4);
          const totalTokens = requestTokens + responseTokens;
          
          await logAIUsage(
            activePrompt!.id,
            activePrompt!.apiKeyId,
            activePrompt!.model,
            activePrompt!.apiKey.provider,
            userId,
            userAgent,
            ipAddress,
            responseTime,
            'SUCCESS',
            undefined,
            requestTokens,
            responseTokens,
            totalTokens
          );
          
        } catch (streamError) {
          console.error('Streaming error:', streamError);
          controller.enqueue(encoder.encode('Maaf, terjadi kesalahan saat memproses respons AI.'));
          
          // Log error usage
          const responseTime = Date.now() - startTime;
          await logAIUsage(
            activePrompt?.id || null,
            activePrompt?.apiKeyId || null,
            activePrompt?.model || 'unknown',
            activePrompt?.apiKey?.provider || 'unknown',
            userId,
            userAgent,
            ipAddress,
            responseTime,
            'ERROR',
            streamError instanceof Error ? streamError.message : String(streamError)
          );
        }
        
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('Error in AI insight API:', error);
    
    // Log error usage
    const responseTime = Date.now() - startTime;
    await logAIUsage(
      activePrompt?.id || null,
      activePrompt?.apiKeyId || null,
      activePrompt?.model || 'unknown',
      activePrompt?.apiKey?.provider || 'unknown',
      userId,
      req.headers.get('user-agent') || null,
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
      responseTime,
      'ERROR',
      error instanceof Error ? error.message : String(error)
    );
    
    // Return error stream
    const errorStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode('Maaf, terjadi kesalahan sistem. Silakan coba lagi nanti.'));
        controller.close();
      },
    });

    return new Response(errorStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}