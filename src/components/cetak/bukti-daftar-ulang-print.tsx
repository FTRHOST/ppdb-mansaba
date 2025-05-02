
'use client';

import React from 'react';
import Image from 'next/image'; // Placeholder, assuming logo might be used later
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { CheckSquare, Square } from 'lucide-react'; // Icons for checklist
import { cn } from '@/lib/utils'; // Import cn utility

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
   // Reduced bottom margin for tighter layout
   <div className="flex mb-0_5 text-xs print:text-[8pt] print:leading-tight print:mb-0_5"> {/* Added print specific margin */}
     {/* Adjusted width for label, slightly increased */}
     <span className="w-[70px] flex-shrink-0 print:w-[70px]">{label}</span>
     <span className="mr-1 print:mr-1">:</span>
     <span className={cn("break-words", boldValue ? 'font-semibold print:font-semibold' : '')}>{value || '-'}</span>
   </div>
 ) : null
);

// Helper component for checklist items
const ChecklistItem: React.FC<{ checked: boolean; label: string }> = ({ checked, label }) => (
    // Reduced bottom margin and icon size
    <div className="flex items-center mb-0_5 text-xs print:text-[8pt] print:leading-tight print:mb-0_5">
        {checked ? <CheckSquare className="w-3 h-3 mr-1 text-black print:w-3 print:h-3 print:mr-1" /> : <Square className="w-3 h-3 mr-1 text-gray-400 print:w-3 print:h-3 print:mr-1" />}
        <span>{label}</span>
    </div>
);

// Helper function to format currency
const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined || value <= 0) {
        return '-';
    }
    // Updated format to match image "Rp 400.000"
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};


// Reusable Receipt Component
const Receipt: React.FC<{ data: BuktiDaftarUlangData; isArsip?: boolean }> = ({ data, isArsip = false }) => {
     // Format tanggal daftar ulang if available
    const formattedTanggal = data.tanggalDaftarUlang
      ? format(new Date(data.tanggalDaftarUlang), 'dd MMMM yyyy', { locale: localeId })
      : '...................'; // Placeholder if date is missing
    const tempatDaftar = data.kabupatenTempat || 'Banyuputih'; // Use kabupaten or default

    return (
      // Adjusted padding, added max-w-none for print to take flex size
      <div className={cn("receipt-container bg-white p-2 max-w-full print:max-w-none print:p-2 mx-auto border border-black text-xs font-sans break-inside-avoid print:text-xs", isArsip ? "border-t-4 border-t-red-600" : "")}>
        {/* Header - Adjusted margins and sizes for print */}
        <div className="text-center mb-1 border-b-2 border-black pb-0.5 print:mb-1 print:pb-0.5">
           <div className="flex justify-center items-center mb-1 print:mb-0.5">
                {/* Placeholder for logo - Adjusted sizes */}
                <div className="w-8 h-8 bg-gray-200 flex items-center justify-center mr-1 rounded-full overflow-hidden flex-shrink-0 print:w-8 print:h-8 print:mr-1" data-ai-hint="school logo">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-700 print:w-5 print:h-5"> {/* Adjusted icon size */}
                        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.522c0 .318.218.594.5.707A9.735 9.735 0 0 0 6 21a9.707 9.707 0 0 0 5.25-1.533v-1.42a.75.75 0 0 0-.657-.744A8.202 8.202 0 0 1 6 18a8.235 8.235 0 0 1-2.25-.37v-1.42a.75.75 0 0 1 .657-.744A8.21 8.21 0 0 0 6 15c2.086 0 3.981-.782 5.378-2.067a.75.75 0 0 0 1.122-.56v-1.42a.75.75 0 0 0-.5-.707 8.21 8.21 0 0 0-1.721-.486.75.75 0 0 0-.657.744v1.42h-.001c-1.431.925-3.312 1.483-5.323 1.483a8.235 8.235 0 0 1-2.25-.37V7.5a8.21 8.21 0 0 0 1.721-.486.75.75 0 0 1 .657.744v1.42c0 .274.11.523.294.706A8.21 8.21 0 0 0 6 10.5c2.086 0 3.981-.782 5.378-2.067a.75.75 0 0 1 1.122-.56v-1.42a.75.75 0 0 1 .5-.707c.157-.054.316-.1.477-.143a.75.75 0 0 0 .6-.89Z" />
                        <path d="M12.75 3a9.735 9.735 0 0 1 3.25.555.75.75 0 0 1 .5.707v14.522c0 .318-.218.594-.5.707A9.735 9.735 0 0 1 12.75 21a9.707 9.707 0 0 1-5.25-1.533v-1.42a.75.75 0 0 1 .657-.744 8.202 8.202 0 0 0 4.593-.345 8.235 8.235 0 0 0 2.25-.37v-1.42a.75.75 0 0 0-.657-.744 8.21 8.21 0 0 1-4.593-.345c-2.086 0-3.981.782-5.378 2.067a.75.75 0 0 1-1.122.56v1.42a.75.75 0 0 1 .5.707 8.21 8.21 0 0 1 1.721.486.75.75 0 0 1 .657-.744v-1.42h.001c1.431-.925 3.312 1.483 5.323-1.483a8.235 8.235 0 0 0 2.25.37V13.5a8.21 8.21 0 0 1-1.721.486.75.75 0 0 0-.657.744v-1.42a.75.75 0 0 1-.294-.706 8.21 8.21 0 0 1-1.622-4.533c2.086 0 3.981.782 5.378 2.067a.75.75 0 0 0 1.122.56v1.42a.75.75 0 0 0 .5-.707c.157.054.316.1.477.143a.75.75 0 0 1 .6.89Z" />
                    </svg>
                </div>
                {/* Adjusted font sizes for better fit */}
                <div className="flex-grow print:text-[8pt] print:leading-tight">
                    <h1 className="text-[9px] font-bold print:text-[8pt]">PANITIA</h1>
                    <h2 className="text-xs font-bold text-green-700 print:text-[9pt]">PENDAFTARAN PESERTA DIDIK BARU</h2>
                    <h2 className="text-sm font-bold text-green-700 print:text-[10pt]">MA NU 01 BANYUPUTIH</h2>
                    <h3 className="text-[9px] font-bold print:text-[8pt]">TAHUN PELAJARAN 2025/2026</h3>
                </div>
           </div>
        </div>
         {isArsip && <p className="text-center text-xs font-semibold text-red-600 mb-1 print:text-[8pt] print:mb-0.5">Untuk Panitia</p>}
        <h3 className="font-bold text-center mb-1 underline text-sm print:text-[10pt] print:mb-1">BUKTI DAFTAR ULANG</h3>

        {/* Identitas Pendaftar - Adjusted margin */}
        <div className="mb-1 print:mb-1">
             <DataRow label="Nomor Pendaftaran" value={data.nomorPendaftaran} boldValue/>
             <DataRow label="Nama Pendaftar" value={data.namaPendaftar?.toUpperCase()} boldValue/>
             <DataRow label="Asal Sekolah" value={data.asalSekolah?.toUpperCase()} />
             <DataRow label="Alamat" value={data.alamat} />
        </div>

        <hr className="border-dashed border-gray-400 my-1 print:my-0.5" />

        {/* Detail Daftar Ulang - Adjusted margin and checklist layout */}
        <div className="mb-1 print:mb-1">
            <DataRow label="No. Daftar Ulang" value={data.nomorDaftarUlang} boldValue/>
            <p className="mb-0.5 text-xs font-medium print:text-[8pt] print:mb-0.5">Berkas yang diserahkan:</p>
            {/* Ensure checklist items don't wrap unnecessarily */}
            <div className="ml-1 grid grid-cols-1 gap-y-0 print:ml-1 print:gap-y-0">
                 <ChecklistItem checked={data.kelengkapanKK} label="KK/Akte (asli)" />
                 <ChecklistItem checked={data.kelengkapanSKL} label="Surat Kelulusan (asli)" />
                 <ChecklistItem checked={true} label="Fotocopi KK/Akte" />
                 <ChecklistItem checked={data.kelengkapanPiagam} label="Fotocopi Piagam / Sertifikat Juara" />
                 <ChecklistItem checked={data.kelengkapanSKTM} label="SKTM / Surat Rekom PRNU" />
            </div>
            <div className="mt-0.5 flex items-center print:mt-0.5">
                 <ChecklistItem checked={data.bayarDaftarUlang} label="Daftar Ulang" />
                  {data.bayarDaftarUlang && (
                     <span className="ml-1 bg-black text-white font-semibold px-1 py-0 rounded text-[9px] print:text-[7pt] print:ml-1 print:px-1 print:py-0">
                          {formatCurrency(data.biayaDaftarUlang)}
                     </span>
                  )}
            </div>
        </div>

        {/* Footer Box - Adjusted size, padding, margin, font size */}
        <div className={cn("border border-black p-1 text-center my-1 text-[8px] leading-tight print:text-[7pt] print:my-1 print:p-1", isArsip ? "min-h-[30px]" : "")}>
            {!isArsip && (
                <>
                    Selamat bergabung di Madrasah Hebat, MA NU 01 Banyuputih.<br/>
                    Info keberangkatan pertama akan di informasikan di grup Whatsapp Siswa Baru 2025
                </>
            )}
            {isArsip && <>&nbsp;</>} {/* Empty box for arsip */}
        </div>


        {/* Signature - Adjusted margin, size */}
        <div className="flex justify-end mt-1 print:mt-1">
            <div className="text-center text-xs print:text-[8pt]">
                <p>{tempatDaftar}, {formattedTanggal}</p>
                <p>Panitia PPDB</p>
                <div className="h-5 print:h-4"></div> {/* Reduced space for signature */}
                <p className="font-bold underline print:font-bold">( Saniyah, S.H. )</p>
            </div>
        </div>

      </div>
    );
}


// Main Print Component combining two Receipts
export const BuktiDaftarUlangPrint: React.FC<{ data: BuktiDaftarUlangData }> = ({ data }) => {
   return (
      // Use flex layout for side-by-side printing
      <div className="print-container flex flex-col md:flex-row gap-4 print:flex-row print:gap-4">
         {/* Copy 1: For Student */}
         <Receipt data={data} />

         {/* Separator is now handled by the container gap in print styles */}

         {/* Copy 2: For Arsip */}
         <Receipt data={data} isArsip={true} />
      </div>
   );
 };
