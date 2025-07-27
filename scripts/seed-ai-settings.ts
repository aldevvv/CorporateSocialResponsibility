// scripts/seed-ai-settings.ts
import { PrismaClient, PromptCategory } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Encryption key - should match the one in api-keys route
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!!';

// Encrypt API key function
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

async function seedAISettings() {
  try {
    console.log('🌱 Seeding AI Settings...');

    // Get Google API key from environment
    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!googleApiKey) {
      throw new Error('GOOGLE_API_KEY not found in environment variables');
    }

    // Get admin user (first user with ADMIN role)
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });

    if (!adminUser) {
      throw new Error('No admin user found. Please create an admin user first.');
    }

    console.log(`📝 Using admin user: ${adminUser.name} (${adminUser.email})`);

    // 1. Create default Google API Key
    console.log('🔑 Creating default Google API Key...');
    
    const encryptedGoogleApiKey = encryptApiKey(googleApiKey);
    
    const defaultApiKey = await prisma.aIApiKey.create({
      data: {
        name: 'Default Google Gemini',
        provider: 'GOOGLE',
        apiKey: encryptedGoogleApiKey,
        isActive: true,
        availableModels: [
          'gemini-1.5-pro',
          'gemini-1.5-flash',
          'gemini-1.0-pro'
        ],
        createdById: adminUser.id,
      }
    });

    console.log(`✅ Created API Key: ${defaultApiKey.name} (ID: ${defaultApiKey.id})`);

    // 2. Create default AI Prompt for chatbot
    console.log('💬 Creating default AI Prompt...');
    
    const defaultPrompt = await prisma.aIPrompt.create({
      data: {
        name: 'Default TJSL Assistant',
        description: 'Default prompt untuk AI Assistant TJSL PLN UIP Sulawesi',
        systemPrompt: 'Anda adalah seorang asisten analis program TJSL untuk PLN UIP Sulawesi. Tugas Anda adalah menjawab pertanyaan dari manajer berdasarkan data program yang ada. Jawablah dengan ringkas, profesional, dan dalam Bahasa Indonesia.',
        userPrompt: 'Berikut adalah data program dalam format JSON:\n{context}\n\nBerdasarkan data di atas, jawablah pertanyaan berikut: "{userMessage}"',
        apiKeyId: defaultApiKey.id,
        model: 'gemini-1.5-flash',
        temperature: 0.7,
        maxTokens: 1000,
        category: PromptCategory.GENERAL,
        isActive: true,
        createdById: adminUser.id,
      }
    });

    console.log(`✅ Created AI Prompt: ${defaultPrompt.name} (ID: ${defaultPrompt.id})`);

    // 3. Create additional prompts for different use cases
    console.log('📋 Creating additional AI Prompts...');

    const additionalPrompts = [
      {
        name: 'Proposal Analysis Assistant',
        description: 'AI Assistant untuk analisis proposal program CSR',
        systemPrompt: 'Anda adalah seorang analis proposal program TJSL yang berpengalaman. Tugas Anda adalah menganalisis proposal program CSR dan memberikan insight yang mendalam.',
        userPrompt: 'Analisis proposal berikut berdasarkan data program:\n{context}\n\nPertanyaan: {userMessage}',
        category: PromptCategory.PROPOSAL_ANALYSIS,
        temperature: 0.5,
        maxTokens: 1500,
      },
      {
        name: 'Report Generation Assistant',
        description: 'AI Assistant untuk membantu pembuatan laporan program',
        systemPrompt: 'Anda adalah seorang asisten yang ahli dalam pembuatan laporan program TJSL. Bantu user dalam menyusun laporan yang komprehensif dan terstruktur.',
        userPrompt: 'Berdasarkan data program berikut:\n{context}\n\nBantu saya dengan: {userMessage}',
        category: PromptCategory.REPORT_GENERATION,
        temperature: 0.3,
        maxTokens: 2000,
      },
      {
        name: 'Data Insights Assistant',
        description: 'AI Assistant untuk analisis data dan insight program',
        systemPrompt: 'Anda adalah seorang data analyst yang ahli dalam menganalisis data program TJSL dan memberikan insight bisnis yang valuable.',
        userPrompt: 'Data program yang tersedia:\n{context}\n\nBerikan insight untuk: {userMessage}',
        category: PromptCategory.DATA_INSIGHTS,
        temperature: 0.4,
        maxTokens: 1200,
      }
    ];

    for (const promptData of additionalPrompts) {
      const prompt = await prisma.aIPrompt.create({
        data: {
          ...promptData,
          apiKeyId: defaultApiKey.id,
          model: 'gemini-1.5-flash',
          isActive: true,
          createdById: adminUser.id,
        }
      });
      console.log(`✅ Created AI Prompt: ${prompt.name} (ID: ${prompt.id})`);
    }

    console.log('\n🎉 AI Settings seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created 1 API Key (Google Gemini)`);
    console.log(`- Created ${additionalPrompts.length + 1} AI Prompts`);
    console.log(`- Default chatbot prompt: "${defaultPrompt.name}"`);

  } catch (error) {
    console.error('❌ Error seeding AI Settings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedAISettings()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedAISettings;