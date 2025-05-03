
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
  namaPetugas?: string | null; // Name of the logged-in staff/admin printing the receipt
}

// Helper component for rendering label-value pairs consistently
const DataRow: React.FC<{ label: string; value?: string | null; boldValue?: boolean }> = ({ label, value, boldValue }) => (
  value ? (
   // Reduced bottom margin for tighter layout
   <div className="flex mb-0_5 text-xs print:text-[9pt] print:leading-tight print:mb-0.5"> {/* Adjusted print font size */}
     {/* Adjusted width for label, slightly increased */}
     <span className="w-[80px] flex-shrink-0 print:w-[80px]">{label}</span> {/* Increased label width */}
     <span className="mr-1 print:mr-1">:</span>
     <span className={cn("break-words", boldValue ? 'font-semibold print:font-semibold' : '')}>{value || '-'}</span>
   </div>
 ) : null
);

// Helper component for checklist items
const ChecklistItem: React.FC<{ checked: boolean; label: string }> = ({ checked, label }) => (
    // Reduced bottom margin and icon size
    <div className="flex items-center mb-0_5 text-xs print:text-[9pt] print:leading-tight print:mb-0.5"> {/* Adjusted print font size */}
        {checked ? <CheckSquare className="w-3 h-3 mr-1 text-black print:w-[9pt] print:h-[9pt] print:mr-1" /> : <Square className="w-3 h-3 mr-1 text-gray-400 print:w-[9pt] print:h-[9pt] print:mr-1" />} {/* Adjusted icon size */}
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
const Receipt: React.FC<{ data: BuktiDaftarUlangData; isArsip?: boolean; namaPetugas?: string | null }> = ({ data, isArsip = false, namaPetugas }) => {
     // Format tanggal daftar ulang if available
    const formattedTanggal = data.tanggalDaftarUlang
      ? format(new Date(data.tanggalDaftarUlang), 'dd MMMM yyyy', { locale: localeId })
      : '...................'; // Placeholder if date is missing
    const tempatDaftar = data.kabupatenTempat || 'Banyuputih'; // Use kabupaten or default
    const petugasNamaDisplay = namaPetugas || 'Panitia PPDB'; // Use logged-in user's name or default

    return (
      // Adjusted padding, added max-w-none for print to take flex size
      <div className={cn("receipt-container bg-white p-2 max-w-full print:max-w-none print:p-[4mm] mx-auto border border-black text-xs font-sans break-inside-avoid print:text-[9pt] print:leading-normal", isArsip ? "border-t-4 border-t-red-600" : "")}> {/* Adjusted padding and text size */}
        {/* Header - Adjusted margins and sizes for print */}
        <div className="text-center mb-1 border-b-2 border-black pb-1 print:mb-1 print:pb-1"> {/* Adjusted margin/padding */}
           <div className="flex justify-center items-center mb-1 print:mb-1"> {/* Adjusted margin */}
                {/* Placeholder for logo - Adjusted sizes */}
                <div className="w-10 h-10 bg-gray-200 flex items-center justify-center mr-2 rounded-full overflow-hidden flex-shrink-0 print:w-10 print:h-10 print:mr-2" data-ai-hint="school logo"> {/* Increased logo size */}
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-700 print:w-6 print:h-6"> {/* Increased icon size */}
                        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.522c0 .318.218.594.5.707A9.735 9.735 0 0 0 6 21a9.707 9.707 0 0 0 5.25-1.533v-1.42a.75.75 0 0 0-.657-.744A8.202 8.202 0 0 1 6 18a8.235 8.235 0 0 1-2.25-.37v-1.42a.75.75 0 0 1 .657-.744A8.21 8.21 0 0 0 6 15c2.086 0 3.981-.782 5.378-2.067a.75.75 0 0 0 1.122-.56v-1.42a.75.75 0 0 0-.5-.707 8.21 8.21 0 0 0-1.721-.486.75.75 0 0 0-.657.744v1.42h-.001c-1.431.925-3.312 1.483-5.323 1.483a8.235 8.235 0 0 1-2.25-.37V7.5a8.21 8.21 0 0 0 1.721-.486.75.75 0 0 1 .657.744v1.42c0 .274.11.523.294.706A8.21 8.21 0 0 0 6 10.5c2.086 0 3.981-.782 5.378-2.067a.75.75 0 0 1 1.122-.56v-1.42a.75.75 0 0 1 .5-.707c.157-.054.316-.1.477-.143a.75.75 0 0 0 .6-.89Z" />
                        <path d="M12.75 3a9.735 9.735 0 0 1 3.25.555.75.75 0 0 1 .5.707v14.522c0 .318-.218.594-.5.707A9.735 9.735 0 0 1 12.75 21a9.707 9.707 0 0 1-5.25-1.533v-1.42a.75.75 0 0 1 .657-.744 8.202 8.202 0 0 0 4.593-.345 8.235 8.235 0 0 0 2.25-.37v-1.42a.75.75 0 0 0-.657-.744 8.21 8.21 0 0 1-4.593-.345c-2.086 0-3.981.782-5.378 2.067a.75.75 0 0 1-1.122.56v1.42a.75.75 0 0 1 .5.707 8.21 8.21 0 0 1 1.721.486.75.75 0 0 1 .657-.744v-1.42h.001c1.431-.925 3.312-1.483 5.323-1.483a8.235 8.235 0 0 0 2.25.37V13.5a8.21 8.21 0 0 1-1.721.486.75.75 0 0 0-.657.744v-1.42a.75.75 0 0 1-.294-.706 8.21 8.21 0 0 1-1.622-4.533c2.086 0 3.981.782 5.378 2.067a.75.75 0 0 0 1.122.56v1.42a.75.75 0 0 0 .5-.707c.157.054.316.1.477.143a.75.75 0 0 1 .6.89Z" />
                    </svg>
                </div>
                {/* Adjusted font sizes for better fit */}
                <div className="flex-grow print:text-[9pt] print:leading-tight"> {/* Adjusted font size */}
                    <h1 className="text-xs font-bold print:text-[10pt]">PANITIA</h1> {/* Adjusted font size */}
                    <h2 className="text-sm font-bold text-green-700 print:text-[11pt]">PENDAFTARAN PESERTA DIDIK BARU</h2> {/* Adjusted font size */}
                    <h2 className="text-base font-bold text-green-700 print:text-[12pt]">MA NU 01 BANYUPUTIH</h2> {/* Adjusted font size */}
                    <h3 className="text-xs font-bold print:text-[10pt]">TAHUN PELAJARAN 2025/2026</h3> {/* Adjusted font size */}
                </div>
           </div>
        </div>
         {isArsip && <p className="text-center text-sm font-semibold text-red-600 mb-1 print:text-[10pt] print:mb-1">Untuk Panitia</p>} {/* Adjusted font size */}
        <h3 className="font-bold text-center mb-2 underline text-base print:text-[11pt] print:mb-2">BUKTI DAFTAR ULANG</h3> {/* Adjusted font size */}

        {/* Identitas Pendaftar - Adjusted margin */}
        <div className="mb-2 print:mb-2"> {/* Adjusted margin */}
             <DataRow label="Nomor Pendaftaran" value={data.nomorPendaftaran} boldValue/>
             <DataRow label="Nama Pendaftar" value={data.namaPendaftar?.toUpperCase()} boldValue/>
             <DataRow label="Asal Sekolah" value={data.asalSekolah?.toUpperCase()} />
             <DataRow label="Alamat" value={data.alamat} />
        </div>

        <hr className="border-dashed border-gray-400 my-1 print:my-1" /> {/* Adjusted margin */}

        {/* Detail Daftar Ulang - Adjusted margin and checklist layout */}
        <div className="mb-2 print:mb-2"> {/* Adjusted margin */}
            <DataRow label="No. Daftar Ulang" value={data.nomorDaftarUlang} boldValue/>
            <p className="mb-1 text-xs font-medium print:text-[9pt] print:mb-1">Berkas yang diserahkan:</p> {/* Adjusted font size */}
            {/* Ensure checklist items don't wrap unnecessarily */}
            <div className="ml-2 grid grid-cols-1 gap-y-0.5 print:ml-2 print:gap-y-0.5"> {/* Adjusted margin/gap */}
                 <ChecklistItem checked={data.kelengkapanKK} label="KK/Akte (asli)" />
                 <ChecklistItem checked={data.kelengkapanSKL} label="Surat Kelulusan (asli)" />
                 <ChecklistItem checked={true} label="Fotocopi KK/Akte" />
                 <ChecklistItem checked={data.kelengkapanPiagam} label="Fotocopi Piagam / Sertifikat Juara" />
                 <ChecklistItem checked={data.kelengkapanSKTM} label="SKTM / Surat Rekom PRNU" />
            </div>
            <div className="mt-1 flex items-center print:mt-1"> {/* Adjusted margin */}
                 <ChecklistItem checked={data.bayarDaftarUlang} label="Daftar Ulang" />
                  {data.bayarDaftarUlang && (
                     <span className="ml-1 bg-black text-white font-semibold px-1 py-0.5 rounded text-[9pt] print:text-[8pt] print:ml-1 print:px-1 print:py-0.5"> {/* Adjusted font size */}
                          {formatCurrency(data.biayaDaftarUlang)}
                     </span>
                  )}
            </div>
        </div>

        {/* Footer Box - Adjusted size, padding, margin, font size */}
        <div className={cn("border border-black p-1.5 text-center my-1 text-[8pt] leading-tight print:text-[8pt] print:my-1 print:p-1.5", isArsip ? "min-h-[35px]" : "")}> {/* Adjusted padding/min-height/font */}
            {!isArsip && (
                <>
                    Selamat bergabung di Madrasah Hebat, MA NU 01 Banyuputih.<br/>
                    Info keberangkatan pertama akan di informasikan di grup Whatsapp Siswa Baru 2025
                </>
            )}
            {isArsip && <>&nbsp;</>} {/* Empty box for arsip */}
        </div>


        {/* Signature - Adjusted margin, size */}
        <div className="flex justify-end mt-2 print:mt-2"> {/* Adjusted margin */}
            <div className="text-center text-xs print:text-[9pt]"> {/* Adjusted font size */}
                <p>{tempatDaftar}, {formattedTanggal}</p>
                <p>Panitia PPDB</p>
                <div className="h-6 print:h-5 signature-space"></div> {/* Adjusted space for signature */}
                 {/* Display the petugasNamaDisplay */}
                <p className="font-bold underline print:font-bold">( {petugasNamaDisplay} )</p>
            </div>
        </div>

      </div>
    );
}


// Main Print Component combining two Receipts
export const BuktiDaftarUlangPrint: React.FC<{ data: BuktiDaftarUlangData }> = ({ data }) => {
    // Pass the namaPetugas from data to both Receipt components
    return (
       // Use flex layout for side-by-side printing
       <div className="print-container flex flex-col md:flex-row gap-4 print:flex-row print:gap-[10mm]"> {/* Adjusted gap */}
          {/* Copy 1: For Student */}
          <Receipt data={data} namaPetugas={data.namaPetugas} />

          {/* Separator is now handled by the container gap in print styles */}

          {/* Copy 2: For Arsip */}
          <Receipt data={data} isArsip={true} namaPetugas={data.namaPetugas} />
       </div>
    );
  };
