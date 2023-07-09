import axios from "axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        const { email, password } = credentials;

        // Authentication
        await axios
          .post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            email: email,
            password: password,
          })
          .then((res) => {
            return res.data.result;
          })
          .catch((err) => {
            console.error(err);
            return null;
          });
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
