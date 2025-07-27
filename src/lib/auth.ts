import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔍 Auth attempt with credentials:', { 
          email: credentials?.email, 
          hasPassword: !!credentials?.password 
        })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          console.log('🔍 Looking for user in database...')
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log('❌ User not found in database')
            return null
          }

          console.log('✅ User found:', { id: user.id, email: user.email, role: user.role })
          console.log('🔍 Comparing passwords...')
          
          const isPasswordValid = await compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log('❌ Password invalid')
            return null
          }

          console.log('✅ Password valid, authentication successful')
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('❌ Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name || undefined;
        token.email = user.email || undefined;
      }
      // Update token jika ada update session
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
      }
      
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string || session.user.name;
        session.user.email = token.email as string || session.user.email;
      }
      
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
}