'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FormulirPendaftaranPrint, type FormulirData } from '@/components/cetak/formulir-pendaftaran-print';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

// Mock data structure
interface PendaftarLengkap extends FormulirData {
  id: number;
}

const mockFullData: PendaftarLengkap[] = [
   {
     id: 1,
     nomorPendaftaran: 'A-2526/0001',
     nisn: '0098765432',
     nama: 'Ahmad Fauzi',
     tempatTanggalLahir: 'Batang, 15 Januari 2009',
     jenisKelamin: 'Laki-laki',
     alamatLengkap: 'Dukuh Krajan, Banyuputih, RT/RW 01/01, Kec. Banyuputih, Kab. Batang, Prov. Jawa Tengah',
     desa: 'Banyuputih',
     kecamatan: 'Banyuputih',
     kabupaten: 'Batang',
     provinsi: 'Jawa Tengah',
     dukuhJalan: 'Dukuh Krajan',
     rt: '01',
     rw: '01',
     noHp: '081234567890',
     tinggal: 'Bersama Orang tua',
     jalurPendaftaran: 'Reguler Umum',
     programPeminatan: 'MIPA',
     namaAyah: 'Suparjo',
     pendidikanAyah: 'SMA/SMK',
     pekerjaanAyah: 'Wiraswasta',
     noHpAyah: '081111111111',
     namaIbu: 'Siti Aminah',
     pendidikanIbu: 'SMP',
     pekerjaanIbu: 'Ibu Rumah Tangga',
     noHpIbu: '082222222222',
     alamatOrangtua: 'Sama dengan siswa',
     namaWali: '',
     hubunganWali: '',
     pendidikanWali: undefined,
     pekerjaanWali: '',
     alamatWali: '',
     noHpWali: '',
     namaSekolahAsal: 'MTs N 1 Batang',
     alamatSekolahAsal: 'Jl. Raya Batang No. 10',
     rekomendasiPendaftaran: 'Guru MTs',
     punyaPiagam: 'Tidak Punya',
     motivasi: 'Ingin mendalami ilmu agama dan umum.',
     tanggalDaftar: new Date()
   },
   {
     id: 2,
     nomorPendaftaran: 'A-2526/0002',
     nisn: '0091234567',
     nama: 'Budi Santoso',
     tempatTanggalLahir: 'Pekalongan, 20 Februari 2009',
     jenisKelamin: 'Laki-laki',
     alamatLengkap: 'Jl. Melati No. 5, Pekalongan Utara, RT/RW 03/05, Kec. Pekalongan Utara, Kab. Pekalongan, Prov. Jawa Tengah',
     desa: 'Pekalongan Utara',
     kecamatan: 'Pekalongan Utara',
     kabupaten: 'Pekalongan',
     provinsi: 'Jawa Tengah',
     dukuhJalan: 'Jl. Melati No. 5',
     rt: '03',
     rw: '05',
     noHp: '081234567891',
     tinggal: 'Bersama Wali',
     jalurPendaftaran: 'Reguler Sosial',
     programPeminatan: 'IPS',
     namaAyah: 'Joko Susilo',
     pendidikanAyah: 'S1',
     pekerjaanAyah: 'PNS',
     noHpAyah: '083333333333',
     namaIbu: 'Endang Lestari',
     pendidikanIbu: 'SMA/SMK',
     pekerjaanIbu: 'Karyawan Swasta',
     noHpIbu: '084444444444',
     alamatOrangtua: 'Sama dengan wali',
     namaWali: 'Sugeng Raharjo',
     hubunganWali: 'Paman',
     pendidikanWali: 'D3',
     pekerjaanWali: 'Pedagang',
     alamatWali: 'Jl. Melati No. 5, Pekalongan Utara, RT/RW 03/05, Kec. Pekalongan Utara, Kab. Pekalongan, Prov. Jawa Tengah',
     noHpWali: '085555555555',
     namaSekolahAsal: 'SMP N 2 Banyuputih',
     alamatSekolahAsal: 'Jl. Pendidikan No. 1',
     rekomendasiPendaftaran: 'Saudara',
     punyaPiagam: 'Punya',
     motivasi: 'Tertarik dengan program IPS.',
     tanggalDaftar: new Date()
   },
    {
     id: 4,
     nomorPendaftaran: 'A-2526/0004',
     nisn: '0098887776',
     nama: 'Dewi Anggraini',
     tempatTanggalLahir: 'Batang, 19 Mei 2010',
     jenisKelamin: 'Perempuan',
     alamatLengkap: 'Kebumen Rt. 010/003 Kec. Tersono Kab. Batang',
     desa: 'Kebumen',
     kecamatan: 'Tersono',
     kabupaten: 'Batang',
     provinsi: 'Jawa Tengah',
     dukuhJalan: 'Karangjati',
     rt: '10',
     rw: '03',
     noHp: '081567987147',
     tinggal: 'Bersama Orang tua',
     jalurPendaftaran: 'Reguler Sosial',
     programPeminatan: 'IPS',
     namaAyah: 'Muji Teguh',
     pendidikanAyah: 'SD',
     pekerjaanAyah: 'PETANI',
     noHpAyah: '081567987147',
     namaIbu: 'Ngatirah',
     pendidikanIbu: 'SD',
     pekerjaanIbu: 'IRT',
     noHpIbu: '081567987147',
     alamatOrangtua: 'KARANGJATI, KEBUMEN, TERSONO, BATANG',
     namaWali: 'MUJI TEGUH',
     hubunganWali: 'AYAH',
     pendidikanWali: 'SD',
     pekerjaanWali: 'PETANI',
     alamatWali: 'KARANGJATI, KEBUMEN, TERSONO, BATANG',
     noHpWali: '081567987147',
     namaSekolahAsal: 'MTS NURUSSALAM TERSONO',
     alamatSekolahAsal: 'TERSONO',
     rekomendasiPendaftaran: 'Ahmad Mashfufi',
     punyaPiagam: 'Punya',
     motivasi: 'TOLABUL ILMI',
     tanggalDaftar: new Date('2025-04-26')
   },
 ];

// Component to render the actual page content once auth is confirmed
const CetakFormulirPageContent = () => {
    const params = useParams();
    const router = useRouter();
    const pendaftarId = params?.id ? parseInt(params.id as string, 10) : null;
    const [data, setData] = useState<PendaftarLengkap | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false); // State to track client-side mounting
    const [letterheadUri, setLetterheadUri] = useState<string | null>(null); // State for letterhead

    useEffect(() => {
        setIsClient(true); // Mark as client-side
        // Load letterhead from localStorage on client-side mount
        const storedUri = localStorage.getItem('customLetterheadUri');
        if (storedUri) {
            setLetterheadUri(storedUri);
        }
    }, []);

    useEffect(() => {
        if (!isClient) return; // Don't fetch until client-side

        const fetchData = async () => {
            if (!pendaftarId) {
                setError('ID Pendaftar tidak valid.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                console.log(`Fetching data for ID: ${pendaftarId}`);
                await new Promise(resolve => setTimeout(resolve, 500));
                const foundData = mockFullData.find(item => item.id === pendaftarId);

                if (foundData) {
                    const dataWithPrintDate: FormulirData = {
                        ...foundData,
                        tanggalCetak: format(new Date(), 'dd MMMM yyyy', { locale: localeId })
                    };
                    setData(dataWithPrintDate as PendaftarLengkap);
                } else {
                    setError(`Data pendaftar dengan ID ${pendaftarId} tidak ditemukan.`);
                }
            } catch (err) {
                console.error('Error fetching pendaftar data:', err);
                setError('Gagal memuat data pendaftar.');
                toast({
                    title: "Gagal Memuat Data",
                    description: "Terjadi kesalahan saat mengambil data pendaftar.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [pendaftarId, isClient]); // Depend on isClient

   const handlePrint = () => {
     const printContent = printRef.current;
     if (!printContent || !isClient) { // Ensure client side
          toast({
             title: "Gagal Mencetak",
             description: "Konten formulir tidak ditemukan atau komponen belum siap.",
             variant: "destructive",
          });
         return;
     }

     setTimeout(() => {
         const originalTitle = document.title;
         document.title = `Formulir Pendaftaran - ${data?.nama || pendaftarId}`;

         let styles = '';
         try {
             styles = Array.from(document.styleSheets)
                .map(styleSheet => {
                  try {
                   if (!styleSheet.href || styleSheet.href.startsWith(window.location.origin) || styleSheet.href.startsWith('/')) {
                       return Array.from(styleSheet.cssRules)
                           .map(rule => rule.cssText)
                           .join('');
                   }
                   return '';
                  } catch (e) {
                    console.warn('Could not read CSS rules from stylesheet:', styleSheet.href, e);
                    return '';
                  }
                })
                .join('\n');
         } catch (e) {
             console.error("Error collecting styles:", e);
         }

         const printWindow = window.open('', '', 'height=800,width=800,scrollbars=yes');
         if (printWindow) {
            printWindow.document.write('<!DOCTYPE html><html lang="id"><head><title>');
            printWindow.document.write(document.title);
            printWindow.document.write('</title><meta charset="UTF-8">');
            printWindow.document.write('<style>');
            printWindow.document.write(styles);
            printWindow.document.write(`
              @media print {
                @page { size: A4; margin: 15mm; }
                body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.2; background-color: white !important; }
                .no-print { display: none !important; }
                 .print-container { width: 100%; max-width: 100%; margin: 0; padding: 0; border: none; box-shadow: none; break-inside: avoid; background-color: white !important; }
                 h3 { margin-top: 0.5rem; margin-bottom: 0.25rem; }
                 .grid > div { break-inside: avoid; }
                 img { max-width: 100%; height: auto; object-fit: contain; } /* Ensure images print well */
              }
            `);
            printWindow.document.write('</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<div class="print-container">');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</div>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();

             setTimeout(() => {
                try {
                   printWindow.focus();
                   printWindow.print();
                } catch(e) {
                   console.error("Error during print execution:", e);
                    toast({ title: "Gagal Mencetak", description: "Terjadi kesalahan saat memulai proses cetak.", variant: "destructive" });
                   if (!printWindow.closed) printWindow.close();
                } finally {
                   document.title = originalTitle;
                }
             }, 500);

         } else {
            toast({ title: "Gagal Membuka Jendela", description: "Browser mungkin memblokir pop-up. Mohon izinkan pop-up.", variant: "destructive" });
         }
       }, 0);
   };

    if (!isClient || loading) { // Show loading if not client or data is loading
      return <div className="flex justify-center items-center h-screen"><Loader2 className="mr-2 h-8 w-8 animate-spin" /><span>Memuat data formulir...</span></div>;
    }

    if (error) {
      return <div className="flex justify-center items-center h-screen text-red-600"><p>{error}</p></div>;
    }

    if (!data) {
      return <div className="flex justify-center items-center h-screen"><p>Data tidak tersedia.</p></div>;
    }

    return (
      <div className="bg-gray-100 p-4 print:bg-white print:p-0">
         <div className="mb-4 flex justify-between items-center no-print">
             <Button variant="outline" size="sm" onClick={() => router.back()}>
                 <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
             </Button>
           <Button onClick={handlePrint} size="sm">
             <Printer className="mr-2 h-4 w-4" /> Cetak Ulang Formulir (A4)
           </Button>
         </div>
        <div ref={printRef} className="print-container bg-white shadow-md print:shadow-none">
          {/* Pass letterheadUri to the print component */}
          <FormulirPendaftaranPrint data={data} />
        </div>
      </div>
    );
};

// Component to handle authentication check before rendering content
const AuthCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

     useEffect(() => {
         setIsClient(true);
     }, []);

     useEffect(() => {
        if (!isClient || authLoading) return;

        const isPrintPage = pathname?.startsWith('/admin/cetak-');
        const isAdminPath = pathname?.startsWith('/admin');
        const isLoginPage = pathname === '/login';

        if (!user && isAdminPath && !isLoginPage && !isPrintPage) {
             console.log("AuthCheck: User not authenticated on protected admin page, redirecting from", pathname);
             const redirectUrl = `/login?redirect=${encodeURIComponent(pathname || '/')}`;
             router.push(redirectUrl);
         } else if (user && isLoginPage) {
             console.log("AuthCheck: User authenticated on login page, redirecting to /admin");
             router.push('/admin');
         }
     }, [isClient, authLoading, user, router, pathname]);


    if (!isClient || authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <span>Memeriksa autentikasi...</span>
            </div>
        );
    }

    // Render children if user exists OR on login page OR on a print page
    if (user || pathname?.startsWith('/login') || pathname?.startsWith('/admin/cetak-')) {
        return <>{children}</>;
    }

    // Fallback for non-user on protected admin pages
    return null;
};


// Main component that uses the AuthCheck wrapper
const CetakFormulirPage = () => {
   return (
       <AuthCheck>
           <CetakFormulirPageContent />
       </AuthCheck>
   );
};


export default CetakFormulirPage;
