'use client';

import type React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState } from 'react'; // Import useState for loading state

// Validation Schema
const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username tidak boleh kosong.' }),
  password: z.string().min(1, { message: 'Password tidak boleh kosong.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    console.log('Login attempt:', values);
    // --- TODO: Replace with actual API call for authentication ---
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock success check (replace with actual API response check)
        if (values.username === 'admin' && values.password === 'password') {
            toast({
                title: "Login Berhasil!",
                description: "Anda akan diarahkan ke dashboard admin.",
                variant: "default",
            });
            // Redirect to admin dashboard on successful login
            router.push('/admin');
        } else {
             toast({
                title: "Login Gagal!",
                description: "Username atau password salah.",
                variant: "destructive",
            });
            setIsLoading(false); // Re-enable button on failure
        }

    } catch (error) {
        console.error("Login error:", error);
        toast({
            title: "Login Gagal!",
            description: "Terjadi kesalahan saat mencoba login.",
            variant: "destructive",
        });
        setIsLoading(false); // Re-enable button on error
    }
    // --- End of TODO ---
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
             <LogIn /> Login Admin PPDB
          </CardTitle>
          <CardDescription>Masukkan username dan password Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} autoComplete="username" />
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
                      <Input type="password" placeholder="Password" {...field} autoComplete="current-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'Memproses...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
