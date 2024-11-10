import * as React from 'react';
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Button,
    Text,
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    verifyCode: string;
}

export default function VerificationEmail({
    username,
    verifyCode,
}: VerificationEmailProps) {
    return (
        <Html lang="en">
            <Head />
            <Preview>Verification Code</Preview>
            <Body style={mainStyle}>
                <Container style={containerStyle}>
                    <Text style={headingStyle}>Your OTP Code</Text>
                    <Text>Hello {username},</Text>
                    <Text>Your one-time password (OTP) is:</Text>
                    <Text style={otpStyle}>{verifyCode}</Text>
                    <Text>
                        Please use this code to complete your verification. It
                        is valid for the next 10 minutes.
                    </Text>
                    <Button href="#" style={buttonStyle}>
                        Verify Now
                    </Button>
                    <Text style={footerStyle}>
                        If you did not request this code, please ignore this
                        email.
                        <br />
                        &copy; 2024 Your Company. All rights reserved.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const mainStyle = {
    backgroundColor: '#f3f4f6',
    fontFamily: 'Arial, sans-serif',
};

const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const headingStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2563eb',
    textAlign: 'center' as 'left' | 'center' | 'right' | 'justify',
    marginBottom: '16px',
};

const otpStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center' as 'left' | 'center' | 'right' | 'justify',
    margin: '20px 0',
};

const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '12px 0',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '6px',
    textAlign: 'center' as 'left' | 'center' | 'right' | 'justify',
    fontWeight: 'bold',
    margin: '20px 0',
};

const footerStyle = {
    fontSize: '12px',
    color: '#9ca3af',
    textAlign: 'center' as 'left' | 'center' | 'right' | 'justify',
    marginTop: '20px',
};
