import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Demo mode - bypass backend API for demonstration
        if (credentials.email === 'demo@teachgage.com' && credentials.password === 'demo123') {
          return {
            id: 'demo-user-123',
            email: 'demo@teachgage.com',
            name: 'Demo Teacher',
            firstName: 'Demo',
            lastName: 'Teacher',
            organization: 'TeachGage Demo School',
            role: 'instructor',
            accessToken: 'demo-access-token',
          }
        }

        // Production mode - connect to backend API
        try {
          const res = await fetch(`${process.env.BACKEND_URL}/api/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await res.json()

          if (res.ok && data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: `${data.user.firstName} ${data.user.lastName}`,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              organization: data.user.organization,
              role: data.user.role,
              accessToken: data.accessToken,
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.role = user.role
        token.organization = user.organization
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user.role = token.role
      session.user.organization = token.organization
      session.user.firstName = token.firstName
      session.user.lastName = token.lastName
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
})
