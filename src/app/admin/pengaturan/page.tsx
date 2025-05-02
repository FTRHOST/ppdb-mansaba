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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

// Validation Schema
const pengaturanSchema = z.object({
  tahunPelajaran: z.string()
    .min(4, { message: 'Tahun Pelajaran minimal 4 karakter (contoh: 2526).' })
    .regex(/^\d{4}$/, { message: 'Format Tahun Pelajaran tidak valid (contoh: 2526).' }),
  gelombang: z.enum(['Gelombang 1', 'Gelombang 2'], { required_error: 'Gelombang pendaftaran harus dipilih.' }),
  // Add other settings fields here if needed
  // Example: tanggalBukaPendaftaran: z.date().optional(),
  // Example: tanggalTutupPendaftaran: z.date().optional(),
});

export default function PengaturanPage() {
    // TODO: Add authorization check - only admin should access this page

  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof pengaturanSchema>>({
    resolver: zodResolver(pengaturanSchema),
    defaultValues: {
      tahunPelajaran: '', // Load initial value from DB
      gelombang: undefined, // Load initial value from DB
    },
  });

  // Fetch current settings on component mount
  useEffect(() => {
    // TODO: Replace with actual API call to fetch current settings
    const fetchSettings = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
            // Mock fetched data
            const currentSettings = {
                tahunPelajaran: '2526',
                gelombang: 'Gelombang 1' as 'Gelombang 1' | 'Gelombang 2',
            };
            form.reset(currentSettings); // Populate form with fetched data
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast({
                title: "Gagal Memuat Pengaturan",
                description: "Tidak dapat mengambil data pengaturan saat ini.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    fetchSettings();
  }, [form]); // form is added to dependency array as per React Hook lint rules


  async function onSubmit(values: z.infer<typeof pengaturanSchema>) {
    console.log('Pengaturan Submitted:', values);
    // --- TODO: Replace with actual API call to update settings ---
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: "Sukses!",
            description: "Pengaturan PPDB berhasil diperbarui.",
            variant: "default",
        });
        // Optionally re-fetch settings or assume success
        form.reset(values); // Keep the saved values in the form

    } catch (error) {
        console.error("Error updating settings:", error);
        toast({
            title: "Gagal!",
            description: "Terjadi kesalahan saat menyimpan pengaturan.",
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
             <Settings /> Pengaturan PPDB
          </CardTitle>
          <CardDescription>Atur parameter penting untuk periode pendaftaran saat ini.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center items-center h-40">
               <p className="text-muted-foreground">Memuat pengaturan...</p>
             </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="tahunPelajaran"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahun Pelajaran Aktif</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 2526" {...field} />
                      </FormControl>
                      <FormDescription>
                        Masukkan 4 digit tahun pelajaran (misal: 2526 untuk 2025/2026). Ini akan digunakan untuk format nomor pendaftaran.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gelombang"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gelombang Pendaftaran Aktif</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Gelombang" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Gelombang 1">Gelombang 1</SelectItem>
                          <SelectItem value="Gelombang 2">Gelombang 2</SelectItem>
                          {/* Add more waves if needed */}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Gelombang yang aktif saat ini. Ini akan mempengaruhi awalan nomor pendaftaran (A untuk Gel. 1, B untuk Gel. 2, dst.).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 {/* Add more settings fields here */}
                 {/* Example: Date Pickers */}
                 {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField ... name="tanggalBukaPendaftaran" ... />
                    <FormField ... name="tanggalTutupPendaftaran" ... />
                 </div> */}


                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting || loading}>
                  {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
