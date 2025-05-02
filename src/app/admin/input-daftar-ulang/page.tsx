
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
import { Combobox } from '@/components/ui/combobox'; // Import Combobox
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for searchable dropdown - replace with actual data fetching & search logic
const mockPendaftar = [
  { id: 'A-2526/0001', nama: 'Ahmad Fauzi', sekolah: 'MTs N 1 Batang' },
  { id: 'A-2526/0002', nama: 'Budi Santoso', sekolah: 'SMP N 2 Banyuputih' },
  { id: 'A-2526/0003', nama: 'Citra Lestari', sekolah: 'MTs Al Hidayah' },
  { id: 'A-2526/0004', nama: 'Dewi Anggraini', sekolah: 'SMP Islam Terpadu' },
];

const daftarUlangSchema = z.object({
  pendaftarId: z.string({ required_error: 'Siswa pendaftar harus dipilih.' }).min(1, 'Siswa pendaftar harus dipilih.'),
  nomorDaftarUlang: z.string(), // Readonly, generated automatically
  kelengkapanKK: z.boolean().default(false),
  kelengkapanSKL: z.boolean().default(false),
  kelengkapanPiagam: z.boolean().optional(), // Optional based on form pendaftaran
  kelengkapanSKTM: z.boolean().optional(), // Optional
  bayarDaftarUlang: z.boolean().default(false),
  biayaDaftarUlang: z.number().optional(),
  ukuranSeragam: z.enum(['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Custom'], { required_error: 'Ukuran seragam harus dipilih.' }),
  seragamOsis: z.boolean().default(false),
  seragamPramuka: z.boolean().default(false),
  seragamBatik: z.boolean().default(false),
  seragamOlahraga: z.boolean().default(false),
  tanggalDaftarUlang: z.date(), // Readonly, set to today
}).refine(data => {
  if (data.bayarDaftarUlang && (data.biayaDaftarUlang === undefined || data.biayaDaftarUlang <= 0)) {
    return false;
  }
  return true;
}, {
  message: 'Biaya daftar ulang harus diisi jika pembayaran dicentang.',
  path: ['biayaDaftarUlang'],
});

export default function InputDaftarUlangPage() {
  // const [searchTerm, setSearchTerm] = useState(''); // No longer needed for Combobox internal search
  // const [filteredPendaftar, setFilteredPendaftar] = useState(mockPendaftar); // Combobox filters internally
  const [pendaftarOptions, setPendaftarOptions] = useState<{ value: string; label: string }[]>([]);
  const [nextNomorDU, setNextNomorDU] = useState('DU-1'); // TODO: Fetch next number from DB

  useEffect(() => {
    // TODO: Fetch actual pendaftar data
    // For now, map mock data to Combobox options format
    const options = mockPendaftar.map(p => ({
      value: p.id,
      label: `${p.id} - ${p.nama} (${p.sekolah})`,
    }));
    setPendaftarOptions(options);
  }, []);


  useEffect(() => {
    // TODO: Fetch actual next DU number
    // For now, simulate fetching
    const fetchNextNumber = async () => {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
        const lastNumber = 3; // Assume last number is 3 from DB
        setNextNomorDU(`DU-${lastNumber + 1}`);
    };
    fetchNextNumber();
  }, []);


  const form = useForm<z.infer<typeof daftarUlangSchema>>({
    resolver: zodResolver(daftarUlangSchema),
    defaultValues: {
      pendaftarId: '', // Initialize as empty string for Combobox
      nomorDaftarUlang: nextNomorDU,
      kelengkapanKK: false,
      kelengkapanSKL: false,
      kelengkapanPiagam: false,
      kelengkapanSKTM: false,
      bayarDaftarUlang: false,
      biayaDaftarUlang: undefined,
      ukuranSeragam: undefined,
      seragamOsis: false,
      seragamPramuka: false,
      seragamBatik: false,
      seragamOlahraga: false,
      tanggalDaftarUlang: new Date(),
    },
  });

   // Update nomorDaftarUlang in form when nextNomorDU changes
   useEffect(() => {
       form.setValue('nomorDaftarUlang', nextNomorDU);
   }, [nextNomorDU, form]);


  // Filter logic for pendaftar dropdown (No longer needed as Combobox handles filtering)
  // useEffect(() => {
  //   const lowerCaseSearch = searchTerm.toLowerCase();
  //   setFilteredPendaftar(
  //     mockPendaftar.filter(p =>
  //       p.nama.toLowerCase().includes(lowerCaseSearch) ||
  //       p.id.toLowerCase().includes(lowerCaseSearch) ||
  //       p.sekolah.toLowerCase().includes(lowerCaseSearch)
  //     )
  //   );
  // }, [searchTerm]);

  // Watch bayarDaftarUlang to toggle biaya field visibility/requirement
  const watchBayarDaftarUlang = form.watch('bayarDaftarUlang');

  async function onSubmit(values: z.infer<typeof daftarUlangSchema>) {
     const dataToSubmit = {
      ...values,
      biayaDaftarUlang: values.bayarDaftarUlang ? values.biayaDaftarUlang : null, // Set null if not paid
      tanggalDaftarUlang: format(values.tanggalDaftarUlang, 'yyyy-MM-dd'), // Format date for DB
    };
    console.log('Form Daftar Ulang Submitted:', dataToSubmit);
    // --- TODO: Replace with actual API call ---
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: "Sukses!",
            description: `Data daftar ulang untuk ${values.pendaftarId} berhasil disimpan.`,
            variant: "default",
        });

        // Fetch the *next* DU number after successful submission
        const currentNum = parseInt(nextNomorDU.split('-')[1]);
        const newNextNum = `DU-${currentNum + 1}`;
        setNextNomorDU(newNextNum); // Update state for the next form load
        form.reset({ // Reset form with the new DU number and today's date
            ...form.getValues(), // Keep other potential defaults if needed
            pendaftarId: '', // Clear selection
            nomorDaftarUlang: newNextNum,
            kelengkapanKK: false,
            kelengkapanSKL: false,
            kelengkapanPiagam: false,
            kelengkapanSKTM: false,
            bayarDaftarUlang: false,
            biayaDaftarUlang: undefined,
            ukuranSeragam: undefined,
            seragamOsis: false,
            seragamPramuka: false,
            seragamBatik: false,
            seragamOlahraga: false,
            tanggalDaftarUlang: new Date(),
        });
        // setSearchTerm(''); // Clear search term - No longer needed
    } catch (error) {
        toast({
            title: "Gagal!",
            description: "Terjadi kesalahan saat menyimpan data daftar ulang.",
            variant: "destructive",
        });
    }
    // --- End of TODO ---
  }


  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Input Daftar Ulang Peserta Didik</CardTitle>
          <CardDescription>Masukkan data kelengkapan dan pembayaran daftar ulang.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Pendaftar Searchable Combobox */}
              <FormField
                control={form.control}
                name="pendaftarId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pilih Pendaftar</FormLabel>
                     <FormControl>
                        <Combobox
                            options={pendaftarOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Cari No. Pend / Nama / Sekolah..."
                            searchPlaceholder="Ketik untuk mencari..."
                            emptyPlaceholder="Pendaftar tidak ditemukan."
                            />
                     </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="nomorDaftarUlang"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nomor Daftar Ulang (Otomatis)</FormLabel>
                        <FormControl>
                            <Input {...field} readOnly disabled className="bg-muted/50" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="tanggalDaftarUlang"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tanggal Daftar Ulang (Otomatis)</FormLabel>
                        <FormControl>
                             <Input value={format(field.value, 'dd MMMM yyyy')} readOnly disabled className="bg-muted/50" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
              </div>


              {/* Kelengkapan Berkas */}
              <FormItem>
                <FormLabel>Kelengkapan Berkas</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-md border p-4">
                  <FormField
                    control={form.control}
                    name="kelengkapanKK"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">KK Asli</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kelengkapanSKL"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">SKL Asli</FormLabel>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="kelengkapanPiagam"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">Piagam (Jika Ada)</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="kelengkapanSKTM"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                         <div className="space-y-1 leading-none">
                           <FormLabel className="font-normal">SKTM / Rekom PRNU (Jika Ada)</FormLabel>
                         </div>
                      </FormItem>
                    )}
                  />
                </div>
              </FormItem>

               {/* Pembayaran */}
               <div className="space-y-4 rounded-md border p-4">
                  <FormField
                    control={form.control}
                    name="bayarDaftarUlang"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} id="bayarDaftarUlang" />
                        </FormControl>
                        <FormLabel htmlFor="bayarDaftarUlang" className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                         Bayar Daftar Ulang
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  {watchBayarDaftarUlang && (
                     <FormField
                       control={form.control}
                       name="biayaDaftarUlang"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Jumlah Biaya Daftar Ulang</FormLabel>
                           <FormControl>
                              <Input
                                type="number"
                                placeholder="Masukkan jumlah pembayaran"
                                {...field}
                                value={field.value ?? ''} // Handle undefined for input value
                                onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} // Convert to number or undefined
                              />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                  )}
               </div>


              {/* Seragam */}
               <div className="space-y-6 rounded-md border p-4">
                 <FormField
                   control={form.control}
                   name="ukuranSeragam"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Ukuran Seragam</FormLabel>
                         <FormControl>
                             {/* Using RadioGroup for single selection */}
                             <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                              >
                                {['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Custom'].map(size => (
                                   <FormItem key={size} className="flex items-center space-x-3 space-y-0">
                                     <FormControl>
                                       <RadioGroupItem value={size} />
                                     </FormControl>
                                     <FormLabel className="font-normal">
                                         {size === 'Custom' ? 'Custom (Ukuran Sendiri)' : size}
                                     </FormLabel>
                                   </FormItem>
                                ))}
                              </RadioGroup>
                         </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormItem>
                   <FormLabel>Seragam yang Diterima</FormLabel>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-md border p-4">
                      <FormField
                       control={form.control}
                       name="seragamOsis"
                       render={({ field }) => (
                         <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                           <FormControl>
                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                           <FormLabel className="font-normal">Osis</FormLabel>
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={form.control}
                       name="seragamPramuka"
                       render={({ field }) => (
                         <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                           <FormControl>
                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                           <FormLabel className="font-normal">Pramuka</FormLabel>
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={form.control}
                       name="seragamBatik"
                       render={({ field }) => (
                         <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                           <FormControl>
                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                           <FormLabel className="font-normal">Batik</FormLabel>
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={form.control}
                       name="seragamOlahraga"
                       render={({ field }) => (
                         <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                           <FormControl>
                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                           <FormLabel className="font-normal">Olahraga</FormLabel>
                         </FormItem>
                       )}
                     />
                   </div>
                 </FormItem>
               </div>


              <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Data Daftar Ulang'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
