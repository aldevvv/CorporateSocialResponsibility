import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@test.com' }
    })

    if (existingUser) {
      console.log('✅ Test user already exists:', existingUser.email)
      return
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const user = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin Test',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('✅ Test user created successfully:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })
  } catch (error) {
    console.error('❌ Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()