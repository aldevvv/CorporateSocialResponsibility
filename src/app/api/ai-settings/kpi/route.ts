// app/api/ai-settings/kpi/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch KPI data for AI Settings (current active API key and prompt)
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as { user?: { id: string; role: string; name?: string; email?: string } } | null;
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Get currently active AI prompt (same logic as ai-insight route)
      let activePrompt = await prisma.aIPrompt.findFirst({
        where: {
          isActive: true,
          category: 'GENERAL'
        },
        include: {
          apiKey: {
            select: {
              id: true,
              name: true,
              provider: true,
              isActive: true,
              availableModels: true,
              createdAt: true,
            }
          },
          createdBy: {
            select: {
              name: true,
              email: true,
            }
          }
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
            apiKey: {
              select: {
                id: true,
                name: true,
                provider: true,
                isActive: true,
                availableModels: true,
                createdAt: true,
              }
            },
            createdBy: {
              select: {
                name: true,
                email: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      }

      // Get total counts for KPI
      const [totalApiKeys, totalPrompts, activeApiKeys, activePrompts] = await Promise.all([
        prisma.aIApiKey.count(),
        prisma.aIPrompt.count(),
        prisma.aIApiKey.count({ where: { isActive: true } }),
        prisma.aIPrompt.count({ where: { isActive: true } })
      ]);

      // Get real usage statistics from AIUsageLog
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Get usage statistics
      const [
        totalRequestsCount,
        successfulRequestsCount,
        thisMonthRequestsCount,
        avgResponseTimeResult
      ] = await Promise.all([
        // Total requests ever
        prisma.aIUsageLog.count(),
        
        // Successful requests for success rate calculation
        prisma.aIUsageLog.count({
          where: { status: 'SUCCESS' }
        }),
        
        // This month's requests
        prisma.aIUsageLog.count({
          where: {
            createdAt: {
              gte: startOfMonth
            }
          }
        }),
        
        // Average response time
        prisma.aIUsageLog.aggregate({
          _avg: {
            responseTime: true
          },
          where: {
            status: 'SUCCESS'
          }
        })
      ]);

      // Calculate metrics
      const totalRequests = totalRequestsCount;
      const successRate = totalRequests > 0 ? Math.round((successfulRequestsCount / totalRequests) * 100) : 0;
      const avgResponseTime = avgResponseTimeResult._avg.responseTime ? Math.round(avgResponseTimeResult._avg.responseTime / 1000) : 0; // Convert to seconds
      const monthlyLimit = 10000; // This could be configurable
      const usedThisMonth = thisMonthRequestsCount;

      // Build KPI response in the format expected by the frontend
      const kpiData = {
        // Usage statistics (real data from database)
        totalRequests,
        successRate,
        avgResponseTime,
        activeModels: activeApiKeys,
        monthlyLimit,
        usedThisMonth,
        
        // Additional detailed data for future use
        currentlyUsed: {
          apiKey: activePrompt?.apiKey ? {
            id: activePrompt.apiKey.id,
            name: activePrompt.apiKey.name,
            provider: activePrompt.apiKey.provider,
            availableModels: activePrompt.apiKey.availableModels,
            createdAt: activePrompt.apiKey.createdAt,
          } : null,
          prompt: activePrompt ? {
            id: activePrompt.id,
            name: activePrompt.name,
            description: activePrompt.description,
            category: activePrompt.category,
            model: activePrompt.model,
            temperature: activePrompt.temperature,
            maxTokens: activePrompt.maxTokens,
            createdAt: activePrompt.createdAt,
            createdBy: activePrompt.createdBy,
          } : null,
        },
        statistics: {
          totalApiKeys,
          totalPrompts,
          activeApiKeys,
          activePrompts,
          inactiveApiKeys: totalApiKeys - activeApiKeys,
          inactivePrompts: totalPrompts - activePrompts,
        },
        status: {
          isConfigured: !!activePrompt,
          hasActiveApiKey: !!activePrompt?.apiKey,
          hasActivePrompt: !!activePrompt,
          readyForUse: !!(activePrompt && activePrompt.apiKey),
        }
      };

      return NextResponse.json(kpiData);

    } catch (dbError) {
      console.error('Database error fetching KPI data:', dbError);
      
      // Return basic KPI structure with error info
      return NextResponse.json({
        // Frontend expected fields
        totalRequests: 0,
        successRate: 0,
        avgResponseTime: 0,
        activeModels: 0,
        monthlyLimit: 0,
        usedThisMonth: 0,
        
        // Additional detailed data
        currentlyUsed: {
          apiKey: null,
          prompt: null,
        },
        statistics: {
          totalApiKeys: 0,
          totalPrompts: 0,
          activeApiKeys: 0,
          activePrompts: 0,
          inactiveApiKeys: 0,
          inactivePrompts: 0,
        },
        status: {
          isConfigured: false,
          hasActiveApiKey: false,
          hasActivePrompt: false,
          readyForUse: false,
        },
        error: 'Database connection error'
      });
    }

  } catch (error) {
    console.error('Error fetching AI Settings KPI:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}