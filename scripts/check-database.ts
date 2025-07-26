import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Check if users table exists and count users
    const userCount = await prisma.user.count()
    console.log(`📊 Total users in database: ${userCount}`)
    
    // List all users (without passwords for security)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })
    
    console.log('👥 Users in database:')
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ID: ${user.id}`)
    })
    
    if (userCount === 0) {
      console.log('⚠️  No users found. You may need to create a test user.')
      console.log('💡 Run: npx tsx scripts/create-test-user.ts')
    }
    
  } catch (error) {
    console.error('❌ Database error:', error)
    console.log('💡 Make sure PostgreSQL is running and DATABASE_URL is correct')
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()