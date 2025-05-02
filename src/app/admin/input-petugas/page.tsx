'use client';

import type React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

// Validation Schema
const petugasSchema = z.object({
  nama: z.string().min(3, { message: 'Nama petugas minimal 3 karakter.' }),
  username: z.string().min(4, { message: 'Username minimal 4 karakter.' }).regex(/^[a-zA-Z0-9_]+$/, { message: 'Username hanya boleh berisi huruf, angka, dan underscore.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Password dan Konfirmasi Password tidak cocok.",
  path: ["confirmPassword"], // Attach error to confirmPassword field
});


export default function InputPetugasPage() {

    // TODO: Add authorization check - only admin should access this page

  const form = useForm<z.infer<typeof petugasSchema>>({
    resolver: zodResolver(petugasSchema),
    defaultValues: {
      nama: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });


  async function onSubmit(values: z.infer<typeof petugasSchema>) {
    // Exclude confirmPassword before sending to backend
    const { confirmPassword, ...dataToSubmit } = values;

    console.log('Data Petugas Submitted:', dataToSubmit);
    // --- TODO: Replace with actual API call to create petugas ---
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: "Sukses!",
            description: `Petugas dengan nama ${dataToSubmit.nama} berhasil ditambahkan.`,
            variant: "default",
        });
        form.reset(); // Reset form after successful submission

    } catch (error: any) {
        console.error("Error creating petugas:", error);
        // Handle specific errors from API if possible (e.g., username already exists)
        let errorMessage = "Terjadi kesalahan saat menambahkan petugas.";
        if (error.message === 'Username already exists') { // Example check
            errorMessage = "Username sudah digunakan. Silakan pilih username lain.";
            form.setError("username", { type: "manual", message: errorMessage });
        }

        toast({
            title: "Gagal!",
            description: errorMessage,
            variant: "destructive",
        });
    }
    // --- End of TODO ---
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <UserPlus /> Input Petugas Pendaftaran Baru
          </CardTitle>
          <CardDescription>Tambahkan akun petugas baru untuk mengelola pendaftaran.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap Petugas</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan username (untuk login)" {...field} />
                    </FormControl>
                     <FormDescription>
                       Hanya boleh berisi huruf, angka, dan underscore (_).
                     </FormDescription>
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
                      <Input type="password" placeholder="Masukkan password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Ulangi password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Petugas Baru'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
       {/* TODO: Add a table or list to display existing petugas with edit/delete options */}
       {/* <Card className="mt-8">
           <CardHeader><CardTitle>Daftar Petugas</CardTitle></CardHeader>
           <CardContent><p className="text-muted-foreground">Tabel petugas akan ditampilkan di sini.</p></CardContent>
       </Card> */}
    </div>
  );
}
