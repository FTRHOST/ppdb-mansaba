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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Define Zod schema for validation
const formSchema = z.object({
  rekomendasiPendaftaran: z.string().min(1, { message: 'Rekomendasi pendaftaran harus diisi.' }),
  jalurPendaftaran: z.enum(['Reguler Umum', 'Reguler Prestasi', 'Reguler Sosial'], { required_error: 'Jalur pendaftaran harus dipilih.' }),
  programPeminatan: z.enum(['MIPA', 'IPS', 'BHS', 'AGM', 'Tahfidz'], { required_error: 'Program peminatan harus dipilih.' }),
  nama: z.string().min(1, { message: 'Nama lengkap harus diisi.' }),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { required_error: 'Jenis kelamin harus dipilih.' }),
  tempatLahir: z.string().min(1, { message: 'Tempat lahir harus diisi.' }),
  tanggalLahir: z.date({ required_error: 'Tanggal lahir harus dipilih.' }),
  noHp: z.string().min(10, { message: 'Nomor HP/Whatsapp minimal 10 digit.' }).regex(/^\d+$/, { message: 'Nomor HP/Whatsapp hanya boleh berisi angka.' }),
  tinggal: z.enum(['Bersama Orang tua', 'Bersama Wali', 'Bersama Kakak', 'Tinggal Sendiri', 'Lainnya'], { required_error: 'Pilihan tinggal harus dipilih.' }),
  dukuhJalan: z.string().min(1, { message: 'Dukuh/Jalan harus diisi.' }),
  desa: z.string().min(1, { message: 'Desa harus diisi.' }),
  rtRw: z.string().min(3, { message: 'RT/RW harus diisi (contoh: 01/02).' }).regex(/^\d{1,2}\/\d{1,2}$/, { message: 'Format RT/RW tidak valid (contoh: 01/02).' }),
  kecamatan: z.string().min(1, { message: 'Kecamatan harus diisi.' }),
  kabupaten: z.string().min(1, { message: 'Kabupaten harus diisi.' }),
  provinsi: z.string().min(1, { message: 'Provinsi harus diisi.' }),
  namaAyah: z.string().min(1, { message: 'Nama ayah harus diisi.' }),
  pendidikanAyah: z.enum(['SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'], { required_error: 'Pendidikan ayah harus dipilih.' }),
  pekerjaanAyah: z.string().min(1, { message: 'Pekerjaan ayah harus diisi.' }),
  namaIbu: z.string().min(1, { message: 'Nama ibu harus diisi.' }),
  pendidikanIbu: z.enum(['SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'], { required_error: 'Pendidikan ibu harus dipilih.' }),
  pekerjaanIbu: z.string().min(1, { message: 'Pekerjaan ibu harus diisi.' }),
  alamatOrangtua: z.string().min(1, { message: 'Alamat orang tua harus diisi.' }),
  noHpAyah: z.string().optional().refine(val => !val || /^\d*$/.test(val), { message: 'Nomor HP Ayah hanya boleh berisi angka.' }), // Optional
  noHpIbu: z.string().optional().refine(val => !val || /^\d*$/.test(val), { message: 'Nomor HP Ibu hanya boleh berisi angka.' }), // Optional
  punyaSaudaraDiMansaba: z.enum(['Punya', 'Tidak Punya'], { required_error: 'Informasi saudara kandung harus dipilih.' }),
  namaWali: z.string().optional(),
  hubunganWali: z.string().optional(),
  pendidikanWali: z.enum(['SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3']).optional(),
  pekerjaanWali: z.string().optional(),
  alamatWali: z.string().optional(),
  noHpWali: z.string().optional().refine(val => !val || /^\d*$/.test(val), { message: 'Nomor HP Wali hanya boleh berisi angka.' }),
  namaSekolahAsal: z.string().min(1, { message: 'Nama SMP/MTs asal harus diisi.' }),
  alamatSekolahAsal: z.string().min(1, { message: 'Alamat SMP/MTs asal harus diisi.' }),
  nisn: z.string().optional().refine(val => !val || /^\d*$/.test(val), { message: 'NISN hanya boleh berisi angka.' }), // Optional, numeric only if provided
  punyaPiagam: z.enum(['Punya', 'Tidak Punya']).optional(), // Optional
  motivasi: z.string().min(1, { message: 'Motivasi mendaftar harus diisi.' }),
}).refine(data => {
  // Validation for Wali fields only if 'Tinggal Dengan' is 'Bersama Wali'
  if (data.tinggal === 'Bersama Wali') {
    return !!data.namaWali && !!data.hubunganWali && !!data.pendidikanWali && !!data.pekerjaanWali && !!data.alamatWali;
  }
  return true;
}, {
  // Apply this message only when the condition in refine fails for the Wali case
  message: 'Data Wali (Nama, Hubungan, Pendidikan, Pekerjaan, Alamat) wajib diisi jika tinggal bersama Wali.',
  path: ['namaWali'], // Attach error to one of the wali fields for form display
});


export default function FormPendaftaranPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rekomendasiPendaftaran: '',
      jalurPendaftaran: undefined,
      programPeminatan: undefined,
      nama: '',
      jenisKelamin: undefined,
      tempatLahir: '',
      tanggalLahir: undefined,
      noHp: '',
      tinggal: undefined,
      dukuhJalan: '',
      desa: '',
      rtRw: '',
      kecamatan: '',
      kabupaten: '',
      provinsi: '',
      namaAyah: '',
      pendidikanAyah: undefined,
      pekerjaanAyah: '',
      namaIbu: '',
      pendidikanIbu: undefined,
      pekerjaanIbu: '',
      alamatOrangtua: '',
      noHpAyah: '',
      noHpIbu: '',
      punyaSaudaraDiMansaba: undefined,
      namaWali: '',
      hubunganWali: '',
      pendidikanWali: undefined,
      pekerjaanWali: '',
      alamatWali: '',
      noHpWali: '',
      namaSekolahAsal: '',
      alamatSekolahAsal: '',
      nisn: '',
      punyaPiagam: undefined,
      motivasi: '',
    },
  });

  const [tempatTanggalLahir, setTempatTanggalLahir] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [tinggalDenganWali, setTinggalDenganWali] = useState(false);

  // Watch form fields to update derived values
  const watchedTempatLahir = form.watch('tempatLahir');
  const watchedTanggalLahir = form.watch('tanggalLahir');
  const watchedDukuhJalan = form.watch('dukuhJalan');
  const watchedDesa = form.watch('desa');
  const watchedRtRw = form.watch('rtRw');
  const watchedKecamatan = form.watch('kecamatan');
  const watchedKabupaten = form.watch('kabupaten');
  const watchedProvinsi = form.watch('provinsi');
  const watchedTinggal = form.watch('tinggal');

  // Effect for Tempat, Tanggal Lahir
  useEffect(() => {
    if (watchedTempatLahir && watchedTanggalLahir) {
      try {
        const formattedDate = format(watchedTanggalLahir, 'dd-MMM-yyyy');
        setTempatTanggalLahir(`${watchedTempatLahir}, ${formattedDate}`);
      } catch (error) {
        console.error("Error formatting date:", error);
        setTempatTanggalLahir(watchedTempatLahir); // Fallback
      }
    } else {
      setTempatTanggalLahir(watchedTempatLahir || '');
    }
  }, [watchedTempatLahir, watchedTanggalLahir]);

  // Effect for Alamat Lengkap
  useEffect(() => {
    const parts = [
      watchedDukuhJalan,
      watchedDesa,
      watchedRtRw ? `RT/RW ${watchedRtRw}` : '',
      watchedKecamatan ? `Kec. ${watchedKecamatan}` : '',
      watchedKabupaten ? `Kab. ${watchedKabupaten}` : '',
      watchedProvinsi ? `Prov. ${watchedProvinsi}` : '',
    ];
    setAlamatLengkap(parts.filter(Boolean).join(', '));
  }, [watchedDukuhJalan, watchedDesa, watchedRtRw, watchedKecamatan, watchedKabupaten, watchedProvinsi]);

  // Effect to show/hide Wali section
  useEffect(() => {
    setTinggalDenganWali(watchedTinggal === 'Bersama Wali');
    // Optionally clear Wali fields when not needed
    // if (watchedTinggal !== 'Bersama Wali') {
    //   form.setValue('namaWali', '');
    //   form.setValue('hubunganWali', '');
    //   // ... clear other wali fields
    // }
  }, [watchedTinggal, form.setValue]);


  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Convert tanggalLahir to YYYY-MM-DD for database
    const dataToSubmit = {
      ...values,
      tanggalLahir: values.tanggalLahir ? format(values.tanggalLahir, 'yyyy-MM-dd') : null,
      tempatTanggalLahir: tempatTanggalLahir, // Send derived value
      alamatLengkap: alamatLengkap, // Send derived value
      // Ensure optional fields are handled correctly (e.g., send null or empty string if appropriate)
      noHpAyah: values.noHpAyah || null,
      noHpIbu: values.noHpIbu || null,
      namaWali: values.tinggal === 'Bersama Wali' ? values.namaWali : null,
      hubunganWali: values.tinggal === 'Bersama Wali' ? values.hubunganWali : null,
      pendidikanWali: values.tinggal === 'Bersama Wali' ? values.pendidikanWali : null,
      pekerjaanWali: values.tinggal === 'Bersama Wali' ? values.pekerjaanWali : null,
      alamatWali: values.tinggal === 'Bersama Wali' ? values.alamatWali : null,
      noHpWali: values.tinggal === 'Bersama Wali' ? values.noHpWali || null : null,
      nisn: values.nisn || null,
      punyaPiagam: values.punyaPiagam || null,

    };

    console.log('Form Submitted Data:', dataToSubmit);

    // --- TODO: Replace with actual API call ---
    // Simulating API call success
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
            title: "Pendaftaran Berhasil!",
            description: "Data Anda telah berhasil dikirim.",
            variant: "default", // Use 'default' for success, maybe a custom green variant later
        });
        form.reset(); // Reset form after successful submission
        setTempatTanggalLahir(''); // Clear derived fields
        setAlamatLengkap(''); // Clear derived fields
        // TODO: Generate and display/download Nomor Pendaftaran here
        // const nomorPendaftaran = generateNomorPendaftaran(); // Need implementation
        // alert(`Pendaftaran Berhasil! Nomor Pendaftaran Anda: ${nomorPendaftaran}`);
    } catch (error) {
        console.error("Submission error:", error);
        toast({
            title: "Pendaftaran Gagal!",
            description: "Terjadi kesalahan saat mengirim data. Silakan coba lagi.",
            variant: "destructive",
        });
    }
    // --- End of TODO ---
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg border-primary/20">
        <CardHeader className="bg-secondary/50 p-6 rounded-t-lg border-b border-primary/10">
           <CardTitle className="text-2xl font-bold text-primary text-center">
            Form Pendaftaran Peserta Didik Baru
           </CardTitle>
           <CardDescription className="text-center text-muted-foreground">
            MA NU 01 Banyuputih - Tahun Pelajaran 2025/2026
           </CardDescription>
            <p className="text-center text-lg font-semibold mt-2 text-accent">
             Elevate your future with us!
            </p>
            <p className="text-center text-sm text-muted-foreground mt-1">
              Silahkan isi formulir ini dengan data yang benar dan lengkap.
            </p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* Section: Selamat Datang */}
              <div className="space-y-4 p-4 border rounded-lg border-secondary bg-background shadow-sm">
                 <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Informasi Pendaftaran</h3>
                 <FormField
                   control={form.control}
                   name="rekomendasiPendaftaran"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Rekomendasi Pendaftaran (Siapa yang mendaftarkan?)</FormLabel>
                       <FormControl>
                         <Input placeholder="Contoh: Guru MTs, Saudara, Tetangga" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="jalurPendaftaran"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Jalur Pendaftaran</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                         <FormControl>
                           <SelectTrigger>
                             <SelectValue placeholder="Pilih Jalur Pendaftaran" />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           <SelectItem value="Reguler Umum">Reguler (Umum)</SelectItem>
                           <SelectItem value="Reguler Prestasi">Reguler (Prestasi)</SelectItem>
                           <SelectItem value="Reguler Sosial">Reguler (Sosial)</SelectItem>
                         </SelectContent>
                       </Select>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="programPeminatan"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Pilihan Program Peminatan</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                         <FormControl>
                           <SelectTrigger>
                             <SelectValue placeholder="Pilih Program Peminatan" />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           <SelectItem value="MIPA">MIPA (Matematika dan Ilmu Pengetahuan Alam)</SelectItem>
                           <SelectItem value="IPS">IPS (Ilmu Pengetahuan Sosial)</SelectItem>
                           <SelectItem value="BHS">BHS (Bahasa)</SelectItem>
                           <SelectItem value="AGM">AGM (Agama)</SelectItem>
                           <SelectItem value="Tahfidz">Tahfidz</SelectItem>
                         </SelectContent>
                       </Select>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
              </div>


              {/* Section: DATA PESERTA DIDIK */}
              <div className="space-y-4 p-4 border rounded-lg border-secondary bg-background shadow-sm">
                 <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Data Peserta Didik</h3>
                 <p className="text-sm text-muted-foreground mb-4">Silahkan isi data Peserta Didik sesuai dengan data di ijazah SMP/MTs.</p>
                 <FormField
                   control={form.control}
                   name="nama"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Nama Lengkap</FormLabel>
                       <FormControl>
                         <Input placeholder="Sesuai Ijazah SMP/MTs" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="jenisKelamin"
                   render={({ field }) => (
                     <FormItem className="space-y-3">
                       <FormLabel>Jenis Kelamin</FormLabel>
                       <FormControl>
                         <RadioGroup
                           onValueChange={field.onChange}
                           defaultValue={field.value}
                           className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                         >
                           <FormItem className="flex items-center space-x-3 space-y-0">
                             <FormControl>
                               <RadioGroupItem value="Laki-laki" />
                             </FormControl>
                             <FormLabel className="font-normal">Laki-laki</FormLabel>
                           </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                             <FormControl>
                               <RadioGroupItem value="Perempuan" />
                             </FormControl>
                             <FormLabel className="font-normal">Perempuan</FormLabel>
                           </FormItem>
                         </RadioGroup>
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tempatLahir"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempat Lahir</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Batang" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                       control={form.control}
                       name="tanggalLahir"
                       render={({ field }) => (
                         <FormItem className="flex flex-col">
                            <FormLabel>Tanggal Lahir</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy")
                                    ) : (
                                      <span>Pilih tanggal</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1990-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                       )}
                     />
                 </div>
                 <FormItem>
                    <FormLabel>Tempat, Tanggal Lahir (Otomatis)</FormLabel>
                    <FormControl>
                      <Input value={tempatTanggalLahir} readOnly disabled className="bg-muted/50" />
                    </FormControl>
                 </FormItem>
                  <FormField
                    control={form.control}
                    name="noHp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. HP / Whatsapp Aktif</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Contoh: 081234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              {/* Section: DATA ALAMAT */}
              <div className="space-y-4 p-4 border rounded-lg border-secondary bg-background shadow-sm">
                <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Data Alamat</h3>
                 <FormField
                   control={form.control}
                   name="tinggal"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Tinggal Dengan</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                         <FormControl>
                           <SelectTrigger>
                             <SelectValue placeholder="Pilih Opsi Tinggal" />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           <SelectItem value="Bersama Orang tua">Bersama Orang tua</SelectItem>
                           <SelectItem value="Bersama Wali">Bersama Wali</SelectItem>
                           <SelectItem value="Bersama Kakak">Bersama Kakak</SelectItem>
                           <SelectItem value="Tinggal Sendiri">Tinggal Sendiri</SelectItem>
                           <SelectItem value="Lainnya">Lainnya</SelectItem>
                         </SelectContent>
                       </Select>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="dukuhJalan"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Dukuh / Jalan</FormLabel>
                       <FormControl>
                         <Input placeholder="Contoh: Dukuh Krajan / Jl. Merdeka No. 10" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="desa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desa</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Banyuputih" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="rtRw"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RT / RW</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: 01/02" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="kecamatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kecamatan</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Banyuputih" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="kabupaten"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kabupaten</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Batang" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="provinsi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provinsi</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Jawa Tengah" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
                  <FormItem>
                    <FormLabel>Alamat Lengkap (Otomatis)</FormLabel>
                    <FormControl>
                      <Textarea value={alamatLengkap} readOnly disabled className="bg-muted/50" />
                    </FormControl>
                 </FormItem>
              </div>


              {/* Section: DATA ORANG TUA */}
               <div className="space-y-4 p-4 border rounded-lg border-secondary bg-background shadow-sm">
                 <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Data Orang Tua (Kandung)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="namaAyah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Ayah</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama Ayah Kandung" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pendidikanAyah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pendidikan Ayah</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Pendidikan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SD">SD</SelectItem>
                              <SelectItem value="SMP">SMP</SelectItem>
                              <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                              <SelectItem value="D1">D1</SelectItem>
                              <SelectItem value="D2">D2</SelectItem>
                              <SelectItem value="D3">D3</SelectItem>
                              <SelectItem value="S1">S1</SelectItem>
                              <SelectItem value="S2">S2</SelectItem>
                              <SelectItem value="S3">S3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pekerjaanAyah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pekerjaan Ayah</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Petani, Wiraswasta" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <FormField
                      control={form.control}
                      name="namaIbu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Ibu</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama Ibu Kandung" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pendidikanIbu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pendidikan Ibu</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Pendidikan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SD">SD</SelectItem>
                              <SelectItem value="SMP">SMP</SelectItem>
                              <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                              <SelectItem value="D1">D1</SelectItem>
                              <SelectItem value="D2">D2</SelectItem>
                              <SelectItem value="D3">D3</SelectItem>
                              <SelectItem value="S1">S1</SelectItem>
                              <SelectItem value="S2">S2</SelectItem>
                              <SelectItem value="S3">S3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pekerjaanIbu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pekerjaan Ibu</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Ibu Rumah Tangga, Guru" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
                 <FormField
                   control={form.control}
                   name="alamatOrangtua"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Alamat Orang Tua</FormLabel>
                       <FormControl>
                         <Textarea placeholder="Alamat Lengkap Orang Tua (jika berbeda dengan alamat siswa)" {...field} />
                       </FormControl>
                       <FormDescription>
                         Isi jika alamat orang tua berbeda dengan alamat siswa.
                       </FormDescription>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="noHpAyah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. HP Ayah (Opsional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Contoh: 081xxxxxxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="noHpIbu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. HP Ibu (Opsional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Contoh: 081xxxxxxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                   control={form.control}
                   name="punyaSaudaraDiMansaba"
                   render={({ field }) => (
                     <FormItem className="space-y-3">
                       <FormLabel>Apakah mempunyai saudara kandung yang masih sekolah di MA NU 01 Banyuputih?</FormLabel>
                       <FormControl>
                         <RadioGroup
                           onValueChange={field.onChange}
                           defaultValue={field.value}
                           className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                         >
                           <FormItem className="flex items-center space-x-3 space-y-0">
                             <FormControl>
                               <RadioGroupItem value="Punya" />
                             </FormControl>
                             <FormLabel className="font-normal">Punya (Kelas 10/11/12)</FormLabel>
                           </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                             <FormControl>
                               <RadioGroupItem value="Tidak Punya" />
                             </FormControl>
                             <FormLabel className="font-normal">Tidak Punya</FormLabel>
                           </FormItem>
                         </RadioGroup>
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>

              {/* Section: DATA WALI (Conditional) */}
               {tinggalDenganWali && (
                  <div className="space-y-4 p-4 border rounded-lg border-secondary bg-background shadow-sm">
                    <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Data Wali</h3>
                    <p className="text-sm text-muted-foreground mb-4">Silahkan isi data Wali jika siswa tinggal bersama Wali.</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="namaWali"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Wali</FormLabel>
                              <FormControl>
                                <Input placeholder="Nama Lengkap Wali" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="hubunganWali"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hubungan Siswa dengan Wali</FormLabel>
                              <FormControl>
                                <Input placeholder="Contoh: Paman, Bibi, Kakek" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                     </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="pendidikanWali"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pendidikan Wali</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih Pendidikan" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                   <SelectItem value="SD">SD</SelectItem>
                                   <SelectItem value="SMP">SMP</SelectItem>
                                   <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                                   <SelectItem value="D1">D1</SelectItem>
                                   <SelectItem value="D2">D2</SelectItem>
                                   <SelectItem value="D3">D3</SelectItem>
                                   <SelectItem value="S1">S1</SelectItem>
                                   <SelectItem value="S2">S2</SelectItem>
                                   <SelectItem value="S3">S3</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="pekerjaanWali"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pekerjaan Wali</FormLabel>
                              <FormControl>
                                <Input placeholder="Pekerjaan Wali" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                     </div>
                    <FormField
                       control={form.control}
                       name="alamatWali"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Alamat Wali</FormLabel>
                           <FormControl>
                             <Textarea placeholder="Alamat Lengkap Wali" {...field} />
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                    <FormField
                      control={form.control}
                      name="noHpWali"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. HP Wali (Opsional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Contoh: 081xxxxxxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
               )}

              {/* Section: SEKOLAH ASAL */}
              <div className="space-y-4 p-4 border rounded-lg border-secondary bg-background shadow-sm">
                 <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4">Data Sekolah Asal</h3>
                 <FormField
                   control={form.control}
                   name="namaSekolahAsal"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Nama SMP/MTs</FormLabel>
                       <FormControl>
                         <Input placeholder="Nama Sekolah Asal" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="alamatSekolahAsal"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Alamat SMP/MTs</FormLabel>
                       <FormControl>
                         <Textarea placeholder="Alamat Lengkap Sekolah Asal" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="nisn"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>NISN (Nomor Induk Siswa Nasional) (Opsional)</FormLabel>
                       <FormControl>
                         <Input placeholder="NISN (jika ada)" {...field} />
                       </FormControl>
                       <FormDescription>
                        Tidak wajib diisi.
                       </FormDescription>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="punyaPiagam"
                   render={({ field }) => (
                     <FormItem className="space-y-3">
                       <FormLabel>Piagam / Sertifikat Prestasi (Opsional)</FormLabel>
                       <FormControl>
                         <RadioGroup
                           onValueChange={field.onChange}
                           defaultValue={field.value}
                           className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                         >
                           <FormItem className="flex items-center space-x-3 space-y-0">
                             <FormControl>
                               <RadioGroupItem value="Punya" />
                             </FormControl>
                             <FormLabel className="font-normal">Punya</FormLabel>
                           </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                             <FormControl>
                               <RadioGroupItem value="Tidak Punya" />
                             </FormControl>
                             <FormLabel className="font-normal">Tidak Punya</FormLabel>
                           </FormItem>
                         </RadioGroup>
                       </FormControl>
                        <FormDescription>
                          Jika memilih 'Punya', mohon dibawa saat daftar ulang.
                        </FormDescription>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="motivasi"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Motivasi Mendaftar di MA NU 01 Banyuputih</FormLabel>
                       <FormControl>
                         <Textarea placeholder="Ceritakan motivasi Anda..." {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
              </div>


              <Button type="submit" className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
