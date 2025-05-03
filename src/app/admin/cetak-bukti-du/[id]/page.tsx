
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
}

// Mock Combined Data
const mockCombinedData: CombinedData[] = [
   {
     pendaftarId: 1, nomorPendaftaran: 'A-2526/0001', nama: 'Ahmad Fauzi', alamatLengkap: 'Dukuh Krajan, Banyuputih, RT/RW 01/01, Kec. Banyuputih, Kab. Batang, Prov. Jawa Tengah', sekolahAsal: 'MTs N 1 Batang', kabupaten: 'Batang',
     daftarUlangId: 101, nomorDaftarUlang: 'DU-1', kelengkapanKK: true, kelengkapanSKL: true, kelengkapanPiagam: false, kelengkapanSKTM: false, bayarDaftarUlang: true, biayaDaftarUlang: 400000, tanggalDaftarUlang: '2024-07-15'
   },
   {
     pendaftarId: 3, nomorPendaftaran: 'A-2526/0003', nama: 'Citra Lestari', alamatLengkap: 'Dukuh Sawah, Subah, RT/RW 02/03, Kec. Subah, Kab. Batang, Prov. Jawa Tengah', sekolahAsal: 'MTs Al Hidayah', kabupaten: 'Batang',
     daftarUlangId: 102, nomorDaftarUlang: 'DU-2', kelengkapanKK: true, kelengkapanSKL: false, kelengkapanPiagam: true, kelengkapanSKTM: true, bayarDaftarUlang: true, biayaDaftarUlang: 300000, tanggalDaftarUlang: '2024-07-15'
   },
   {
     pendaftarId: 6, nomorPendaftaran: 'A-2526/0006', nama: 'Fitri Handayani', alamatLengkap: 'Jl. Mawar No. 1, Subah, Batang', sekolahAsal: 'SMP N 1 Subah', kabupaten: 'Batang',
     daftarUlangId: 103, nomorDaftarUlang: 'DU-3', kelengkapanKK: false, kelengkapanSKL: true, kelengkapanPiagam: false, kelengkapanSKTM: false, bayarDaftarUlang: false, biayaDaftarUlang: null, tanggalDaftarUlang: '2024-07-16'
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
                 namaPetugas: user?.name || null, // Get petugas name from auth context
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

      if (user) { // Fetch data only if user is authenticated
          fetchData();
      }
    }, [daftarUlangId, user, authLoading, isClient]); // Add dependencies

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
         const printWindow = window.open('', '_blank', 'height=800,width=1100,scrollbars=yes');

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

         // Adjusted printSpecificStyles to match the new receipt component and target F4 Landscape
         const printSpecificStyles = `
           @media print {
             @page {
               size: 330mm 216mm; /* F4 Landscape approx 13 x 8.5 inches */
               margin: 10mm 8mm 5mm 8mm; /* top, right, bottom, left */
             }
             html, body {
               margin: 0;
               padding: 0;
               font-family: Arial, sans-serif; /* Use a common sans-serif font */
               font-size: 9pt; /* Base font size */
               line-height: 1.2;
               -webkit-print-color-adjust: exact;
               print-color-adjust: exact;
               width: 100%;
               height: auto;
               background-color: white !important; /* Ensure white background for print */
             }
             .no-print { display: none !important; }
             .print-container {
               display: flex !important;
               justify-content: space-between !important;
               align-items: stretch !important; /* Ensure items stretch vertically */
               gap: 10mm !important; /* Gap between the two receipts */
               width: 100% !important;
               height: calc(100vh - 15mm) !important; /* Adjust height based on margins */
               padding: 0 !important;
               border: none !important;
               box-shadow: none !important;
             }
             /* Style for each individual receipt within the container */
             .receipt-outer-wrapper {
                flex: 1 !important; /* Make each wrapper take equal space */
                display: flex; /* Use flex to contain the receipt */
                height: 100%; /* Ensure wrapper takes full height */
                border: 1px solid black !important; /* Add border to the wrapper */
                box-sizing: border-box !important;
             }
             .receipt-container {
                width: 100% !important; /* Receipt container takes full width of its wrapper */
                height: 100% !important; /* Receipt container takes full height */
                border: none !important; /* Remove border from inner container if exists */
                padding: 4mm !important; /* Apply padding inside the border */
                box-sizing: border-box !important;
                display: flex;
                flex-direction: column; /* Stack header, content, footer vertically */
                overflow: hidden !important; /* Prevent overflow */
                break-inside: avoid !important;
                font-size: 9pt !important;
                line-height: 1.2 !important;
             }
             /* Specific adjustments based on new component structure */
             .receipt-content { flex-grow: 1; } /* Allow content to take available space */
             .receipt-footer { margin-top: auto; padding-top: 2mm; } /* Push footer to bottom */

             /* Fine-tune spacing and font sizes based on the reference image */
             .receipt-container h1, .receipt-container h2, .receipt-container h3 { margin-bottom: 1mm; line-height: 1.1; font-weight: bold; }
             .receipt-container .text-xs { font-size: 9pt !important; line-height: 1.2 !important; }
             .receipt-container .text-sm { font-size: 10pt !important; line-height: 1.2 !important; }
             .receipt-container .text-base { font-size: 11pt !important; line-height: 1.2 !important; }
             .receipt-container .font-bold { font-weight: bold !important; }
             .receipt-container .font-semibold { font-weight: 600 !important; }
             .receipt-container .font-medium { font-weight: 500 !important; }

             /* Adjust DataRow specifically */
             .receipt-container .flex.mb-0_5 { margin-bottom: 0 !important; } /* Remove bottom margin */
             .receipt-container span.w-\\[100px\\] { width: 100px !important; } /* Match label width */
             .receipt-container span.mr-2 { margin-right: 8px !important; } /* Adjust colon spacing */

             /* Adjust ChecklistItem */
             .receipt-container .flex.items-center.mb-0 { margin-bottom: 0 !important; }
             .receipt-container .w-3.h-3.mr-1 { width: 9pt !important; height: 9pt !important; margin-right: 4px !important; }

             /* Adjust Header and Title Styling */
              .receipt-container .border-b-2.border-black { border-bottom-width: 2px !important; }
              .receipt-container .h-\\[2px\\].bg-red-600 { height: 1.5pt !important; background-color: red !important; }
              .receipt-container .w-1\\/3 { width: 33.33% !important; }
              .receipt-container .mx-auto { margin-left: auto; margin-right: auto; }

             /* Adjust Footer Box */
             .receipt-container .border.border-black.p-1\\.5 { border-width: 1px !important; padding: 1mm !important; background-color: #f3f4f6 !important; } /* Added background color */
             .receipt-container .text-\\[8pt\\] { font-size: 7pt !important; line-height: 1.1 !important; }

             /* Adjust Signature */
             .receipt-container .signature-space { height: 6mm !important; } /* Adjust space for signature */
             .receipt-container .receipt-signature { margin-top: 1mm !important; }
           }
           /* Screen styles for preview */
           @media screen {
               .print-container {
                   max-width: 1100px; /* Limit width on screen */
                   margin-left: auto;
                   margin-right: auto;
                   align-items: stretch; /* Ensure height consistency */
                   min-height: 216mm; /* Simulate approximate F4 height */
                   padding: 1rem; /* Add padding for screen view */
                   background-color: #f3f4f6; /* Light background for contrast */
               }
               .receipt-outer-wrapper {
                   flex: 1;
                   margin-bottom: 1rem;
                   background-color: white;
                   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
               }
               .receipt-container {
                   height: auto; /* Allow content to determine height on screen */
                   min-height: 200mm; /* Minimum height for better preview */
               }
           }
         `;


         try {
           const originalTitle = document.title;
           const printDoc = printWindow.document;

           printDoc.open();
           printDoc.write(`<!DOCTYPE html><html><head><title>Bukti Daftar Ulang - ${data?.namaPendaftar || daftarUlangId}</title><style>${styles}${printSpecificStyles}</style></head><body><div class="print-container">${printContent.innerHTML}</div></body></html>`);
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
           }, 500); // Delay to allow content rendering

         } catch (writeError) {
           console.error("Error writing to print window:", writeError);
           toast({ title: "Gagal Mempersiapkan Cetak", description: "Terjadi kesalahan saat menyiapkan halaman cetak.", variant: "destructive" });
           if (printWindow && !printWindow.closed) printWindow.close();
         }
      }, 50); // Added small delay
   };

    // Use authLoading state for the initial loading indicator
    if (authLoading || (loading && !error && !user && isClient)) { // Check isClient here
      return (
          <div className="flex justify-center items-center h-screen">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <span>Memuat data bukti daftar ulang...</span>
          </div>
      );
    }

    if (error) {
      return <div className="flex justify-center items-center h-screen text-red-600"><p>{error}</p></div>;
    }

    if (!data) {
      // This might happen briefly if user logs out, or if fetch failed silently
      return (
           <div className="flex justify-center items-center h-screen">
               <p>Data tidak tersedia atau Anda belum login.</p>
           </div>
      );
    }

    return (
      // Added min-h-screen and flex container for better screen view centering
      <div className="bg-gray-100 p-4 print:bg-white print:p-0 min-h-screen flex flex-col">
         <div className="mb-4 flex justify-between items-center no-print max-w-5xl mx-auto w-full"> {/* Ensure controls take full width */}
             <Button variant="outline" size="sm" onClick={() => router.back()}>
                 <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
             </Button>
             <Button onClick={handlePrint} size="sm" >
                 <Printer className="mr-2 h-4 w-4" /> Cetak Bukti (F4 Landscape)
             </Button>
         </div>
         {/* Apply max-width only for screen view, print styles override it */}
        <div ref={printRef} className="print-container flex-grow"> {/* Added flex-grow */}
          {/* Pass the fetched data (including namaPetugas) to the print component */}
          {/* Wrap each receipt in a div for flexbox control */}
           <div className="receipt-outer-wrapper">
               <BuktiDaftarUlangPrint data={data} />
           </div>
        </div>
      </div>
    );
};

// Component to handle authentication check before rendering content
const AuthCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname(); // Use usePathname hook
    const [isClient, setIsClient] = useState(false);

     useEffect(() => {
         setIsClient(true);
     }, []);

    useEffect(() => {
         if (!isClient || authLoading) return; // Don't run on server or while loading

        // Only redirect if not already on login page and auth check is complete and user is null
        if (!user && pathname !== '/login' && !pathname?.startsWith('/form-pendaftaran')) { // Allow access to form-pendaftaran
            console.log("AuthCheck: Not authenticated, redirecting to login.");
            // Store the intended redirect path *before* navigating
            const redirectPath = window.location.pathname + window.location.search;
            sessionStorage.setItem('redirectAfterLogin', redirectPath); // Use sessionStorage
            router.push('/login'); // Redirect to login
        }
    }, [authLoading, user, router, pathname, isClient]);

    // Show loading indicator until client-side mount and auth check complete
    if (!isClient || authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <span>Memeriksa autentikasi...</span>
            </div>
        );
    }

    // If not logged in and not loading, show minimal content while redirect happens (unless on allowed public page)
    if (!user && pathname !== '/login' && !pathname?.startsWith('/form-pendaftaran')) {
         return (
             <div className="flex justify-center items-center h-screen">
                 <p>Mengarahkan ke halaman login...</p>
             </div>
         );
    }

    // If authenticated and not loading, or on an allowed public page, render the page content
    return <>{children}</>;
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


