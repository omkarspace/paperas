import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { db } from "../db";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    {
      id: "orcid",
      name: "ORCID",
      type: "oauth",
      authorization: {
        url: "https://orcid.org/oauth/authorize",
        params: { scope: "/authenticate" },
      },
      token: "https://orcid.org/oauth/token",
      userinfo: {
        url: "https://pub.orcid.org/v3.0/",
        request: async ({ tokens }: { tokens: any }) => {
          const orcid = tokens.id_token || (tokens as any)?.orcid
          const res = await fetch(`https://pub.orcid.org/v3.0/${orcid}/record`, {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
          })
          const data = await res.json()
          const name = data?.person?.name
          return {
            id: orcid,
            name: name ? `${name["given-names"]?.value || ""} ${name["family-name"]?.value || ""}`.trim() : null,
            email: null,
            image: null,
          }
        },
      },
      clientId: process.env.ORCID_CLIENT_ID,
      clientSecret: process.env.ORCID_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.image,
        }
      },
    },
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});
