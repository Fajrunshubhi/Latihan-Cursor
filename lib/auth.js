import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { ensureAuthEnv } from "./env";
import { findUserByUsernameOrEmail, upsertGoogleUser } from "./users";

ensureAuthEnv();

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    allowDangerousEmailAccountLinking: true,
  }),
  CredentialsProvider({
    name: "Akun Event",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const username = credentials?.username?.trim().toLowerCase();
      const password = credentials?.password;
      if (!username || !password) return null;

      const user = await findUserByUsernameOrEmail(username);
      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        name: user.name || user.username,
        email: user.email,
        username: user.username,
        role: user.role || "USER",
      };
    },
  }),
];

export const authOptions = {
  providers,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const dbUser = await upsertGoogleUser({
          email: user.email,
          name: user.name,
          googleId: account.providerAccountId,
        });
        if (!dbUser) return false;
        user.id = dbUser.id;
        user.username = dbUser.username;
        user.role = dbUser.role;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.username = user.username || user.name;
        token.role = user.role || "USER";
        token.loginMethod = account?.provider || "credentials";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role || "USER";
        session.user.loginMethod = token.loginMethod;
      }
      return session;
    },
  },
};
