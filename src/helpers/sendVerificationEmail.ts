import { resend } from '@/lib/resend';
import VerificationEmail from '../../emailsTemplate/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

interface VerificationEmail {
    email: string;
    username: string;
    verifyCode: string;
}

export async function sendVerificationEmail({
    email,
    username,
    verifyCode,
}: VerificationEmail): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({ username, verifyCode }),
        });
        return {
            success: true,
            message: 'verification email send successfully',
        };
    } catch (error) {
        console.log('Error sending verification email', error);
        return { success: false, message: 'failed to send verification email' };
    }
}
