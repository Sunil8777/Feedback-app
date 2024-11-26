'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import axois, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schema/signInSchema';
import { ApiError } from 'next/dist/server/api-utils';
import { signUpSchema } from '@/schema/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const page = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 400);

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        const chechUsernameUnique = async () => {
            if (debounced) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axois.get(
                        `/api/check-username-unique?username=${debounced}`,
                    );
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axoisError = error as AxiosError<ApiError>;
                    setUsernameMessage(
                        axoisError.response?.data.message ??
                            'Error occured while checking username',
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        chechUsernameUnique();
    }, [debounced]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axois.post<ApiResponse>(
                '/api/sign-up',
                data,
            );
            toast({
                title: 'success',
                description: response.data.message,
            });
            router.replace(`/verify/${username}`);
        } catch (error) {
            const axoisError = error as AxiosError<ApiError>;
            const errorMessage = axoisError.response?.data.message;

            toast({
                title: 'signUp failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">
                        Sign up to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setUsername(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="password"
                                            {...field}
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Signup'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );    
};

export default page;