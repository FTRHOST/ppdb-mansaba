'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { FormulirPendaftaranPrint, type FormulirData } from '@/components/cetak/formulir-pendaftaran-print'; // Use the specific print component
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

// Mock data structure - Ensure this matches the data needed by FormulirPendaftaranPrint
interface PendaftarLengkap extends FormulirData {
  id: number;
}

// Mock data - replace with actual data fetching logic based on ID
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
     namaWali: '', // Empty if not applicable
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
     tanggalDaftar: new Date() // Add registration date
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
     tempatTanggalLahir: 'Batang, 19 Mei 2010', // Example TTL from image
     jenisKelamin: 'Perempuan',
     alamatLengkap: 'Kebumen Rt. 010/003 Kec. Tersono Kab. Batang',
     desa: 'Kebumen',
     kecamatan: 'Tersono',
     kabupaten: 'Batang',
     provinsi: 'Jawa Tengah',
     dukuhJalan: 'Karangjati', // Added Dukuh from image data
     rt: '10',
     rw: '03',
     noHp: '081567987147',
     tinggal: 'Bersama Orang tua',
     jalurPendaftaran: 'Reguler Sosial',
     programPeminatan: 'IPS',
     namaAyah: 'Muji Teguh',
     pendidikanAyah: 'SD', // Simplified from SD/MI Sederajat
     pekerjaanAyah: 'PETANI',
     noHpAyah: '081567987147', // Used main HP as example
     namaIbu: 'Ngatirah',
     pendidikanIbu: 'SD', // Simplified from SD/MI Sederajat
     pekerjaanIbu: 'IRT', // Ibu Rumah Tangga
     noHpIbu: '081567987147', // Used main HP as example
     alamatOrangtua: 'KARANGJATI, KEBUMEN, TERSONO, BATANG',
     namaWali: 'MUJI TEGUH', // Data Wali from image, relationship 'AYAH'
     hubunganWali: 'AYAH',
     pendidikanWali: 'SD',
     pekerjaanWali: 'PETANI',
     alamatWali: 'KARANGJATI, KEBUMEN, TERSONO, BATANG',
     noHpWali: '081567987147',
     namaSekolahAsal: 'MTS NURUSSALAM TERSONO',
     alamatSekolahAsal: 'TERSONO',
     rekomendasiPendaftaran: 'Ahmad Mashfufi', // Example Rekom
     punyaPiagam: 'Punya',
     motivasi: 'TOLABUL ILMI',
     tanggalDaftar: new Date('2025-04-26') // Date from image
   },
 ];

const CetakFormulirPage = () => {
  const params = useParams();
  const pendaftarId = params?.id ? parseInt(params.id as string, 10) : null;
  const [data, setData] = useState<PendaftarLengkap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!pendaftarId) {
        setError('ID Pendaftar tidak valid.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call to fetch data by ID
        console.log(`Fetching data for ID: ${pendaftarId}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        const foundData = mockFullData.find(item => item.id === pendaftarId);

        if (foundData) {
          // Add current date as tanggalCetak
          const dataWithPrintDate: FormulirData = {
              ...foundData,
              tanggalCetak: format(new Date(), 'dd MMMM yyyy', { locale: localeId })
          };
          setData(dataWithPrintDate as PendaftarLengkap);

          // Automatically trigger print dialog after data loads
          setTimeout(() => {
             handlePrint();
          }, 100); // Short delay to ensure rendering

        } else {
          setError(`Data pendaftar dengan ID ${pendaftarId} tidak ditemukan.`);
        }
      } catch (err) {
        console.error('Error fetching pendaftar data:', err);
        setError('Gagal memuat data pendaftar.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pendaftarId]);

 const handlePrint = () => {
   const printContent = printRef.current;
   if (printContent) {
      const originalTitle = document.title;
      document.title = `Formulir Pendaftaran - ${data?.nama || pendaftarId}`; // Set title for print window

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

      const printWindow = window.open('', '', 'height=800,width=800');
      if (printWindow) {
         printWindow.document.write('<html><head><title>');
         printWindow.document.write(document.title);
         printWindow.document.write('</title>');
          // Inject Tailwind/Global styles and specific print styles
         printWindow.document.write('<style>');
         printWindow.document.write(styles);
          // Add print-specific styles from the component if needed, or directly here
          printWindow.document.write(`
            @media print {
              @page { size: A4; margin: 15mm; } /* Adjust margins as needed */
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none !important; }
              /* Add other print specific styles here */
               .print-container { /* Ensure container takes full width */
                 width: 100%;
                 max-width: 100%;
                 margin: 0;
                 padding: 0;
                 border: none;
                 box-shadow: none;
              }
            }
          `);
         printWindow.document.write('</style>');
         printWindow.document.write('</head><body>');
         printWindow.document.write(printContent.innerHTML);
         printWindow.document.write('</body></html>');
         printWindow.document.close();
         printWindow.focus();

         // Delay print command slightly to ensure content is loaded
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);

         document.title = originalTitle; // Restore original title
      } else {
        alert('Gagal membuka jendela cetak. Mohon izinkan pop-up untuk situs ini.');
      }
   }
 };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Memuat data formulir...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600"><p>{error}</p></div>;
  }

  if (!data) {
    return <div className="flex justify-center items-center h-screen"><p>Data tidak tersedia.</p></div>;
  }

  return (
    <div className="bg-gray-100 p-4 print:bg-white">
       {/* Button is hidden in print view using 'no-print' class */}
       <div className="mb-4 text-center no-print">
         <Button onClick={handlePrint} >
           <Printer className="mr-2 h-4 w-4" /> Cetak Ulang Formulir
         </Button>
       </div>
      {/* This div is what gets printed */}
      <div ref={printRef} className="print-container">
        <FormulirPendaftaranPrint data={data} />
      </div>
    </div>
  );
};

export default CetakFormulirPage;
