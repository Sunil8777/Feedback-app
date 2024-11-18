import dbConnect from '@/lib/dbConnect';
import Usermodel from '@/model/User.model';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingUserByUsername = await Usermodel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                {
                    status: 400,
                },
            );
        }

        const existingUserByEmail = await Usermodel.findOne({ email });

        const verifyCode = Math.floor(
            Math.random() * 90000 + 100000,
        ).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'User already exist with this email',
                    },
                    { status: 400 },
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;

                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new Usermodel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail({
            email,
            username,
            verifyCode,
        });

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 },
            );
        }

        return Response.json(
            {
                success: true,
                message:
                    'User registered successfully. Please verify your email',
            },
            { status: 200 },
        );
    } catch (error) {
        console.log('Error in registering user', error);
        return Response.json(
            {
                success: false,
                message: 'Error in registering user',
            },
            {
                status: 500,
            },
        );
    }
}
