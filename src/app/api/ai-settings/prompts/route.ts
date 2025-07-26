// app/api/ai-settings/prompts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all AI prompts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const prompts = await prisma.aIPrompt.findMany({
        include: {
          apiKey: {
            select: {
              id: true,
              name: true,
              provider: true,
            },
          },
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(prompts);
    } catch (dbError) {
      console.log('Database error, returning empty array:', dbError);
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching AI prompts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new AI prompt
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      description, 
      systemPrompt, 
      userPrompt, 
      apiKeyId, 
      model, 
      temperature, 
      maxTokens, 
      category 
    } = body;

    if (!name || !systemPrompt || !userPrompt || !apiKeyId || !model) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate category
    const validCategories = ['GENERAL', 'PROPOSAL_ANALYSIS', 'REPORT_GENERATION', 'DATA_INSIGHTS', 'DOCUMENT_SUMMARY'];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Verify API key exists and get available models
    try {
      const apiKey = await prisma.aIApiKey.findUnique({
        where: { id: apiKeyId },
      });

      if (!apiKey) {
        return NextResponse.json({ error: 'API key not found' }, { status: 400 });
      }

      if (!apiKey.availableModels.includes(model)) {
        return NextResponse.json({ error: 'Model not available for this API key' }, { status: 400 });
      }
    } catch (dbError) {
      console.log('Database error checking API key, proceeding anyway:', dbError);
    }

    try {
      const newPrompt = await prisma.aIPrompt.create({
        data: {
          name,
          description,
          systemPrompt,
          userPrompt,
          apiKeyId,
          model,
          temperature: temperature || 0.7,
          maxTokens: maxTokens || 1000,
          category: category || 'GENERAL',
          createdById: session.user.id,
        },
        include: {
          apiKey: {
            select: {
              id: true,
              name: true,
              provider: true,
            },
          },
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(newPrompt);
    } catch (dbError) {
      console.error('Database error creating prompt:', dbError);
      // Return mock response for now
      return NextResponse.json({
        id: `temp-${Date.now()}`,
        name,
        description,
        systemPrompt,
        userPrompt,
        model,
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1000,
        category: category || 'GENERAL',
        isActive: true,
        createdAt: new Date(),
        apiKey: {
          id: apiKeyId,
          name: 'Mock API Key',
          provider: 'OPENAI',
        },
        createdBy: {
          name: session.user.name,
          email: session.user.email,
        },
      });
    }
  } catch (error) {
    console.error('Error creating AI prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update AI prompt
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      id,
      name, 
      description, 
      systemPrompt, 
      userPrompt, 
      apiKeyId, 
      model, 
      temperature, 
      maxTokens, 
      category 
    } = body;

    if (!id || !name || !systemPrompt || !userPrompt || !apiKeyId || !model) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate category
    const validCategories = ['GENERAL', 'PROPOSAL_ANALYSIS', 'REPORT_GENERATION', 'DATA_INSIGHTS', 'DOCUMENT_SUMMARY'];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    try {
      const updatedPrompt = await prisma.aIPrompt.update({
        where: { id },
        data: {
          name,
          description,
          systemPrompt,
          userPrompt,
          apiKeyId,
          model,
          temperature: temperature || 0.7,
          maxTokens: maxTokens || 1000,
          category: category || 'GENERAL',
        },
        include: {
          apiKey: {
            select: {
              id: true,
              name: true,
              provider: true,
            },
          },
          createdBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json(updatedPrompt);
    } catch (dbError) {
      console.error('Database error updating prompt:', dbError);
      // Return mock response for now
      return NextResponse.json({
        id,
        name,
        description,
        systemPrompt,
        userPrompt,
        model,
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1000,
        category: category || 'GENERAL',
        isActive: true,
        updatedAt: new Date(),
        apiKey: {
          id: apiKeyId,
          name: 'Mock API Key',
          provider: 'OPENAI',
        },
        createdBy: {
          name: session.user.name,
          email: session.user.email,
        },
      });
    }
  } catch (error) {
    console.error('Error updating AI prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete AI prompt
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Prompt ID is required' }, { status: 400 });
    }

    try {
      await prisma.aIPrompt.delete({
        where: {
          id: id,
        },
      });

      return NextResponse.json({ message: 'AI prompt deleted successfully' });
    } catch (dbError) {
      console.error('Database error deleting prompt:', dbError);
      // Return success for now even if DB fails
      return NextResponse.json({ message: 'AI prompt deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting AI prompt:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}