import { Awaitable, NextAuthOptions, RequestInternal } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { api } from '@/api';
import { User } from 'next-auth';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        usernameOrEmail: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (
        credentials: Record<'usernameOrEmail' | 'password', string> | undefined,
        req: Pick<RequestInternal, 'body' | 'query' | 'headers' | 'method'>
      ) => {
        if (!credentials) return null;
        const { usernameOrEmail, password } = credentials;

        try {
          const data = await api.auth.signIn({ usernameOrEmail, password });
          return {
            id: data.user.id,
            name: data.user.username,
            email: data.user.email,
            isApproved: data.user.isApproved,
            access_token: data.access_token,
            refresh_token: data.refresh_token
          } satisfies User;
        } catch (err: any) {
          throw new Error(err.response.data.message);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.access_token = token.access_token as string;
        session.user.refresh_token = token.refresh_token;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET as string
};

export default NextAuth(authOptions);
