'use client';

import type React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldPath } from 'react-hook-form';
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
import { Progress } from "@/components/ui/progress"; // Import Progress
import { CalendarIcon, User, Home, Users, Building, PenSquare, GraduationCap, Info, MapPin, UserCheck, BookOpen, Lightbulb, FileText, HeartHandshake, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'; // Added Loader2
import { format, parse } from 'date-fns';
import { id } from 'date-fns/locale'; // Import Indonesian locale
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Define Zod schema for validation (remains the same)
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
  rt: z.string().min(1, { message: 'RT harus diisi.' }).regex(/^\d+$/, { message: 'RT hanya boleh berisi angka.' }),
  rw: z.string().min(1, { message: 'RW harus diisi.' }).regex(/^\d+$/, { message: 'RW hanya boleh berisi angka.' }),
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

type FormSchemaType = z.infer<typeof formSchema>;

// Define steps configuration
const steps = [
  { id: 'informasi', title: 'Informasi Pendaftaran', icon: Info, fields: ['rekomendasiPendaftaran', 'jalurPendaftaran', 'programPeminatan'] },
  { id: 'dataDiri', title: 'Data Peserta Didik', icon: User, fields: ['nama', 'jenisKelamin', 'tempatLahir', 'tanggalLahir', 'noHp'] },
  { id: 'alamat', title: 'Data Alamat Tempat Tinggal', icon: MapPin, fields: ['tinggal', 'dukuhJalan', 'desa', 'rt', 'rw', 'kecamatan', 'kabupaten', 'provinsi'] },
  { id: 'orangTua', title: 'Data Orang Tua (Kandung)', icon: Users, fields: ['namaAyah', 'pendidikanAyah', 'pekerjaanAyah', 'noHpAyah', 'namaIbu', 'pendidikanIbu', 'pekerjaanIbu', 'noHpIbu', 'alamatOrangtua', 'punyaSaudaraDiMansaba'] },
  {
    id: 'wali', title: 'Data Wali', icon: UserCheck,
    fields: ['namaWali', 'hubunganWali', 'pendidikanWali', 'pekerjaanWali', 'alamatWali', 'noHpWali'],
    isConditional: true, conditionField: 'tinggal', conditionValue: 'Bersama Wali'
  },
  { id: 'sekolahAsal', title: 'Data Sekolah Asal & Lainnya', icon: Building, fields: ['namaSekolahAsal', 'alamatSekolahAsal', 'nisn', 'punyaPiagam', 'motivasi'] },
];


export default function FormPendaftaranPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering
  const [mounted, setMounted] = useState(false); // State to track component mount

  const form = useForm<FormSchemaType>({
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
      rt: '',
      rw: '',
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

  // Initialize derived states with empty strings or appropriate defaults
  const [tempatTanggalLahir, setTempatTanggalLahir] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState('');

  // Watch form fields to update derived values
  const watchedTempatLahir = form.watch('tempatLahir');
  const watchedTanggalLahir = form.watch('tanggalLahir');
  const watchedDukuhJalan = form.watch('dukuhJalan');
  const watchedDesa = form.watch('desa');
  const watchedRt = form.watch('rt');
  const watchedRw = form.watch('rw');
  const watchedKecamatan = form.watch('kecamatan');
  const watchedKabupaten = form.watch('kabupaten');
  const watchedProvinsi = form.watch('provinsi');
  const watchedTinggal = form.watch('tinggal');

  // Effect to signal client-side rendering and mount completion
  useEffect(() => {
    setIsClient(true);
    setMounted(true); // Signal that the component has mounted
  }, []);

  // Effect for Tempat, Tanggal Lahir - runs only on client after mount
  useEffect(() => {
     if (!mounted) return; // Don't run before mount
    if (watchedTempatLahir && watchedTanggalLahir) {
      try {
        const formattedDate = format(watchedTanggalLahir, 'dd MMMM yyyy', { locale: id });
        setTempatTanggalLahir(`${watchedTempatLahir}, ${formattedDate}`);
      } catch (error) {
        console.error("Error formatting date:", error);
        setTempatTanggalLahir(watchedTempatLahir); // Fallback
      }
    } else {
      setTempatTanggalLahir(watchedTempatLahir || '');
    }
  }, [watchedTempatLahir, watchedTanggalLahir, mounted]);

  // Effect for Alamat Lengkap - runs only on client after mount
  useEffect(() => {
    if (!mounted) return; // Don't run before mount
    const rtRwString = (watchedRt && watchedRw) ? `RT ${watchedRt.padStart(3, '0')} / RW ${watchedRw.padStart(3, '0')}` : '';
    const parts = [
      watchedDukuhJalan,
      watchedDesa,
      rtRwString,
      watchedKecamatan ? `Kec. ${watchedKecamatan}` : '',
      watchedKabupaten ? `Kab. ${watchedKabupaten}` : '',
      watchedProvinsi ? `Prov. ${watchedProvinsi}` : '',
    ];
    setAlamatLengkap(parts.filter(Boolean).join(', '));
  }, [watchedDukuhJalan, watchedDesa, watchedRt, watchedRw, watchedKecamatan, watchedKabupaten, watchedProvinsi, mounted]);

  // Handle form submission
  async function onSubmit(values: FormSchemaType) {
    // Convert tanggalLahir to YYYY-MM-DD for database
    const dataToSubmit = {
      ...values,
      tanggalLahir: values.tanggalLahir ? format(values.tanggalLahir, 'yyyy-MM-dd') : null,
      tempatTanggalLahir: tempatTanggalLahir, // Send derived value
      alamatLengkap: alamatLengkap, // Send derived value
      // Ensure optional fields are handled correctly
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
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Data Anda telah berhasil dikirim. Silakan lanjutkan ke proses Daftar Ulang.",
        variant: "default",
      });
      form.reset(); // Reset form after successful submission
      setTempatTanggalLahir(''); // Clear derived fields
      setAlamatLengkap(''); // Clear derived fields
      setCurrentStep(0); // Reset to first step
      // TODO: Generate and display/download Nomor Pendaftaran here
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

    // Function to determine if a conditional step should be shown - runs only on client after mount
    const shouldShowStep = (stepIndex: number): boolean => {
        if (!mounted) return false; // Don't show conditional steps before mount
        const step = steps[stepIndex];
        if (!step?.isConditional) {
            return true; // Always show non-conditional steps
        }
        const conditionFieldValue = form.watch(step.conditionField as FieldPath<FormSchemaType>);
        return conditionFieldValue === step.conditionValue;
    };

  const handleNext = async () => {
     if (!mounted) return; // Prevent action before mount
    const currentStepConfig = steps[currentStep];
    const fieldsToValidate = currentStepConfig.fields as FieldPath<FormSchemaType>[];

    // Trigger validation for the current step's fields
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
        let nextStepIndex = currentStep + 1;
        // Skip conditional step if condition is not met
        while (steps[nextStepIndex]?.isConditional && !shouldShowStep(nextStepIndex)) {
            nextStepIndex++;
        }

        if (nextStepIndex < steps.length) {
             setCurrentStep(nextStepIndex);
             window.scrollTo(0, 0); // Scroll to top on step change
        } else {
             // Handle final submission if it's the last step
             form.handleSubmit(onSubmit)();
        }
    } else {
        toast({
            title: "Form Tidak Valid",
            description: "Mohon periksa kembali isian pada bagian ini.",
            variant: "destructive",
        });
    }
  };

  const handlePrevious = () => {
    if (!mounted) return; // Prevent action before mount
    let prevStepIndex = currentStep - 1;
    // Skip conditional step if condition was not met
     while (steps[prevStepIndex]?.isConditional && !shouldShowStep(prevStepIndex)) {
        prevStepIndex--;
     }
    if (prevStepIndex >= 0) {
        setCurrentStep(prevStepIndex);
        window.scrollTo(0, 0); // Scroll to top on step change
    }
  };


   // Calculate progress - runs only on client after mount
   const activeSteps = mounted ? steps.filter((_, index) => shouldShowStep(index)) : steps.filter(s => !s.isConditional); // Show non-conditional initially
   const currentActiveStepIndex = mounted ? activeSteps.findIndex(step => step.id === steps[currentStep].id) : 0;
   const progress = mounted ? ((currentActiveStepIndex + 1) / activeSteps.length) * 100 : 0;


    // Render loading state until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                 <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                 <span>Memuat formulir...</span>
            </div>
        );
    }

  const CurrentStepIcon = steps[currentStep].icon;

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto shadow-xl border-primary/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/80 via-primary to-primary/90 p-6 border-b border-primary/30 text-primary-foreground">
          <div className="flex items-center justify-center gap-3 mb-2">
            <GraduationCap className="w-10 h-10" />
            <CardTitle className="text-2xl md:text-3xl font-bold text-center tracking-tight">
              Formulir Pendaftaran Peserta Didik Baru
            </CardTitle>
          </div>
          <CardDescription className="text-center text-primary-foreground/90 text-base md:text-lg">
            MA NU 01 Banyuputih - Tahun Pelajaran 2025/2026
          </CardDescription>
          <p className="text-center text-sm text-primary-foreground/80 mt-1">
            Silakan isi formulir ini dengan data yang benar dan lengkap.
          </p>
          {/* Progress Bar */}
           <div className="mt-6 px-4">
             <Progress value={progress} className="w-full h-2 bg-primary/30" />
             <p className="text-center text-xs mt-1 text-primary-foreground/80">
                 Langkah {currentActiveStepIndex + 1} dari {activeSteps.length}: {steps[currentStep].title}
             </p>
           </div>
        </CardHeader>

        <CardContent className="p-0 md:p-0"> {/* Remove default padding */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0"> {/* Remove global spacing */}

              {/* Conditional Rendering of Steps */}
              <Card className="rounded-none border-none shadow-none">
                <CardHeader className="bg-secondary/30 p-4 border-b sticky top-0 z-10 backdrop-blur-sm">
                  <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                    <CurrentStepIcon className="w-6 h-6" /> {steps[currentStep].title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Render fields based on currentStep */}

                  {/* Step 1: Informasi Pendaftaran */}
                  {currentStep === 0 && (
                     <>
                      <FormField
                        control={form.control}
                        name="rekomendasiPendaftaran"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rekomendasi Pendaftaran (Siapa yang mendaftarkan?)</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Nama Guru, Nama Teman, Orang Tua, dll" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="jalurPendaftaran"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jalur Pendaftaran</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
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
                              <Select onValueChange={field.onChange} value={field.value}>
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
                     </>
                  )}

                  {/* Step 2: Data Peserta Didik */}
                  {currentStep === 1 && (
                    <>
                      <p className="text-sm text-muted-foreground -mt-4 mb-6">Silakan isi data Peserta Didik sesuai dengan data di ijazah SMP/MTs.</p>
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
                                value={field.value}
                                className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6"
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        format(field.value, "dd MMMM yyyy", { locale: id })
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
                                    locale={id}
                                    disabled={(date) => date > new Date() || date < new Date("1990-01-01")}
                                    captionLayout="dropdown-buttons" // Use dropdowns for month/year
                                    fromYear={1990} // Start year for dropdown
                                    toYear={new Date().getFullYear()} // End year for dropdown
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
                    </>
                  )}

                  {/* Step 3: Data Alamat */}
                  {currentStep === 2 && (
                     <>
                      <FormField
                        control={form.control}
                        name="tinggal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tinggal Dengan</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          name="rt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>RT</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="Contoh: 1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="rw"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>RW</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="Contoh: 2" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          <Textarea value={alamatLengkap} readOnly disabled className="bg-muted/50" rows={2} />
                        </FormControl>
                      </FormItem>
                     </>
                  )}

                  {/* Step 4: Data Orang Tua */}
                  {currentStep === 3 && (
                    <>
                     {/* Ayah */}
                     <div className="space-y-6 border-b pb-6 mb-6 border-dashed">
                       <h4 className="font-medium text-lg text-primary/90">Data Ayah</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                               <Select onValueChange={field.onChange} value={field.value}>
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
                     </div>
                     {/* Ibu */}
                     <div className="space-y-6">
                       <h4 className="font-medium text-lg text-primary/90">Data Ibu</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                               <Select onValueChange={field.onChange} value={field.value}>
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
                     {/* Alamat Orang Tua & Saudara */}
                     <div className="space-y-6 pt-6 border-t border-dashed">
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
                       <FormField
                         control={form.control}
                         name="punyaSaudaraDiMansaba"
                         render={({ field }) => (
                           <FormItem className="space-y-3">
                             <FormLabel>Apakah mempunyai saudara kandung yang masih sekolah di MA NU 01 Banyuputih?</FormLabel>
                             <FormControl>
                               <RadioGroup
                                 onValueChange={field.onChange}
                                 value={field.value}
                                 className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6"
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
                    </>
                  )}

                  {/* Step 5: Data Wali (Conditional) */}
                   {currentStep === 4 && shouldShowStep(currentStep) && (
                     <>
                       <p className="text-sm text-muted-foreground -mt-4 mb-6">Silakan isi data Wali jika siswa tinggal bersama Wali.</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField
                           control={form.control}
                           name="pendidikanWali"
                           render={({ field }) => (
                             <FormItem>
                               <FormLabel>Pendidikan Wali</FormLabel>
                               <Select onValueChange={field.onChange} value={field.value}>
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
                     </>
                   )}

                  {/* Step 6: Data Sekolah Asal & Lainnya */}
                  {currentStep === (shouldShowStep(4) ? 5 : 4) && ( // Adjust index based on Wali step visibility
                     <>
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
                                value={field.value}
                                className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6"
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
                     </>
                  )}

                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between p-6 mt-0 bg-background border-t">
                <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                </Button>
                {currentStep < activeSteps.length - 1 ? (
                  <Button type="button" onClick={handleNext} className="bg-primary hover:bg-primary/90">
                    Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg font-semibold shadow-md transform hover:scale-105 transition-transform duration-200" disabled={form.formState.isSubmitting}>
                    <PenSquare className="mr-2 h-5 w-5" />
                    {form.formState.isSubmitting ? 'Mengirim Data...' : 'Kirim Pendaftaran Saya'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    