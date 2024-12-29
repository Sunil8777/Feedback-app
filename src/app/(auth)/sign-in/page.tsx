'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
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
import { signInSchema } from '@/schema/signInSchema';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const page = () => {

    const [isLoading,setIsLoading] = useState(false);

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
      resolver: zodResolver(signInSchema),
      defaultValues: {
          email: '',
          password: '',
      },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        try {
            setIsLoading(true)
            const result = await signIn('credentials',{
              redirect:false,
              email: data.email,
              password: data.password
            })
    
            if(result?.error){
              toast({
                title:"Login failed",
                description: "Incorrect username or password",
                variant:"destructive"
              })
            }
    
            if(result?.url){
              router.replace('/dashboard')
            }
        } catch (error) {
            toast({
                title:"Login failed",
                description: "Something wrong happen",
                variant:"destructive"
              })
        }finally{
            setIsLoading(false)
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
                        Sign in to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email/username" {...field} />
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
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                            ) : (
                            <Button type="submit" disabled={isLoading}>
                                Sign in
                            </Button>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );    
};

export default page;