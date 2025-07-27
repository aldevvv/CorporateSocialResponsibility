import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Connection health check function
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true, error: null };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

// Graceful shutdown
export async function disconnectDatabase() {
  await prisma.$disconnect();
}

export default prisma;