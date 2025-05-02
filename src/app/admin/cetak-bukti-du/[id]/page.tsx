
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { BuktiDaftarUlangPrint, type BuktiDaftarUlangData } from '@/components/cetak/bukti-daftar-ulang-print'; // Import the specific print component
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

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

const CetakBuktiDUPage = () => {
  const params = useParams();
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [daftarUlangId]);

 const handlePrint = () => {
   console.log('Handle Print button clicked.');
   const printContent = printRef.current;
   if (printContent) {
       console.log('Print content found, proceeding with print logic.');
      const originalTitle = document.title;
       document.title = `Bukti Daftar Ulang - ${data?.namaPendaftar || daftarUlangId}`; // Set title
       console.log('Document title set to:', document.title);

      const styles = Array.from(document.styleSheets)
         .map(styleSheet => {
           try {
             return Array.from(styleSheet.cssRules)
               .map(rule => rule.cssText)
               .join('');
           } catch (e) {
             console.warn('Could not read CSS rules from stylesheet:', styleSheet.href, e);
             return '';
           }
         })
         .join('\n');
       console.log('Collected styles for print window.');

      const printWindow = window.open('', '', 'height=600,width=800'); // Use landscape-like size
      if (printWindow) {
          console.log('Print window opened successfully.');
         printWindow.document.write('<html><head><title>');
         printWindow.document.write(document.title);
         printWindow.document.write('</title>');
         printWindow.document.write('<style>');
         printWindow.document.write(styles);
          // Add print-specific styles
          printWindow.document.write(`
            @media print {
              @page { size: A4 landscape; margin: 5mm; } /* Reduced margin */
              body {
                 -webkit-print-color-adjust: exact;
                 print-color-adjust: exact;
                 font-family: 'Times New Roman', Times, serif; /* Use a common serif font */
                 font-size: 9pt; /* Smaller base font size */
                 line-height: 1.1; /* Tighter line height */
                 margin: 0;
                 padding: 0;
              }
              .no-print { display: none !important; }
              .print-container {
                 width: 100%;
                 max-width: 100%; /* Use full width */
                 margin: 0;
                 padding: 0;
                 border: none;
                 box-shadow: none;
                 display: flex;
                 justify-content: space-between; /* Space out receipts */
                 align-items: flex-start;
                 gap: 5mm; /* Reduced gap */
              }
              .receipt-container {
                 flex: 1;
                 max-width: calc(50% - 2.5mm); /* Adjust width considering gap */
                 border: 1px solid black;
                 padding: 2mm; /* Reduced padding */
                 box-sizing: border-box;
                 height: auto; /* Let height adjust */
                 overflow: hidden;
              }

              /* Override Tailwind/Component styles for print */
              .receipt-container .text-xs { font-size: 8pt !important; line-height: 1.1 !important; }
              .receipt-container .text-sm { font-size: 9pt !important; line-height: 1.1 !important; }
              .receipt-container .text-base { font-size: 10pt !important; line-height: 1.1 !important; }
              .receipt-container .font-bold { font-weight: bold !important; }
              .receipt-container .font-semibold { font-weight: 600 !important; }
              .receipt-container .font-medium { font-weight: 500 !important; }
              .receipt-container .mb-0_5 { margin-bottom: 0.5mm !important; }
              .receipt-container .mb-1 { margin-bottom: 1mm !important; }
              .receipt-container .mb-2 { margin-bottom: 2mm !important; }
              .receipt-container .mt-1 { margin-top: 1mm !important; }
              .receipt-container .mt-2 { margin-top: 2mm !important; }
              .receipt-container .my-1 { margin-top: 1mm !important; margin-bottom: 1mm !important; }
              .receipt-container .my-2 { margin-top: 2mm !important; margin-bottom: 2mm !important; }
              .receipt-container .pb-1 { padding-bottom: 1mm !important; }
              .receipt-container .p-1 { padding: 1mm !important; }
              .receipt-container .p-2 { padding: 2mm !important; }
              .receipt-container .ml-2 { margin-left: 2mm !important; }
              .receipt-container .mr-1 { margin-right: 1mm !important; }
              .receipt-container .px-1 { padding-left: 1mm !important; padding-right: 1mm !important; }
              .receipt-container .py-0_5 { padding-top: 0.5mm !important; padding-bottom: 0.5mm !important; }
              .receipt-container .w-10 { width: 25pt !important; } /* Adjust logo size */
              .receipt-container .h-10 { height: 25pt !important; }
              .receipt-container .w-8 { width: 20pt !important; }
              .receipt-container .h-8 { height: 20pt !important; }
              .receipt-container .w-6 { width: 15pt !important; }
              .receipt-container .h-6 { height: 15pt !important; }
              .receipt-container .w-5 { width: 12pt !important; }
              .receipt-container .h-5 { height: 12pt !important; }
              .receipt-container .w-2_5 { width: 7pt !important; } /* Adjust icon size */
              .receipt-container .h-2_5 { height: 7pt !important; }
              .receipt-container .w-2 { width: 5pt !important; }
              .receipt-container .h-2 { height: 5pt !important; }
              .receipt-container .w-24 { width: 60pt !important; } /* Adjust label width */
              .receipt-container .w-20 { width: 50pt !important; }
              .receipt-container .text-\[9px\] { font-size: 7pt !important; } /* Adjust specific font sizes */
              .receipt-container .text-\[10pt\] { font-size: 10pt !important; }
              .receipt-container .text-\[8pt\] { font-size: 8pt !important; }
              .receipt-container .text-\[7pt\] { font-size: 7pt !important; }


              /* Ensure break-inside-avoid works if needed */
              .break-inside-avoid { break-inside: avoid; }
            }
          `);
         printWindow.document.write('</style>');
         printWindow.document.write('</head><body>');
         // Use the modified print-container structure from bukti-daftar-ulang-print
         printWindow.document.write(printContent.innerHTML);
         printWindow.document.write('</body></html>');
         printWindow.document.close();
         printWindow.focus();

         // Delay print command slightly
          setTimeout(() => {
            console.log('Executing print command.');
            printWindow.print();
            console.log('Closing print window.');
            printWindow.close();
          }, 250);

         console.log('Restoring original document title.');
         document.title = originalTitle; // Restore original title
      } else {
        console.error('Failed to open print window. Pop-up might be blocked.');
        alert('Gagal membuka jendela cetak. Mohon izinkan pop-up untuk situs ini.');
      }
   } else {
       console.error('Print content ref is null.');
   }
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
       {/* Button is hidden in print view */}
       <div className="mb-4 text-center no-print">
         <Button onClick={handlePrint} >
           <Printer className="mr-2 h-4 w-4" /> Cetak Bukti (Landscape)
         </Button>
       </div>
      {/* This div is what gets printed */}
      <div ref={printRef}>
        {/* The BuktiDaftarUlangPrint component now handles the flex layout for print */}
        <BuktiDaftarUlangPrint data={data} />
      </div>
    </div>
  );
};

export default CetakBuktiDUPage;
