
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

          // Removed automatic print trigger
          // setTimeout(() => {
          //    handlePrint();
          // }, 100);

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

      const printWindow = window.open('', '', 'height=800,width=600'); // Adjust size as needed
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
              @page { size: A5 landscape; margin: 10mm; } /* Example: A5 Landscape */
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: sans-serif; }
              .no-print { display: none !important; }
              .print-container {
                 width: 100%;
                 max-width: 100%;
                 margin: 0;
                 padding: 0;
                 border: none;
                 box-shadow: none;
              }
              /* Add other specific styles for Bukti DU */
              .font-sans { font-family: sans-serif !important; }
              .text-xs { font-size: 10pt !important; line-height: 1.4 !important; }
              .text-sm { font-size: 11pt !important; line-height: 1.4 !important; }
              .text-base { font-size: 12pt !important; line-height: 1.4 !important; }
              .text-lg { font-size: 14pt !important; line-height: 1.4 !important; }
              .mb-1 { margin-bottom: 0.2rem !important; }
              .mb-2 { margin-bottom: 0.4rem !important; }
              .mb-4 { margin-bottom: 0.8rem !important; }
              .my-3 { margin-top: 0.6rem !important; margin-bottom: 0.6rem !important; }
              .my-4 { margin-top: 0.8rem !important; margin-bottom: 0.8rem !important; }
              .mt-6 { margin-top: 1.2rem !important; }
              .pb-2 { padding-bottom: 0.4rem !important; }
            }
          `);
         printWindow.document.write('</style>');
         printWindow.document.write('</head><body>');
         printWindow.document.write('<div class="print-container">'); // Wrap content
         printWindow.document.write(printContent.innerHTML);
         printWindow.document.write('</div>');
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
    <div className="bg-gray-100 p-4 print:bg-white">
       {/* Button is hidden in print view */}
       <div className="mb-4 text-center no-print">
         <Button onClick={handlePrint} >
           <Printer className="mr-2 h-4 w-4" /> Cetak Ulang Bukti
         </Button>
       </div>
      {/* This div is what gets printed */}
      <div ref={printRef} className="print-container">
        <BuktiDaftarUlangPrint data={data} />
      </div>
    </div>
  );
};

export default CetakBuktiDUPage;
