import sql from '@/src/lib/db';
import User from '@/src/types/User';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // For GitHub to work, we need to populate the table with a new client to represent the user. Pending endpoints to do so.
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    CredentialsProvider({
      // The name to display on the sign-in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'traveler@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        // We are storing our passwords in postgres. See this blog for how it's done.
        // https://x-team.com/blog/storing-secure-passwords-with-postgresql/

        if (credentials === null) {
          console.error('No creds provided');
          return null;
        }

        const users = await sql<User[]>`SELECT * FROM users WHERE email = ${
          credentials!.username
        } AND password = crypt(${credentials!.password}, password) LIMIT 1`;

        if (users.length > 0) {
          return users[0];
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
