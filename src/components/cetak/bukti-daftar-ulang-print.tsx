'use client';

import React from 'react';
import Image from 'next/image'; // Placeholder, assuming logo might be used later
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { CheckSquare, Square } from 'lucide-react'; // Icons for checklist

// Define the structure of the data needed for the proof
export interface BuktiDaftarUlangData {
  nomorPendaftaran: string;
  namaPendaftar: string;
  asalSekolah: string;
  alamat: string; // Student's full address
  nomorDaftarUlang: string;
  kelengkapanKK: boolean; // From daftar ulang form
  kelengkapanSKL: boolean; // From daftar ulang form
  kelengkapanPiagam: boolean; // From daftar ulang form
  kelengkapanSKTM: boolean; // From daftar ulang form
  bayarDaftarUlang: boolean; // From daftar ulang form
  biayaDaftarUlang?: number | null; // From daftar ulang form
  tanggalDaftarUlang: string; // Format: YYYY-MM-DD or a Date object
  kabupatenTempat?: string | null; // For signature location
}

// Helper component for rendering label-value pairs consistently
const DataRow: React.FC<{ label: string; value?: string | null; boldValue?: boolean }> = ({ label, value, boldValue }) => (
  value ? (
   <div className="flex mb-1">
     <span className="w-36 flex-shrink-0">{label}</span>
     <span className="mr-1">:</span>
     <span className={cn("break-words", boldValue ? 'font-semibold' : '')}>{value || '-'}</span>
   </div>
 ) : null
);

// Helper component for checklist items
const ChecklistItem: React.FC<{ checked: boolean; label: string }> = ({ checked, label }) => (
    <div className="flex items-center mb-1">
        {checked ? <CheckSquare className="w-4 h-4 mr-2 text-black" /> : <Square className="w-4 h-4 mr-2 text-gray-400" />}
        <span>{label}</span>
    </div>
);

// Helper function to format currency
const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined || value <= 0) {
        return '-';
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

import { cn } from '@/lib/utils'; // Import cn if not already imported

export const BuktiDaftarUlangPrint: React.FC<{ data: BuktiDaftarUlangData }> = ({ data }) => {
   // Format tanggal daftar ulang if available
   const formattedTanggal = data.tanggalDaftarUlang
     ? format(new Date(data.tanggalDaftarUlang), 'dd MMMM yyyy', { locale: localeId })
     : '...................'; // Placeholder if date is missing
   const tempatDaftar = data.kabupatenTempat || 'Banyuputih'; // Use kabupaten or default

   return (
     <div className="bg-white p-4 max-w-2xl mx-auto border border-black text-xs print:border-none print:shadow-none print:p-0 font-sans">
       {/* Header */}
       <div className="text-center mb-4 border-b-2 border-black pb-2">
           <div className="flex justify-center items-center mb-1">
                {/* Placeholder for logo */}
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center mr-4 rounded-full overflow-hidden" data-ai-hint="school logo">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-green-700">
                        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.522c0 .318.218.594.5.707A9.735 9.735 0 0 0 6 21a9.707 9.707 0 0 0 5.25-1.533v-1.42a.75.75 0 0 0-.657-.744A8.202 8.202 0 0 1 6 18a8.235 8.235 0 0 1-2.25-.37v-1.42a.75.75 0 0 1 .657-.744A8.21 8.21 0 0 0 6 15c2.086 0 3.981-.782 5.378-2.067a.75.75 0 0 0 1.122-.56v-1.42a.75.75 0 0 0-.5-.707 8.21 8.21 0 0 0-1.721-.486.75.75 0 0 0-.657.744v1.42h-.001c-1.431.925-3.312 1.483-5.323 1.483a8.235 8.235 0 0 1-2.25-.37V7.5a8.21 8.21 0 0 0 1.721-.486.75.75 0 0 1 .657.744v1.42c0 .274.11.523.294.706A8.21 8.21 0 0 0 6 10.5c2.086 0 3.981-.782 5.378-2.067a.75.75 0 0 1 1.122-.56v-1.42a.75.75 0 0 1 .5-.707c.157-.054.316-.1.477-.143a.75.75 0 0 0 .6-.89Z" />
                        <path d="M12.75 3a9.735 9.735 0 0 1 3.25.555.75.75 0 0 1 .5.707v14.522c0 .318-.218.594-.5.707A9.735 9.735 0 0 1 12.75 21a9.707 9.707 0 0 1-5.25-1.533v-1.42a.75.75 0 0 1 .657-.744 8.202 8.202 0 0 0 4.593-.345 8.235 8.235 0 0 0 2.25-.37v-1.42a.75.75 0 0 0-.657-.744 8.21 8.21 0 0 1-4.593-.345c-2.086 0-3.981.782-5.378 2.067a.75.75 0 0 1-1.122.56v1.42a.75.75 0 0 1 .5.707 8.21 8.21 0 0 1 1.721.486.75.75 0 0 1 .657-.744v-1.42h.001c1.431-.925 3.312-1.483 5.323-1.483a8.235 8.235 0 0 0 2.25.37V13.5a8.21 8.21 0 0 1-1.721.486.75.75 0 0 0-.657.744v-1.42a.75.75 0 0 1-.294-.706 8.21 8.21 0 0 1-1.622-4.533c2.086 0 3.981.782 5.378 2.067a.75.75 0 0 0 1.122.56v1.42a.75.75 0 0 0 .5-.707c.157.054.316.1.477-.143a.75.75 0 0 1 .6.89Z" />
                    </svg>
                </div>
                <div className="flex-grow">
                    <h1 className="text-sm font-bold">PANITIA</h1>
                    <h2 className="text-base font-bold text-green-700">PENDAFTARAN PESERTA DIDIK BARU</h2>
                    <h2 className="text-lg font-bold text-green-700">MA NU 01 BANYUPUTIH</h2>
                    <h3 className="text-sm font-bold">TAHUN PELAJARAN 2025/2026</h3>
                </div>
           </div>
       </div>
       <h3 className="font-bold text-center mb-4 underline text-sm">BUKTI DAFTAR ULANG</h3>

       {/* Identitas Pendaftar */}
       <div className="mb-4">
            <DataRow label="Nomor Pendaftaran" value={data.nomorPendaftaran} boldValue/>
            <DataRow label="Nama Pendaftar" value={data.namaPendaftar?.toUpperCase()} boldValue/>
            <DataRow label="Asal Sekolah" value={data.asalSekolah?.toUpperCase()} />
            <DataRow label="Alamat" value={data.alamat} />
       </div>

       <hr className="border-dashed border-gray-400 my-3" />

       {/* Detail Daftar Ulang */}
       <div className="mb-4">
           <DataRow label="No. Daftar Ulang" value={data.nomorDaftarUlang} boldValue/>
           <p className="mb-1">Berkas yang diserahkan:</p>
           <div className="ml-4 grid grid-cols-1 sm:grid-cols-2">
              <div>
                <ChecklistItem checked={data.kelengkapanKK} label="KK/Akte (asli)" />
                <ChecklistItem checked={data.kelengkapanSKL} label="Surat Kelulusan (asli)" />
              </div>
              <div>
                 {/* Assuming Fotocopi KK/Akte is always required or covered by KK Asli */}
                 <ChecklistItem checked={true} label="Fotocopi KK/Akte" />
                 <ChecklistItem checked={data.kelengkapanPiagam} label="Fotocopi Piagam / Sertifikat Juara" />
              </div>
              <div>
                 <ChecklistItem checked={data.kelengkapanSKTM} label="SKTM / Surat Rekom PRNU" />
              </div>
           </div>
           <div className="mt-2 flex items-center">
                <ChecklistItem checked={data.bayarDaftarUlang} label="Daftar Ulang" />
                 {data.bayarDaftarUlang && (
                    <span className="ml-4 bg-black text-white font-semibold px-2 py-0.5 rounded text-xs">
                         {formatCurrency(data.biayaDaftarUlang)}
                    </span>
                 )}
           </div>
       </div>

       {/* Footer Box */}
       <div className="border border-black p-2 text-center my-4 text-xs">
           Selamat bergabung di Madrasah Hebat, MA NU 01 Banyuputih.<br/>
           Info keberangkatan pertama akan di informasikan di grup Whatsapp Siswa Baru 2025
       </div>


       {/* Signature */}
       <div className="flex justify-end mt-6">
           <div className="text-center text-xs">
               <p>{tempatDaftar}, {formattedTanggal}</p>
               <p>Panitia PPDB</p>
               <br />
               <br />
               <br />
               <p className="font-bold underline">( Saniyah, S.H. )</p> {/* Hardcoded name */}
           </div>
       </div>

     </div>
   );
 }