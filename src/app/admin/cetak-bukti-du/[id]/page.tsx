'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation'; // Import usePathname
import { BuktiDaftarUlangPrint, type BuktiDaftarUlangData } from '@/components/cetak/bukti-daftar-ulang-print';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils'; // Import cn

// Mock data structure
interface CombinedData {
  pendaftarId: number;
  nomorPendaftaran: string;
  nama: string;
  alamatLengkap: string;
  sekolahAsal: string;
  kabupaten: string;
  daftarUlangId: number;
  nomorDaftarUlang: string;
  kelengkapanKK: boolean;
  kelengkapanSKL: boolean;
  kelengkapanPiagam: boolean;
  kelengkapanSKTM: boolean;
  bayarDaftarUlang: boolean;
  biayaDaftarUlang?: number | null;
  tanggalDaftarUlang: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan'; // Added for filtering later if needed
  ukuranSeragam: string; // Added
  seragamOsis: boolean; // Added
  seragamPramuka: boolean; // Added
  seragamBatik: boolean; // Added
  seragamOlahraga: boolean; // Added
}

// Mock Combined Data - Updated with new fields
const mockCombinedData: CombinedData[] = [
   {
     pendaftarId: 1, nomorPendaftaran: 'A-2526/0001', nama: 'Ahmad Fauzi', alamatLengkap: 'Dukuh Krajan, Banyuputih, RT/RW 01/01, Kec. Banyuputih, Kab. Batang, Prov. Jawa Tengah', sekolahAsal: 'MTs N 1 Batang', kabupaten: 'Batang',
     daftarUlangId: 101, nomorDaftarUlang: 'DU-1', kelengkapanKK: true, kelengkapanSKL: true, kelengkapanPiagam: false, kelengkapanSKTM: false, bayarDaftarUlang: true, biayaDaftarUlang: 400000, tanggalDaftarUlang: '2024-07-15', jenisKelamin: 'Laki-laki', ukuranSeragam: 'L', seragamOsis: true, seragamPramuka: true, seragamBatik: true, seragamOlahraga: false
   },
   {
     pendaftarId: 3, nomorPendaftaran: 'A-2526/0003', nama: 'Citra Lestari', alamatLengkap: 'Dukuh Sawah, Subah, RT/RW 02/03, Kec. Subah, Kab. Batang, Prov. Jawa Tengah', sekolahAsal: 'MTs Al Hidayah', kabupaten: 'Batang',
     daftarUlangId: 102, nomorDaftarUlang: 'DU-2', kelengkapanKK: true, kelengkapanSKL: false, kelengkapanPiagam: true, kelengkapanSKTM: true, bayarDaftarUlang: true, biayaDaftarUlang: 300000, tanggalDaftarUlang: '2024-07-15', jenisKelamin: 'Perempuan', ukuranSeragam: 'M', seragamOsis: true, seragamPramuka: true, seragamBatik: true, seragamOlahraga: true
   },
   {
     pendaftarId: 6, nomorPendaftaran: 'A-2526/0006', nama: 'Fitri Handayani', alamatLengkap: 'Jl. Mawar No. 1, Subah, Batang', sekolahAsal: 'SMP N 1 Subah', kabupaten: 'Batang',
     daftarUlangId: 103, nomorDaftarUlang: 'DU-3', kelengkapanKK: false, kelengkapanSKL: true, kelengkapanPiagam: false, kelengkapanSKTM: false, bayarDaftarUlang: false, biayaDaftarUlang: null, tanggalDaftarUlang: '2024-07-16', jenisKelamin: 'Perempuan', ukuranSeragam: 'XL', seragamOsis: true, seragamPramuka: false, seragamBatik: true, seragamOlahraga: true
   },
 ];

// Component to render the actual page content once auth is confirmed
const CetakBuktiDUPageContent = () => {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth(); // Get the authenticated user from context
    const daftarUlangId = params?.id ? parseInt(params.id as string, 10) : null;
    const [data, setData] = useState<BuktiDaftarUlangData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = useState(false); // State to track client-side mounting

    useEffect(() => {
        setIsClient(true); // Set when component mounts on the client
    }, []);


    useEffect(() => {
      if (!isClient || authLoading) return; // Don't fetch until client-side and auth is ready

      const fetchData = async () => {
        if (!daftarUlangId) {
          setError('ID Daftar Ulang tidak valid.');
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);
        try {
          console.log(`Fetching data for Daftar Ulang ID: ${daftarUlangId}`);
          await new Promise(resolve => setTimeout(resolve, 500));
          const foundData = mockCombinedData.find(item => item.daftarUlangId === daftarUlangId);

          if (foundData) {
             const mappedData: BuktiDaftarUlangData = {
                 nomorPendaftaran: foundData.nomorPendaftaran,
                 namaPendaftar: foundData.nama,
                 asalSekolah: foundData.sekolahAsal,
                 alamat: foundData.alamatLengkap,
                 nomorDaftarUlang: foundData.nomorDaftarUlang,
                 kelengkapanKK: foundData.kelengkapanKK,
                 kelengkapanSKL: foundData.kelengkapanSKL,
                 kelengkapanPiagam: foundData.kelengkapanPiagam,
                 kelengkapanSKTM: foundData.kelengkapanSKTM,
                 bayarDaftarUlang: foundData.bayarDaftarUlang,
                 biayaDaftarUlang: foundData.biayaDaftarUlang,
                 tanggalDaftarUlang: foundData.tanggalDaftarUlang,
                 kabupatenTempat: foundData.kabupaten,
                 namaPetugas: user?.name || 'Panitia PPDB', // Use logged-in user's name or default
             };
            setData(mappedData);
          } else {
            setError(`Data daftar ulang dengan ID ${daftarUlangId} tidak ditemukan.`);
          }
        } catch (err) {
          console.error('Error fetching daftar ulang data:', err);
          setError('Gagal memuat data daftar ulang.');
          toast({
             title: "Gagal Memuat Data",
             description: "Terjadi kesalahan saat mengambil data daftar ulang.",
             variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

       if (daftarUlangId && !authLoading) {
           fetchData();
       } else if (!daftarUlangId) {
           setError('ID Daftar Ulang tidak valid.');
           setLoading(false);
       }


    }, [daftarUlangId, user, authLoading, isClient, router]); // Added router

   const handlePrint = () => {
     console.log('Handle Print button clicked.');
     const printContent = printRef.current;

     if (!printContent) {
       console.error('Print content ref is null or not available.');
       toast({ title: "Gagal Mencetak", description: "Konten untuk dicetak tidak ditemukan.", variant: "destructive" });
       return;
     }

      // Use a minimal delay to allow potential DOM updates if any
      setTimeout(() => {
         const printWindow = window.open('', '_blank', 'height=800,width=1200,scrollbars=yes'); // Adjusted default size

         if (!printWindow) {
           console.error('Failed to open print window. Pop-up might be blocked.');
           toast({ title: "Gagal Membuka Jendela Cetak", description: "Browser Anda mungkin memblokir pop-up.", variant: "destructive" });
           return;
         }

          console.log('Print window opened successfully.');

         let styles = '';
         try {
             styles = Array.from(document.styleSheets)
               .map(styleSheet => {
                 try {
                   // Only include internal/inline styles or those from the same origin
                   if (!styleSheet.href || styleSheet.href.startsWith(window.location.origin) || styleSheet.href.startsWith('/')) {
                     return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('');
                   } return '';
                 } catch (e) { console.warn('Could not read CSS rules from stylesheet:', styleSheet.href, e); return ''; }
               }).join('\n');
             console.log('Collected styles for print window.');
         } catch (e) { console.error("Error collecting styles:", e); }

         // Updated printSpecificStyles for F4 Landscape (330mm x 210mm) with 1cm margin
         const printSpecificStyles = `
           @media print {
             @page {
               size: 330mm 210mm; /* F4 Landscape */
               margin: 1cm; /* 1cm margin on all sides */
             }
             html, body {
               margin: 0;
               padding: 0;
               font-family: Arial, sans-serif; /* Use a common sans-serif font */
               font-size: 9pt; /* Base font size */
               line-height: 1.2;
               -webkit-print-color-adjust: exact !important; /* Force color printing */
               print-color-adjust: exact !important;
               width: 100%;
               height: 100%; /* Ensure body takes full printable height */
               background-color: white !important; /* Ensure white background for print */
             }
             .no-print { display: none !important; }
             /* Main container for the two receipts */
             .print-container {
                display: flex !important;
                flex-direction: row !important; /* Side by side */
                justify-content: space-between !important;
                align-items: flex-start !important; /* Align items at the top */
                gap: 10mm !important; /* Gap between the two receipts */
                width: calc(330mm - 2cm); /* Full printable width */
                height: calc(210mm - 2cm); /* Full printable height */
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
                box-sizing: border-box !important;
                /* Remove overflow hidden for print? */
             }
             /* Style for each individual receipt wrapper */
             .receipt-outer-wrapper {
                 width: calc(( (330mm - 2cm) - 10mm) / 2); /* (Printable Width - Gap) / 2 */
                 height: 100% !important; /* Make wrapper take full calculated height */
                 border: 1px solid black !important; /* Add border to the wrapper */
                 box-sizing: border-box !important;
                 display: flex !important; /* Use flex here */
                 flex-direction: column !important; /* Stack header/content/footer vertically */
                 page-break-inside: avoid !important; /* Try to prevent breaking inside wrapper */
                 overflow: hidden; /* Hide overflow within the bordered box */
             }
             /* Style for the content inside the wrapper */
             .receipt-container {
                 padding: 4mm !important; /* Apply padding inside the border */
                 box-sizing: border-box !important;
                 width: 100% !important;
                 height: 100% !important; /* Occupy full height of wrapper */
                 display: flex !important;
                 flex-direction: column !important; /* Stack vertically */
                 font-size: 9pt !important;
                 line-height: 1.2 !important;
                 border: none !important; /* No border on inner container */
                 page-break-inside: avoid !important;
                 background-color: white !important;
             }
             /* Ensure content grows and footer sticks to bottom */
             .receipt-content { flex-grow: 1 !important; } /* Allow content to take available space */
             .receipt-footer { margin-top: auto !important; padding-top: 2mm !important; flex-shrink: 0 !important; } /* Push footer to bottom */

             /* Fine-tune spacing and font sizes based on the reference image */
             .receipt-container h1, .receipt-container h2, .receipt-container h3 { margin-bottom: 1mm; line-height: 1.1; font-weight: bold; }
             .receipt-container .text-xs { font-size: 9pt !important; line-height: 1.2 !important; }
             .receipt-container .text-sm { font-size: 10pt !important; line-height: 1.2 !important; }
             .receipt-container .text-base { font-size: 11pt !important; line-height: 1.2 !important; }
             .receipt-container .font-bold { font-weight: bold !important; }
             .receipt-container .font-semibold { font-weight: 600 !important; }
             .receipt-container .font-medium { font-weight: 500 !important; }
             .receipt-container .underline { text-decoration: underline !important; }

             /* Adjust DataRow specifically */
             .receipt-container .flex.mb-0_5 { margin-bottom: 0 !important; }
             .receipt-container span.w-\\[100px\\] { width: 100px !important; }
             .receipt-container span.mr-2 { margin-right: 8px !important; }

             /* Adjust ChecklistItem */
             .receipt-container .flex.items-center.mb-0 { margin-bottom: 0 !important; }
             .receipt-container .w-3.h-3.mr-1 { width: 9pt !important; height: 9pt !important; margin-right: 4px !important; }
             .receipt-container .text-black { color: black !important; } /* Ensure checkmark is black */
             .receipt-container .text-gray-500 { color: #6b7280 !important; } /* Ensure empty box is gray */

             /* Adjust Header and Title Styling */
              .receipt-container .border-b-2.border-black { border-bottom-width: 2px !important; border-color: black !important; }
              .receipt-container .h-\\[2px\\].bg-red-600 { height: 1.5pt !important; background-color: #dc2626 !important; print-color-adjust: exact !important; } /* Red color */
              .receipt-container .w-1\\/3 { width: 33.33% !important; }
              .receipt-container .mx-auto { margin-left: auto !important; margin-right: auto !important; }
              .receipt-container .text-green-700 { color: #047857 !important; } /* Green color */
              .receipt-container .bg-transparent { background-color: transparent !important; }

             /* Adjust Footer Box */
             .receipt-container .border.border-black.p-1\\.5.mt-1.mb-2 { /* Adjusted margin here */
                border-width: 1px !important;
                border-color: black !important;
                padding: 1mm !important;
                background-color: #f3f4f6 !important; /* Light gray background */
                print-color-adjust: exact !important; /* Ensure background prints */
                margin-top: 1mm !important; /* Reduce top margin */
                margin-bottom: 1mm !important; /* Reduce bottom margin */
             }
             .receipt-container .text-\\[8pt\\] { font-size: 7pt !important; line-height: 1.1 !important; }
             .receipt-container .small-print { font-size: 7pt !important; line-height: 1.1 !important; } /* Ensure class applies */

             /* Adjust Signature */
             .receipt-container .signature-space { height: 15mm !important; } /* Increased space for signature */
             .receipt-container .receipt-signature { margin-top: 1mm !important; } /* Reduced margin above signature block */
           }
           /* Screen styles for preview */
           @media screen {
               body { background-color: #f3f4f6; /* Light gray background for screen */ }
               .print-container {
                   max-width: 1200px; /* Limit width on screen */
                   margin: 1rem auto; /* Center on screen */
                   align-items: flex-start; /* Align items at the top */
                   padding: 1rem; /* Add padding for screen view */
                   background-color: transparent; /* Transparent background for container on screen */
                   min-height: auto; /* Don't force page height on screen */
               }
               .receipt-outer-wrapper {
                   flex: 1;
                   margin-bottom: 1rem; /* Space below receipts on screen */
                   background-color: white;
                   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                   min-height: 200mm; /* Minimum height for better preview */
                   height: auto; /* Allow content to determine height */
                   width: 48%; /* Approximate width for side-by-side view */
                   overflow: visible; /* Allow content to be visible on screen */
               }
               .receipt-container {
                    height: auto; /* Let content define height */
                    overflow: visible; /* Allow content to be visible on screen */
               }
           }
         `;


         try {
           const originalTitle = document.title;
           const printDoc = printWindow.document;

           printDoc.open();
           printDoc.write(`<!DOCTYPE html><html lang="id"><head><title>Bukti Daftar Ulang - ${data?.namaPendaftar || daftarUlangId}</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${styles}${printSpecificStyles}</style></head><body><div class="print-container">${printContent.innerHTML}</div></body></html>`);
           printDoc.close();

           setTimeout(() => {
             try {
               console.log('Executing print command.');
               printWindow.focus(); // Focus the window before printing
               printWindow.print();
               console.log('Print command executed.');
             } catch (printError) {
               console.error("Error during print execution:", printError);
               toast({ title: "Gagal Mencetak", description: "Terjadi kesalahan saat mencoba mencetak.", variant: "destructive" });
                if (printWindow && !printWindow.closed) printWindow.close();
             } finally {
                 console.log('Restoring original document title.');
                 document.title = originalTitle;
                 // Optionally close window after print attempt:
                 // setTimeout(() => { if (printWindow && !printWindow.closed) printWindow.close(); }, 2000);
             }
           }, 1000); // Increased delay slightly to ensure styles apply

         } catch (writeError) {
           console.error("Error writing to print window:", writeError);
           toast({ title: "Gagal Mempersiapkan Cetak", description: "Terjadi kesalahan saat menyiapkan halaman cetak.", variant: "destructive" });
           if (printWindow && !printWindow.closed) printWindow.close();
         }
      }, 50); // Added small delay
   };

     if (authLoading) {
       return (
           <div className="flex justify-center items-center h-screen">
               <Loader2 className="mr-2 h-8 w-8 animate-spin" />
               <span>Memuat data bukti daftar ulang...</span>
           </div>
       );
     }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <span>Mengarahkan...</span>
            </div>
        );
    }

    if (error) {
      return <div className="flex justify-center items-center h-screen text-red-600"><p>{error}</p></div>;
    }

    if (!data) {
      return (
           <div className="flex justify-center items-center h-screen">
               <p>Data tidak ditemukan atau gagal dimuat.</p>
           </div>
      );
    }

    return (
      <div className="p-4 print:p-0 min-h-screen flex flex-col">
         <div className="mb-4 flex justify-between items-center no-print max-w-6xl mx-auto w-full"> {/* Ensure controls take full width */}
             <Button variant="outline" size="sm" onClick={() => router.back()}>
                 <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
             </Button>
             <Button onClick={handlePrint} size="sm" >
                 <Printer className="mr-2 h-4 w-4" /> Cetak Bukti (F4 Landscape)
             </Button>
         </div>
        <div ref={printRef} className="print-preview-container flex-grow">
          <BuktiDaftarUlangPrint data={data} />
        </div>
      </div>
    );
};

// Component to handle authentication check before rendering content
const AuthCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [isClient, setIsClient] = useState(false);

     useEffect(() => {
         setIsClient(true);
     }, []);

     if (!isClient || authLoading) {
         return (
             <div className="flex justify-center items-center h-screen">
                 <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                 <span>Memeriksa autentikasi...</span>
             </div>
         );
     }

    return <>{user ? children : null}</>; // Render children only if user exists after loading
};


// Main component that uses the AuthCheck wrapper
const CetakBuktiDUPage = () => {
   return (
       <AuthCheck>
           <CetakBuktiDUPageContent />
       </AuthCheck>
   );
};

export default CetakBuktiDUPage;
