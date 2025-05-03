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
  value || label === 'Alamat' ? ( // Always render Alamat row even if value is empty like image
   // Reduced bottom margin for tighter layout, consistent with image
   <div className="flex mb-0_5 text-xs print:text-[9.5pt] print:leading-tight print:mb-[-0.2mm]"> {/* Match image tight spacing, slightly reduced negative margin */}
     {/* Width for label adjusted to match image */}
     <span className="w-[100px] flex-shrink-0 print:w-[100px]">{label}</span> {/* Label width */}
     <span className="mr-2 print:mr-[5px]">:</span> {/* Colon spacing */}
     <span className={cn("break-words", boldValue ? 'font-semibold print:font-semibold' : '')}>{value || '-'}</span>
   </div>
 ) : null
);

// Helper component for checklist items
const ChecklistItem: React.FC<{ checked: boolean; label: string }> = ({ checked, label }) => (
    // Reduced bottom margin and icon size, tight spacing
    <div className="flex items-center mb-0 text-xs print:text-[9.5pt] print:leading-tight print:mb-[-0.5mm]"> {/* Negative margin for tighter list */}
        {checked ? <CheckSquare className="w-3 h-3 mr-1 text-black print:w-[9pt] print:h-[9pt] print:mr-[1mm]" /> : <Square className="w-3 h-3 mr-1 text-gray-500 print:w-[9pt] print:h-[9pt] print:mr-[1mm]" />} {/* Adjusted icon size & margin */}
        <span>{label}</span>
    </div>
);

// Helper function to format currency
const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined || value <= 0) {
        return '-';
    }
    // Format exactly as "Rp 400.000"
    return `Rp ${new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value).replace(/\./g, '.')}`; // Ensure dot separators
};


// Reusable Receipt Component - Adjusted styling to match image
const Receipt: React.FC<{ data: BuktiDaftarUlangData; isArsip?: boolean; namaPetugas?: string | null }> = ({ data, isArsip = false, namaPetugas }) => {
     // Format tanggal daftar ulang exactly as in image "5/2/2025" (example)
    const formattedTanggal = data.tanggalDaftarUlang
      ? format(new Date(data.tanggalDaftarUlang), 'd/M/yyyy', { locale: localeId })
      : '...................';
    const tempatDaftar = data.kabupatenTempat || 'Banyuputih'; // Use kabupaten or default
    const petugasNamaDisplay = namaPetugas || 'Panitia PPDB'; // Use logged-in user's name or default

    return (
      // Use flex column, ensure height fills container for footer push
      <div className={cn("receipt-container bg-white p-2 max-w-full print:max-w-none print:p-[3mm_4mm] mx-auto border border-black text-xs font-sans break-inside-avoid print:text-[9.5pt] print:leading-normal flex flex-col h-full", isArsip ? "arsip" : "")}>
        {/* Header - Match image layout and styling */}
        <div className="text-center mb-1 border-b-2 border-black pb-1 print:mb-[1mm] print:pb-[1mm] print:border-b-[1.5pt]">
           <div className="flex justify-center items-center mb-0 print:mb-0"> {/* Reduced margin */}
                {/* Logo */}
                <div className="w-10 h-10 bg-transparent flex items-center justify-center mr-2 flex-shrink-0 print:w-[10mm] print:h-[10mm] print:mr-[2mm]" data-ai-hint="school logo green">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-green-700 print:w-[10mm] print:h-[10mm]"> {/* Matched size */}
                        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.522c0 .318.218.594.5.707A9.735 9.735 0 0 0 6 21a9.707 9.707 0 0 0 5.25-1.533v-1.42a.75.75 0 0 0-.657-.744A8.202 8.202 0 0 1 6 18a8.235 8.235 0 0 1-2.25-.37v-1.42a.75.75 0 0 1 .657-.744A8.21 8.21 0 0 0 6 15c2.086 0 3.981-.782 5.378-2.067a.75.75 0 0 0 1.122-.56v-1.42a.75.75 0 0 0-.5-.707 8.21 8.21 0 0 0-1.721-.486.75.75 0 0 0-.657.744v1.42h-.001c-1.431.925-3.312 1.483-5.323 1.483a8.235 8.235 0 0 1-2.25-.37V7.5a8.21 8.21 0 0 0 1.721-.486.75.75 0 0 1 .657.744v1.42c0 .274.11.523.294.706A8.21 8.21 0 0 0 6 10.5c2.086 0 3.981-.782 5.378-2.067a.75.75 0 0 1 1.122-.56v-1.42a.75.75 0 0 1 .5-.707c.157-.054.316-.1.477-.143a.75.75 0 0 0 .6-.89Z" />
                        <path d="M12.75 3a9.735 9.735 0 0 1 3.25.555.75.75 0 0 1 .5.707v14.522c0 .318-.218.594-.5.707A9.735 9.735 0 0 1 12.75 21a9.707 9.707 0 0 1-5.25-1.533v-1.42a.75.75 0 0 1 .657-.744 8.202 8.202 0 0 0 4.593-.345 8.235 8.235 0 0 0 2.25-.37v-1.42a.75.75 0 0 0-.657-.744 8.21 8.21 0 0 1-4.593-.345c-2.086 0-3.981.782-5.378 2.067a.75.75 0 0 1-1.122.56v1.42a.75.75 0 0 1 .5.707 8.21 8.21 0 0 1 1.721.486.75.75 0 0 1 .657-.744v-1.42h.001c1.431-.925 3.312-1.483 5.323-1.483a8.235 8.235 0 0 0 2.25.37V13.5a8.21 8.21 0 0 1-1.721.486.75.75 0 0 0-.657.744v-1.42a.75.75 0 0 1-.294-.706 8.21 8.21 0 0 1-1.622-4.533c2.086 0 3.981.782 5.378 2.067a.75.75 0 0 0 1.122.56v1.42a.75.75 0 0 0 .5-.707c.157.054.316.1.477.143a.75.75 0 0 1 .6.89Z" />
                    </svg>
                </div>
                {/* Text Alignment & Styling */}
                <div className="flex-grow print:text-[9pt] print:leading-tight text-left"> {/* Left align text block */}
                    <p className="text-xs font-bold print:text-[9pt] mb-0">PANITIA APENDAFTARAN PESERTA DIDIK BARU</p> {/* Adjusted text */}
                    <p className="text-sm font-bold text-green-700 print:text-[10pt] mb-0">MA NU 01 BANYUPUTIH</p> {/* Larger school name */}
                    <p className="text-xs font-bold print:text-[9pt] mb-0">TAHUN PELAJARAN 2025 / 2026</p> {/* Added slash */}
                    {/* Divider */}
                    <div className="h-[2px] bg-teal-600 my-0.5 print:h-[1pt] print:my-[0.5mm]"></div> {/* Thinner line */}
                </div>
           </div>
        </div>
        {/* Title - Adjusted margin, added red line */}
        <h3 className="font-bold text-center mb-0.5 mt-0.5 underline text-sm print:text-[10pt] print:mb-[0.5mm] print:mt-[0.5mm]">
           BUKTI DAFTAR ULANG {isArsip ? '(ARSIP)' : ''}
        </h3>
        <div className="h-[2px] bg-red-600 w-1/3 mx-auto mb-2 print:h-[1pt] print:mb-[2mm]"></div> {/* Red line */}

         {/* Content Area - Ensure it grows */}
         <div className="receipt-content flex-grow">
            {/* Identitas Pendaftar - Adjusted margin */}
            <div className="mb-1 print:mb-[1mm]">
                 <DataRow label="Nomor" value={data.nomorPendaftaran} boldValue/>
                 <DataRow label="Pendaftaran" value={""} /> {/* Empty row for spacing */}
                 <DataRow label="Nama Pendaftar" value={data.namaPendaftar?.toUpperCase()} boldValue/>
                 <DataRow label="Asal Sekolah" value={data.asalSekolah?.toUpperCase()} />
                 <DataRow label="Alamat" value={data.alamat || '-'} /> {/* Ensure Alamat row */}
                 <DataRow label="No. Daftar Ulang" value={data.nomorDaftarUlang} boldValue/>
            </div>

            {/* Detail Daftar Ulang - Checklist with tight spacing */}
            <div className="mb-2 print:mb-[1mm]"> {/* Reduced bottom margin */}
                 <p className="mb-0.5 text-xs font-medium print:text-[9.5pt] print:mb-[0.5mm]">Kelengkapan:</p> {/* Label for checklist */}
                <div className="ml-2 grid grid-cols-1 gap-y-0 print:ml-[2mm] print:gap-y-0"> {/* Tighter grid */}
                     <ChecklistItem checked={data.kelengkapanKK} label="KK/Akte (asli)" />
                     <ChecklistItem checked={data.kelengkapanSKL} label="Surat Kelulusan (asli)" />
                     <ChecklistItem checked={true} label="Fotocopi KK/Akte" /> {/* Hardcoded checked as per image */}
                     <ChecklistItem checked={data.kelengkapanPiagam} label="Fotocopi Piagam / Sertifikat Juara" />
                     <ChecklistItem checked={data.kelengkapanSKTM} label="SKTM / Surat Rekom PRNU" />
                </div>
                <div className="mt-0.5 flex items-center print:mt-[0.5mm] ml-2 print:ml-[2mm]"> {/* Tighter spacing, aligned with checklist */}
                     <ChecklistItem checked={data.bayarDaftarUlang} label="Daftar Ulang" />
                      {data.bayarDaftarUlang && (
                         <span className="ml-2 bg-black text-white font-semibold px-1 py-0.5 rounded text-[9pt] print:text-[9pt] print:ml-[1.5mm] print:px-[1mm] print:py-[0.2mm]"> {/* Adjusted spacing/padding */}
                              {formatCurrency(data.biayaDaftarUlang)}
                         </span>
                      )}
                </div>
            </div>
         </div>

        {/* Footer - Pushes to bottom */}
        <div className="receipt-footer mt-auto"> {/* Use mt-auto to push */}
             {/* Info Box - match image style */}
             <div className={cn("border border-black p-1 text-center my-1 text-[8pt] leading-tight print:text-[8pt] print:mt-[1mm] print:mb-[1mm] print:p-[1mm] small-print bg-gray-100 print:bg-gray-100")}>
                {!isArsip ? (
                    <>
                        Selamat bergabung di Madrasah Hebat, MA NU 01 Banyuputih.<br/>
                        Info keberangkatan pertama akan di informasikan di grup Whatsapp Siswa Baru 2025
                    </>
                ) : (
                    <>&nbsp;</> // Maintain height for arsip
                )}
            </div>

            {/* Signature - Positioned at the bottom right */}
            <div className="receipt-signature flex justify-end mt-1 print:mt-[1mm]"> {/* Reduced top margin */}
                <div className="text-center text-xs print:text-[9.5pt]">
                    <p>{tempatDaftar}, {formattedTanggal}</p>
                    <p>Panitia PPDB</p>
                    <div className="h-6 print:h-[8mm] signature-space"></div> {/* Adjusted height for signature */}
                    <p className="font-bold underline print:font-semibold">( {petugasNamaDisplay} )</p> {/* Use semibold for print */}
                </div>
            </div>
        </div>

      </div>
    );
}


// Main Print Component combining two Receipts
export const BuktiDaftarUlangPrint: React.FC<{ data: BuktiDaftarUlangData }> = ({ data }) => {
    // Pass the namaPetugas from data to both Receipt components
    return (
       // Use flex layout for side-by-side printing, ensure equal width
       <div className="print-container flex flex-col md:flex-row gap-4 print:flex-row print:gap-[10mm]">
          {/* Copy 1: For Student */}
          <div className="receipt-outer-wrapper"> {/* Add wrapper */}
             <Receipt data={data} namaPetugas={data.namaPetugas} />
          </div>

          {/* Copy 2: For Arsip */}
           <div className="receipt-outer-wrapper arsip"> {/* Add wrapper and arsip class */}
              <Receipt data={data} isArsip={true} namaPetugas={data.namaPetugas} />
           </div>
       </div>
    );
  };
