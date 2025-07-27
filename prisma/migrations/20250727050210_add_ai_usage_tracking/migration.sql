-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('SUCCESS', 'ERROR', 'TIMEOUT', 'RATE_LIMITED');

-- CreateTable
CREATE TABLE "AIUsageLog" (
    "id" TEXT NOT NULL,
    "promptId" TEXT,
    "apiKeyId" TEXT,
    "model" TEXT NOT NULL,
    "provider" "AIProvider" NOT NULL,
    "userId" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "requestTokens" INTEGER,
    "responseTokens" INTEGER,
    "totalTokens" INTEGER,
    "responseTime" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'SUCCESS',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIUsageLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIUsageLog" ADD CONSTRAINT "AIUsageLog_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "AIPrompt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIUsageLog" ADD CONSTRAINT "AIUsageLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "AIApiKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIUsageLog" ADD CONSTRAINT "AIUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
