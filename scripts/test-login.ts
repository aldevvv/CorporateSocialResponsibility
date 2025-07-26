import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testLogin() {
  try {
    const email = 'admin@pln.co.id'
    const testPasswords = ['password123', 'admin', 'password', 'admin123', '123456']
    
    console.log('🔍 Testing login for:', email)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ User not found')
      return
    }

    console.log('✅ User found:', { id: user.id, email: user.email, role: user.role })
    console.log('🔍 Testing common passwords...')
    
    for (const password of testPasswords) {
      const isValid = await bcrypt.compare(password, user.password)
      console.log(`   "${password}": ${isValid ? '✅ VALID' : '❌ Invalid'}`)
      
      if (isValid) {
        console.log(`🎉 Login successful with password: "${password}"`)
        break
      }
    }
    
    console.log('\n💡 If none of the passwords work, run: npm run db:reset-password')
    
  } catch (error) {
    console.error('❌ Error testing login:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()