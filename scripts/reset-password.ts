import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetUserPassword() {
  try {
    console.log('🔍 Looking for admin user...')
    
    const user = await prisma.user.findUnique({
      where: { email: 'admin@pln.co.id' }
    })

    if (!user) {
      console.log('❌ User not found')
      return
    }

    console.log('✅ User found:', { id: user.id, email: user.email, role: user.role })
    
    // Reset password to 'password123'
    const newPassword = 'password123'
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    console.log('✅ Password reset successfully!')
    console.log('📝 New login credentials:')
    console.log(`   Email: ${user.email}`)
    console.log(`   Password: ${newPassword}`)
    
  } catch (error) {
    console.error('❌ Error resetting password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetUserPassword()