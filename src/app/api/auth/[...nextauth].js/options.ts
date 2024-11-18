import NextAuth, { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Usermodel from '@/model/User.model';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';

export default {
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials): Promise<any> => {
                await dbConnect();

                try {
                    if (typeof credentials?.password !== 'string') {
                        throw new Error('Password must be a string');
                    }

                    const user = await Usermodel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials?.email },
                        ],
                    });

                    if (!user) {
                        throw new Error('no user found with this email');
                    }

                    if (!user.isVerified) {
                        throw new Error(
                            'please verify your account first brfore login',
                        );
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password.toString(),
                        user.password,
                    );

                    if (!isPasswordCorrect) {
                        throw new Error('password is incoorect');
                    }

                    return user;
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString();
                session.user.isVerified = !!token.isVerified;
                session.user.isAcceptingMessage = !!token.isAcceptingMessage;
                session.user.username = token.username?.toString();
            }
            return session;
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.SECRET_KEY,
} satisfies NextAuthConfig;
