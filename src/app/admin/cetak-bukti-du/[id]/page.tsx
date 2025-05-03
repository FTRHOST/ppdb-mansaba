
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BuktiDaftarUlangPrint, type BuktiDaftarUlangData } from '@/components/cetak/bukti-daftar-ulang-print'; // Import the specific print component
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast'; // Import toast
import { useAuth } from '@/hooks/use-auth'; // Import useAuth

// Mock data structure - Combine Pendaftar and DaftarUlang data
interface CombinedData {
  // From Pendaftar (example fields needed)
  pendaftarId: number;
  nomorPendaftaran: string;
  nama: string;
  alamatLengkap: string;
  sekolahAsal: string;
  kabupaten: string; // For signature location

  // From DaftarUlang (example fields needed)
  daftarUlangId: number;
  nomorDaftarUlang: string;
  kelengkapanKK: boolean;
  kelengkapanSKL: boolean;
  kelengkapanPiagam: boolean;
  kelengkapanSKTM: boolean;
  bayarDaftarUlang: boolean;
  biayaDaftarUlang?: number | null;
  tanggalDaftarUlang: string; // YYYY-MM-DD
}

// Mock Combined Data - Replace with actual data fetching logic based on Daftar Ulang ID
const mockCombinedData: CombinedData[] = [
   {
     pendaftarId: 1,
     nomorPendaftaran: 'A-2526/0001',
     nama: 'Ahmad Fauzi',
     alamatLengkap: 'Dukuh Krajan, Banyuputih, RT/RW 01/01, Kec. Banyuputih, Kab. Batang, Prov. Jawa Tengah',
     sekolahAsal: 'MTs N 1 Batang',
     kabupaten: 'Batang',
     daftarUlangId: 101,
     nomorDaftarUlang: 'DU-1',
     kelengkapanKK: true,
     kelengkapanSKL: true,
     kelengkapanPiagam: false,
     kelengkapanSKTM: false,
     bayarDaftarUlang: true,
     biayaDaftarUlang: 400000,
     tanggalDaftarUlang: '2024-07-15'
   },
   {
     pendaftarId: 3,
     nomorPendaftaran: 'A-2526/0003',
     nama: 'Citra Lestari',
     alamatLengkap: 'Dukuh Sawah, Subah, RT/RW 02/03, Kec. Subah, Kab. Batang, Prov. Jawa Tengah',
     sekolahAsal: 'MTs Al Hidayah',
     kabupaten: 'Batang',
     daftarUlangId: 102,
     nomorDaftarUlang: 'DU-2',
     kelengkapanKK: true,
     kelengkapanSKL: false,
     kelengkapanPiagam: true,
     kelengkapanSKTM: true,
     bayarDaftarUlang: true,
     biayaDaftarUlang: 300000,
     tanggalDaftarUlang: '2024-07-15'
   },
   {
     pendaftarId: 6,
     nomorPendaftaran: 'A-2526/0006',
     nama: 'Fitri Handayani',
     alamatLengkap: 'Jl. Mawar No. 1, Subah, Batang',
     sekolahAsal: 'SMP N 1 Subah',
     kabupaten: 'Batang',
     daftarUlangId: 103,
     nomorDaftarUlang: 'DU-3',
     kelengkapanKK: false,
     kelengkapanSKL: true,
     kelengkapanPiagam: false,
     kelengkapanSKTM: false,
     bayarDaftarUlang: false,
     biayaDaftarUlang: null,
     tanggalDaftarUlang: '2024-07-16'
   },
 ];

const CetakBuktiDUPageContent = () => {
    const params = useParams();
    const router = useRouter();
    // The ID from the URL corresponds to the DAFTAR ULANG record ID
    const daftarUlangId = params?.id ? parseInt(params.id as string, 10) : null;
    const [data, setData] = useState<BuktiDaftarUlangData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const fetchData = async () => {
        if (!daftarUlangId) {
          setError('ID Daftar Ulang tidak valid.');
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);
        try {
          // TODO: Replace with actual API call to fetch combined data by DAFTAR ULANG ID
          console.log(`Fetching data for Daftar Ulang ID: ${daftarUlangId}`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
          const foundData = mockCombinedData.find(item => item.daftarUlangId === daftarUlangId);

          if (foundData) {
            // Map combined data to the structure needed by BuktiDaftarUlangPrint
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

      fetchData();
    }, [daftarUlangId]);

   const handlePrint = () => {
     console.log('Handle Print button clicked.');
     const printContent = printRef.current;

     if (!printContent) {
       console.error('Print content ref is null or not available.');
       toast({
         title: "Gagal Mencetak",
         description: "Konten untuk dicetak tidak ditemukan.",
         variant: "destructive",
       });
       return;
     }

      // Use a timeout to ensure the print dialog opens after the current event loop tick
      // This can help prevent issues with pop-up blockers in some browsers triggered by rapid actions
      setTimeout(() => {
         const printWindow = window.open('', '_blank', 'height=800,width=1100,scrollbars=yes'); // Adjusted width, added scrollbars

         if (!printWindow) {
           console.error('Failed to open print window. Pop-up might be blocked.');
           toast({
             title: "Gagal Membuka Jendela Cetak",
             description: "Browser Anda mungkin memblokir pop-up. Mohon izinkan pop-up untuk situs ini.",
             variant: "destructive",
           });
           return;
         }

          console.log('Print window opened successfully.');

         // Prepare styles
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
             console.log('Collected styles for print window.');
         } catch (e) {
             console.error("Error collecting styles:", e);
             toast({
                 title: "Gagal Mengumpulkan Style",
                 description: "Tidak dapat memuat semua gaya untuk pencetakan.",
                 variant: "destructive",
             });
             // Optionally proceed without all styles or close the window
             // printWindow.close();
             // return;
         }

         // Print-specific styles (including F4 landscape)
         const printSpecificStyles = `
           @media print {
             @page {
                 size: 215.9mm 330.2mm landscape; /* F4 Landscape size */
                 margin: 10mm; /* Adjust margin as needed */
             }
             body {
                 margin: 0;
                 padding: 0;
                 font-family: 'Times New Roman', Times, serif;
                 font-size: 9pt;
                 line-height: 1.15;
                 -webkit-print-color-adjust: exact;
                 print-color-adjust: exact;
             }
             .no-print { display: none !important; }
             .print-container {
                 display: flex !important; /* Ensure flex */
                 justify-content: space-between !important;
                 align-items: flex-start !important;
                 gap: 10mm !important; /* Adjust gap between receipts */
                 width: 100% !important;
                 padding: 0 !important;
                 border: none !important;
                 box-shadow: none !important;
                 page-break-inside: avoid !important;
             }
             .receipt-container {
                 flex: 1 !important;
                 max-width: calc(50% - 5mm) !important; /* Half width minus half gap */
                 border: 1px solid black !important;
                 padding: 4mm !important;
                 box-sizing: border-box !important;
                 height: auto !important;
                 overflow: hidden !important;
                 break-inside: avoid !important;
                 /* Font overrides */
                 font-size: 8pt !important;
                 line-height: 1.1 !important;
             }
              .receipt-container h1, .receipt-container h2, .receipt-container h3 { margin-bottom: 1mm; line-height: 1.1; }
              .receipt-container .text-xs { font-size: 8pt !important; line-height: 1.1 !important; }
              .receipt-container .text-sm { font-size: 9pt !important; line-height: 1.1 !important; }
              .receipt-container .text-base { font-size: 10pt !important; line-height: 1.1 !important; }
              .receipt-container .font-bold { font-weight: bold !important; }
              .receipt-container .font-semibold { font-weight: 600 !important; }
              .receipt-container .font-medium { font-weight: 500 !important; }
              .receipt-container .mb-0_5 { margin-bottom: 0.5mm !important; }
              .receipt-container .mb-1 { margin-bottom: 1mm !important; }
              .receipt-container .mt-1 { margin-top: 1mm !important; }
              .receipt-container .my-1 { margin-top: 1mm !important; margin-bottom: 1mm !important; }
              .receipt-container .p-1 { padding: 1mm !important; }
              .receipt-container .p-2 { padding: 4mm !important; } /* Applied to receipt-container */
              .receipt-container .pb-0_5 { padding-bottom: 0.5mm !important; }
              .receipt-container .mr-1 { margin-right: 1mm !important; }
              .receipt-container .ml-1 { margin-left: 1mm !important; }
              .receipt-container .ml-2 { margin-left: 2mm !important; }
              .receipt-container .w-8 { width: 20pt !important; height: 20pt !important; } /* Logo size */
              .receipt-container .h-8 { height: 20pt !important; }
              .receipt-container .w-5 { width: 12pt !important; height: 12pt !important; } /* Icon in logo */
              .receipt-container .h-5 { height: 12pt !important; }
              .receipt-container .w-3 { width: 8pt !important; height: 8pt !important; } /* Checklist icon */
              .receipt-container .h-3 { height: 8pt !important; }
              .receipt-container .w-\\[70px\\] { width: 70px !important; } /* DataRow label width */
              .receipt-container .text-\\[9px\\] { font-size: 7pt !important; }
              .receipt-container .text-\\[8pt\\] { font-size: 8pt !important; }
              .receipt-container .text-\\[7pt\\] { font-size: 7pt !important; }

              /* Signature spacing */
              .receipt-container .h-5 { height: 10pt !important; } /* Reduce signature space */
           }
         `;

         try {
           const originalTitle = document.title;
           const printDoc = printWindow.document;

           printDoc.open();
           printDoc.write(`
             <html>
               <head>
                 <title>Bukti Daftar Ulang - ${data?.namaPendaftar || daftarUlangId}</title>
                 <style>
                   ${styles}
                   ${printSpecificStyles}
                 </style>
               </head>
               <body>
                 <div class="print-container">
                   ${printContent.innerHTML}
                 </div>
               </body>
             </html>
           `);
           printDoc.close();

           // Use setTimeout to ensure content is rendered before printing
           setTimeout(() => {
             try {
               console.log('Executing print command.');
               printWindow.focus(); // Ensure window has focus
               printWindow.print();
               console.log('Print command executed.');
               // Close the window after a short delay
               // setTimeout(() => {
               //    console.log('Closing print window.');
               //    printWindow.close();
               // }, 1000);
             } catch (printError) {
               console.error("Error during print execution:", printError);
               toast({
                 title: "Gagal Mencetak",
                 description: "Terjadi kesalahan saat mencoba mencetak.",
                 variant: "destructive",
               });
                if (printWindow && !printWindow.closed) printWindow.close(); // Close window on error too
             } finally {
                 console.log('Restoring original document title.');
                 document.title = originalTitle; // Restore original title
             }
           }, 500); // Delay to allow rendering

         } catch (writeError) {
           console.error("Error writing to print window:", writeError);
           toast({
             title: "Gagal Mempersiapkan Cetak",
             description: "Terjadi kesalahan saat menyiapkan halaman cetak.",
             variant: "destructive",
           });
           if (printWindow && !printWindow.closed) {
             printWindow.close();
           }
         }
      }, 0); // End of setTimeout for opening window
   };


    if (loading) {
      return <div className="flex justify-center items-center h-screen"><p>Memuat data bukti daftar ulang...</p></div>;
    }

    if (error) {
      return <div className="flex justify-center items-center h-screen text-red-600"><p>{error}</p></div>;
    }

    if (!data) {
      return <div className="flex justify-center items-center h-screen"><p>Data tidak tersedia.</p></div>;
    }

    return (
      <div className="bg-gray-100 p-4 print:bg-white print:p-0">
         {/* Buttons hidden in print view */}
         <div className="mb-4 flex justify-between items-center no-print">
             <Button variant="outline" size="sm" onClick={() => router.back()}>
                 <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
             </Button>
             <Button onClick={handlePrint} size="sm" >
                 <Printer className="mr-2 h-4 w-4" /> Cetak Bukti (F4 Landscape)
             </Button>
         </div>
        {/* This div is what gets printed */}
        {/* Adjusted width for screen preview. Print styles will override this. */}
        <div ref={printRef} className="max-w-[95%] mx-auto lg:max-w-5xl print:max-w-full">
          {/* The BuktiDaftarUlangPrint component renders the flex layout */}
          <BuktiDaftarUlangPrint data={data} />
        </div>
      </div>
    );
};

// Main component that uses the Auth hook
const CetakBuktiDUPage = () => {
   const { user, loading: authLoading, requireAuth } = useAuth();

    useEffect(() => {
        requireAuth(); // Ensure user is authenticated
    }, [requireAuth]);

    if (authLoading || !user) {
        // Show loading indicator or redirect logic handled by requireAuth
        return <div className="flex justify-center items-center h-screen"><p>Memeriksa autentikasi...</p></div>;
    }

   // If authenticated, render the page content
   return <CetakBuktiDUPageContent />;
};


export default CetakBuktiDUPage;
