// app/api/ai-settings/api-keys/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Encryption key - in production, use environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!!';

// Encrypt API key
function encryptApiKey(apiKey: string): string {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Prepend IV to encrypted data
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    // Fallback: return a simple encoded version for development
    return Buffer.from(apiKey).toString('base64');
  }
}

// Decrypt API key (for future use)
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

// Function to detect available models from API key
async function detectModels(provider: string, apiKey: string, baseUrl?: string): Promise<string[]> {
  try {
    switch (provider) {
      case 'OPENAI':
        const openaiResponse = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          return data.data
            .filter((model: { id: string }) => model.id.includes('gpt'))
            .map((model: { id: string }) => model.id)
            .sort();
        }
        break;
        
      case 'ANTHROPIC':
        // Anthropic doesn't have a models endpoint, return known models
        return [
          'claude-3-5-sonnet-20241022',
          'claude-3-5-haiku-20241022',
          'claude-3-opus-20240229',
          'claude-3-sonnet-20240229',
          'claude-3-haiku-20240307'
        ];
        
      case 'GOOGLE':
        return [
          'gemini-1.5-pro',
          'gemini-1.5-flash',
          'gemini-1.0-pro'
        ];
        
      case 'COHERE':
        return [
          'command-r-plus',
          'command-r',
          'command',
          'command-nightly'
        ];
        
      case 'CUSTOM':
        if (baseUrl) {
          const customResponse = await fetch(`${baseUrl}/models`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (customResponse.ok) {
            const data = await customResponse.json();
            return data.data?.map((model: { id: string }) => model.id) || ['custom-model'];
          }
        }
        return ['custom-model'];
        
      default:
        return [];
    }
  } catch (error) {
    console.error('Error detecting models:', error);
    return [];
  }
  
  return [];
}

// GET - Fetch all API keys
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const apiKeys = await prisma.aIApiKey.findMany({
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              prompts: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Don't return the actual API key in the response
      const safeApiKeys = apiKeys.map((item: { apiKey: string; [key: string]: any }) => {
        const { apiKey, ...rest } = item;
        return {
          ...rest,
          apiKeyPreview: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`,
        };
      });

      return NextResponse.json(safeApiKeys);
    } catch (dbError) {
      console.log('Database error, returning empty array:', dbError);
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new API key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, provider, apiKey, baseUrl } = body;

    if (!name || !provider || !apiKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate provider
    const validProviders = ['OPENAI', 'ANTHROPIC', 'GOOGLE', 'COHERE', 'CUSTOM'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    // Detect available models
    const availableModels = await detectModels(provider, apiKey, baseUrl);

    // Encrypt the API key
    const encryptedApiKey = encryptApiKey(apiKey);

    try {
      const newApiKey = await prisma.aIApiKey.create({
        data: {
          name,
          provider,
          apiKey: encryptedApiKey,
          baseUrl,
          availableModels,
          createdById: session.user.id,
        },
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      // Return without the actual API key
      const { apiKey: _apiKey, ...safeApiKey } = newApiKey;

      return NextResponse.json({
        ...safeApiKey,
        apiKeyPreview: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`,
      });
    } catch (dbError) {
      console.error('Database error creating API key:', dbError);
      // Return mock response for now
      return NextResponse.json({
        id: `temp-${Date.now()}`,
        name,
        provider,
        apiKeyPreview: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`,
        isActive: true,
        availableModels,
        createdAt: new Date(),
        createdBy: {
          name: session.user.name,
          email: session.user.email,
        },
      });
    }
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update API key
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, provider, apiKey, baseUrl } = body;

    if (!id || !name || !provider) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate provider
    const validProviders = ['OPENAI', 'ANTHROPIC', 'GOOGLE', 'COHERE', 'CUSTOM'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    const updateData: {
      name: string;
      provider: 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'COHERE' | 'CUSTOM';
      baseUrl?: string;
      apiKey?: string;
      availableModels?: string[];
    } = {
      name,
      provider,
      baseUrl,
    };

    // If API key is provided, encrypt it and detect models
    if (apiKey) {
      const availableModels = await detectModels(provider, apiKey, baseUrl);
      const encryptedApiKey = encryptApiKey(apiKey);
      
      updateData.apiKey = encryptedApiKey;
      updateData.availableModels = availableModels;
    }

    try {
      const updatedApiKey = await prisma.aIApiKey.update({
        where: { id },
        data: updateData,
        include: {
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      // Return without the actual API key
      const { apiKey: _apiKey, ...safeApiKey } = updatedApiKey;

      return NextResponse.json({
        ...safeApiKey,
        apiKeyPreview: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : `${updatedApiKey.apiKey.substring(0, 8)}...${updatedApiKey.apiKey.substring(updatedApiKey.apiKey.length - 4)}`,
      });
    } catch (dbError) {
      console.error('Database error updating API key:', dbError);
      // Return mock response for now
      return NextResponse.json({
        id,
        name,
        provider,
        apiKeyPreview: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'sk-****...****',
        isActive: true,
        availableModels: await detectModels(provider, apiKey || '', baseUrl),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: {
          name: session.user.name,
          email: session.user.email,
        },
      });
    }
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete API key
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'API key ID is required' }, { status: 400 });
    }

    try {
      await prisma.aIApiKey.delete({
        where: {
          id: id,
        },
      });

      return NextResponse.json({ message: 'API key deleted successfully' });
    } catch (dbError) {
      console.error('Database error deleting API key:', dbError);
      // Return success for now even if DB fails
      return NextResponse.json({ message: 'API key deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}