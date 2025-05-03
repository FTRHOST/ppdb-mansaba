
'use client';

import React, { useRef, useState, useEffect } from 'react'; // Explicitly import React
import Image from 'next/image';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

// Define the structure of the data needed for the form
export interface FormulirData {
  nomorPendaftaran?: string | null;
  nisn?: string | null;
  nama?: string | null;
  tempatTanggalLahir?: string | null;
  jenisKelamin?: 'Laki-laki' | 'Perempuan' | null;
  alamatLengkap?: string | null;
  desa?: string | null;
  kecamatan?: string | null;
  kabupaten?: string | null;
  provinsi?: string | null;
  dukuhJalan?: string | null;
  rt?: string | null;
  rw?: string | null;
  noHp?: string | null;
  tinggal?: string | null;
  jalurPendaftaran?: 'Reguler Umum' | 'Reguler Prestasi' | 'Reguler Sosial' | null;
  programPeminatan?: 'MIPA' | 'IPS' | 'BHS' | 'AGM' | 'Tahfidz' | null;
  namaAyah?: string | null;
  pendidikanAyah?: string | null;
  pekerjaanAyah?: string | null;
  noHpAyah?: string | null;
  namaIbu?: string | null;
  pendidikanIbu?: string | null;
  pekerjaanIbu?: string | null;
  noHpIbu?: string | null;
  alamatOrangtua?: string | null;
  namaWali?: string | null;
  hubunganWali?: string | null;
  pendidikanWali?: 'SD' | 'SMP' | 'SMA/SMK' | 'D1' | 'D2' | 'D3' | 'S1' | 'S2' | 'S3' | null | undefined;
  pekerjaanWali?: string | null;
  alamatWali?: string | null;
  noHpWali?: string | null;
  namaSekolahAsal?: string | null;
  alamatSekolahAsal?: string | null;
  rekomendasiPendaftaran?: string | null;
  punyaPiagam?: 'Punya' | 'Tidak Punya' | null;
  motivasi?: string | null;
  tanggalDaftar?: Date | null;
  tanggalCetak?: string | null;
}


// Helper component for rendering label-value pairs consistently
const DataRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
    value ? (
     <div className="flex">
       <span className="w-36 md:w-48 flex-shrink-0">{label}</span>
       <span className="mr-1">:</span>
       <span className="font-semibold break-words">{value || '-'}</span>
     </div>
   ) : null
 );

 const DataRowMultiCol: React.FC<{ items: { label: string; value?: string | null }[] }> = ({ items }) => (
   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
     {items.map((item, index) => (
        <DataRow key={index} label={item.label} value={item.value} />
     ))}
   </div>
 );

 const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="bg-green-700 text-white text-center font-bold py-1 my-2 text-sm">{title}</h3>
 );


export const FormulirPendaftaranPrint: React.FC<{ data: FormulirData }> = ({ data }) => {
   const printRef = useRef<HTMLDivElement>(null);
   const [letterheadUri, setLetterheadUri] = useState<string | null>(null);
   const [isClient, setIsClient] = useState(false);

   // Load letterhead from localStorage on client-side mount
   useEffect(() => {
       setIsClient(true);
       const storedUri = localStorage.getItem('customLetterheadUri');
       if (storedUri) {
           setLetterheadUri(storedUri);
       }
   }, []);

   // Avoid rendering header on the server or before client mount if custom uri is used
   const renderHeader = () => {
        if (!isClient && !letterheadUri) { // If SSR and no URI, render default
            return (
               <div className="text-center py-4">
                  <h2 className="text-sm font-bold">MA NU 01 BANYUPUTIH</h2>
                  <p className="text-[8pt]">Jl. Lapangan 9a Banyuputih Kec. Banyuputih Kab. Batang</p>
               </div>
            );
        }
        if (letterheadUri) {
           return (
              <Image
                 src={letterheadUri}
                 alt="Kop Surat MA NU 01 Banyuputih"
                 width={800} // Adjust width for A4 print maybe
                 height={120} // Adjust height
                 className="w-full h-auto object-contain mb-2" // Add margin bottom
                 priority
              />
           );
        }
        // Default Fallback if no custom URI and client-side
        return (
           <div className="flex justify-center items-center mb-1">
                {/* Default SVG Logo */}
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center mr-4 rounded-full overflow-hidden" data-ai-hint="school logo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-green-700">
                        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.522c0 .318.218.594.5.707A9.735 9.735 0 0 0 6 21a9.707 9.707 0 0 0 5.25-1.533v-1.42a.75.75 0 0 0-.657-.744A8.202 8.202 0 0 1 6 18a8.235 8.235 0 0 1-2.25-.37v-1.42a.75.75 0 0 1 .657-.744A8.21 8.21 0 0 0 6 15c2.086 0 3.981-.782 5.378-2.067a.75.75 0 0 0 1.122-.56v-1.42a.75.75 0 0 0-.5-.707 8.21 8.21 0 0 0-1.721-.486.75.75 0 0 0-.657.744v1.42h-.001c-1.431.925-3.312 1.483-5.323 1.483a8.235 8.235 0 0 1-2.25-.37V7.5a8.21 8.21 0 0 0 1.721-.486.75.75 0 0 1 .657.744v1.42c0 .274.11.523.294.706A8.21 8.21 0 0 0 6 10.5c2.086 0 3.981-.782 5.378-2.067a.75.75 0 0 1 1.122-.56v-1.42a.75.75 0 0 1 .5-.707c.157-.054.316-.1.477-.143a.75.75 0 0 0 .6-.89Z" />
                        <path d="M12.75 3a9.735 9.735 0 0 1 3.25.555.75.75 0 0 1 .5.707v14.522c0 .318-.218.594-.5.707A9.735 9.735 0 0 1 12.75 21a9.707 9.707 0 0 1-5.25-1.533v-1.42a.75.75 0 0 1 .657-.744 8.202 8.202 0 0 0 4.593-.345 8.235 8.235 0 0 0 2.25-.37v-1.42a.75.75 0 0 0-.657-.744 8.21 8.21 0 0 1-4.593-.345c-2.086 0-3.981.782-5.378 2.067a.75.75 0 0 1-1.122.56v1.42a.75.75 0 0 1 .5.707 8.21 8.21 0 0 1 1.721.486.75.75 0 0 1 .657.744v-1.42h.001c1.431-.925 3.312-1.483 5.323-1.483a8.235 8.235 0 0 0 2.25.37V13.5a8.21 8.21 0 0 1-1.721.486.75.75 0 0 0-.657.744v-1.42a.75.75 0 0 1-.294-.706 8.21 8.21 0 0 1-1.622-4.533c2.086 0 3.981.782 5.378 2.067a.75.75 0 0 0 1.122.56v1.42a.75.75 0 0 0 .5-.707c.157.054.316.1.477.143a.75.75 0 0 1 .6.89Z" />
                    </svg>
                </div>
                <div className="flex-grow">
                    <h1 className="text-sm font-bold">PANITIA PENDAFTARAN PESERTA DIDIK BARU</h1>
                    <h2 className="text-lg font-bold text-green-700">MA NU 01 BANYUPUTIH</h2>
                    <h3 className="text-sm font-bold">TAHUN PELAJARAN 2025/2026</h3>
                    <p className="text-xs">Jl. Lapangan 9a Banyuputih Kec. Banyuputih Kab. Batang</p>
                    <p className="text-xs">CP : 0852 1297 2762 * Email : manubanyuputih@gmail.com * Web : manubanyuputih.id</p>
                </div>
           </div>
        );
    };

   const formattedTanggalDaftar = data.tanggalDaftar
     ? format(data.tanggalDaftar, 'dd MMMM yyyy', { locale: localeId })
     : '...................';
   const tempatDaftar = data.kabupaten || 'Banyuputih';

   return (
     <div ref={printRef} className="bg-white p-4 max-w-4xl mx-auto border border-gray-300 text-xs print:border-none print:shadow-none print:p-0">
       {/* Header */}
       <div className="text-center mb-4 border-b-2 border-black pb-2">
           {renderHeader()}
       </div>
        <h3 className="font-bold text-center mb-2 underline text-sm">FORMULIR PENDAFTARAN PESERTA DIDIK BARU</h3>

       {/* Sections */}
       <SectionTitle title="IDENTITAS PESERTA DIDIK" />
       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-2">
         <DataRow label="No Pendaftaran" value={data.nomorPendaftaran} />
         <DataRow label="Jalur Daftar" value={data.jalurPendaftaran} />
         <DataRow label="NISN" value={data.nisn} />
         <DataRow label="Peminatan" value={data.programPeminatan} />
         <DataRow label="Nama Peserta Didik" value={data.nama?.toUpperCase()} />
         <div></div> {/* Spacer */}
         <DataRow label="Tempat & Tanggal Lahir" value={data.tempatTanggalLahir} />
         <div></div> {/* Spacer */}
         <DataRow label="Jenis Kelamin" value={data.jenisKelamin} />
         <div></div> {/* Spacer */}
         <div className="md:col-span-2"> {/* Alamat Tinggal Section */}
             <div className="flex">
                 <span className="w-36 md:w-48 flex-shrink-0">Alamat Tinggal</span>
                 <span className="mr-1">:</span>
                 <div className="flex-grow">
                     <div className="grid grid-cols-2 gap-x-4">
                         <DataRow label="Desa" value={data.desa} />
                         <DataRow label="Dukuh" value={data.dukuhJalan} />
                         <DataRow label="Kecamatan" value={data.kecamatan} />
                         <DataRow label="Rt. / Rw." value={data.rt && data.rw ? `${data.rt.padStart(3, '0')}/${data.rw.padStart(3, '0')}` : '-'} />
                         <DataRow label="Kabupaten" value={data.kabupaten} />
                         <div></div> {/* Spacer */}
                         <DataRow label="Provinsi" value={data.provinsi} />
                         <div></div> {/* Spacer */}
                         <DataRow label="No. HP" value={data.noHp} />
                     </div>
                 </div>
             </div>
         </div>
         <DataRow label="Keterangan Tinggal" value={data.tinggal} />
       </div>

       <SectionTitle title="IDENTITAS ORANGTUA / WALI" />
       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-2">
            {/* Ayah */}
            <div className="border-r md:border-gray-300 md:pr-4">
                <h4 className="font-bold mb-1 underline">Ayah</h4>
                <DataRow label="Nama" value={data.namaAyah?.toUpperCase()} />
                <DataRow label="Pendidikan" value={data.pendidikanAyah} />
                <DataRow label="Pekerjaan" value={data.pekerjaanAyah} />
                <DataRow label="No. HP" value={data.noHpAyah || data.noHp} />
                <DataRow label="Alamat" value={data.alamatOrangtua?.toUpperCase()} />
            </div>
            {/* Ibu */}
            <div className="mt-2 md:mt-0">
                 <h4 className="font-bold mb-1 underline">Ibu</h4>
                 <DataRow label="Nama" value={data.namaIbu?.toUpperCase()} />
                 <DataRow label="Pendidikan" value={data.pendidikanIbu} />
                 <DataRow label="Pekerjaan" value={data.pekerjaanIbu} />
                 <DataRow label="No. HP" value={data.noHpIbu || data.noHp} />
            </div>
        </div>
         {data.namaWali && (
             <div className="mt-2 pt-2 border-t border-gray-300">
                 <h4 className="font-bold mb-1 underline">Wali</h4>
                 <DataRow label="Nama" value={data.namaWali?.toUpperCase()} />
                 <DataRow label="Hubungan dgn Siswa" value={data.hubunganWali} />
                 <DataRow label="Alamat" value={data.alamatWali?.toUpperCase()} />
                 <DataRow label="No. HP" value={data.noHpWali} />
             </div>
         )}

       <SectionTitle title="IDENTITAS SEKOLAH ASAL" />
        <div className="mb-2">
            <DataRow label="Nama" value={data.namaSekolahAsal?.toUpperCase()} />
            <DataRow label="Alamat" value={data.alamatSekolahAsal?.toUpperCase()} />
            <DataRow label="Rekom" value={data.rekomendasiPendaftaran} />
        </div>

       <SectionTitle title="PIAGAM / SERTIFIKAT" />
        <div className="mb-2">
           <DataRow label="Punya / Tidak" value={data.punyaPiagam} />
           <DataRow label="Kejuaraan" value={data.punyaPiagam === 'Punya' ? '....................................' : '-'} />
        </div>

       <SectionTitle title="MOTIVASI DAFTAR DI MA NU BANYUPUTIH" />
        <div className="mb-4 min-h-[20px] pl-[calc(theme(space.36)+theme(space.1))] font-semibold">
            {data.motivasi || '-'}
        </div>

       <div className="grid grid-cols-3 gap-4 mt-6 text-center text-xs">
         <div>
           <p>Mengetahui,</p>
           <p>Panitia PPDB</p>
           <br />
           <br />
           <br />
           <p className="font-bold underline">( Saniyah, S.H. )</p>
         </div>
         <div>
           <p>Orang Tua / Wali</p>
           <br />
           <br />
           <br />
           <p className="font-bold underline">( {data.tinggal === 'Bersama Wali' ? data.namaWali?.toUpperCase() : data.namaAyah?.toUpperCase() || data.namaIbu?.toUpperCase() || '...........................'} )</p>
         </div>
         <div>
            <p>{tempatDaftar}, {formattedTanggalDaftar}</p>
           <p>Pendaftar</p>
           <br />
           <br />
           <br />
           <p className="font-bold underline">( {data.nama?.toUpperCase() || '...........................'} )</p>
         </div>
       </div>

        <hr className="border-t-2 border-black my-4" />
        <h3 className="font-bold text-center mb-2 text-sm">BUKTI DAFTAR</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-2">
            <DataRow label="No. Pendaftaran" value={data.nomorPendaftaran} />
            <DataRow label="Jalur" value={data.jalurPendaftaran} />
            <DataRow label="Nama" value={data.nama?.toUpperCase()} />
            <DataRow label="Peminatan" value={data.programPeminatan} />
            <DataRow label="Alamat" value={data.alamatLengkap} />
            <div></div> {/* Spacer */}
            <DataRow label="Asal Sekolah" value={data.namaSekolahAsal?.toUpperCase()} />
        </div>
        <div className="mt-4 text-xs">
           <p>Dimohon untuk segera melakukan daftar ulang dengan mengumpulkan :</p>
           <ul className="list-disc list-inside ml-4">
              <li>KK (Asli)</li>
              <li>Surat Kelulusan (jika sudah ada)</li>
              <li>Fotocopi KK dan Akte Lahir</li>
              <li>Membayar biaya Daftar Ulang</li>
              <li>SKTM dan Rekomendasi PR NU Desa</li>
           </ul>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 text-center text-xs">
            <div></div>
             <div>
                 <p>{tempatDaftar}, {formattedTanggalDaftar}</p>
                 <p>Panitia,</p>
                 <br />
                 <br />
                 <br />
                 <p className="font-bold underline">( Saniyah, S.H. )</p>
             </div>
        </div>
     </div>
   );
 };
