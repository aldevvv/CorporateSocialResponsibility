/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AIProvider" AS ENUM ('OPENAI', 'ANTHROPIC', 'GOOGLE', 'COHERE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PromptCategory" AS ENUM ('GENERAL', 'PROPOSAL_ANALYSIS', 'REPORT_GENERATION', 'DATA_INSIGHTS', 'DOCUMENT_SUMMARY');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "AIApiKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" "AIProvider" NOT NULL,
    "apiKey" TEXT NOT NULL,
    "baseUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "availableModels" TEXT[],
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIPrompt" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "systemPrompt" TEXT NOT NULL,
    "userPrompt" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "maxTokens" INTEGER NOT NULL DEFAULT 1000,
    "category" "PromptCategory" NOT NULL DEFAULT 'GENERAL',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIPrompt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIApiKey" ADD CONSTRAINT "AIApiKey_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIPrompt" ADD CONSTRAINT "AIPrompt_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "AIApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIPrompt" ADD CONSTRAINT "AIPrompt_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
