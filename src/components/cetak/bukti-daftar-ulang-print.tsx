
'use client';

import React from 'react';
import Image from 'next/image'; // Use next/image
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
   <div className="flex mb-0_5 text-xs print:text-[9pt] print:leading-tight print:mb-0"> {/* Match image tight spacing */}
     {/* Width for label adjusted to match image */}
     <span className="w-[100px] flex-shrink-0 print:w-[100px]">{label}</span> {/* Increased label width to match image */}
     <span className="mr-2 print:mr-2">:</span> {/* Increased colon spacing */}
     <span className={cn("break-words", boldValue ? 'font-semibold print:font-semibold' : '')}>{value || '-'}</span>
   </div>
 ) : null
);

// Helper component for checklist items
const ChecklistItem: React.FC<{ checked: boolean; label: string }> = ({ checked, label }) => (
    // Reduced bottom margin and icon size, tight spacing
    <div className="flex items-center mb-0 text-xs print:text-[9pt] print:leading-tight print:mb-0"> {/* No bottom margin for checklist items */}
        {checked ? <CheckSquare className="w-3 h-3 mr-1 text-black print:w-[9pt] print:h-[9pt] print:mr-1" /> : <Square className="w-3 h-3 mr-1 text-gray-500 print:w-[9pt] print:h-[9pt] print:mr-1" />} {/* Adjusted icon size */}
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
      <div className={cn(
          "receipt-container bg-white p-2 max-w-full print:max-w-none print:p-[4mm] mx-auto text-xs font-sans break-inside-avoid print:text-[9pt] print:leading-normal flex flex-col h-full", // Removed border from here, added h-full
          isArsip ? "border-t-4 border-t-red-600" : ""
      )}>
        {/* Header - Replace SVG with Image */}
        <div className="mb-1 border-b-2 border-black pb-1 print:mb-1 print:pb-1">
           <div className="w-full">
             <Image
               src="/logo-kop.jpg" // Path to your JPG letterhead image
               alt="Kop Surat MA NU 01 Banyuputih"
               width={700} // Adjust width as needed
               height={100} // Adjust height as needed
               className="w-full h-auto object-contain" // Ensure it scales correctly
               priority // Load the logo eagerly
               data-ai-hint="school letterhead"
             />
           </div>
        </div>
        {/* Title - Adjusted margin, added red line */}
        <h3 className="font-bold text-center mb-0.5 mt-0.5 underline text-sm print:text-[10pt] print:mb-0.5 print:mt-0.5">
           BUKTI DAFTAR ULANG {isArsip ? '(ARSIP)' : ''}
        </h3>
        <div className="h-[2px] bg-red-600 w-1/3 mx-auto mb-2 print:h-[1.5pt] print:mb-2"></div> {/* Red line */}

         {/* Content Area - Ensure it grows */}
         <div className="receipt-content flex-grow">
            {/* Identitas Pendaftar - Adjusted margin */}
            <div className="mb-1 print:mb-1">
                 <DataRow label="Nomor" value={data.nomorPendaftaran} boldValue/>
                 <DataRow label="Pendaftaran" value={""} /> {/* Empty row to match image spacing? */}
                 <DataRow label="Nama Pendaftar" value={data.namaPendaftar?.toUpperCase()} boldValue/>
                 <DataRow label="Asal Sekolah" value={data.asalSekolah?.toUpperCase()} />
                 <DataRow label="Alamat" value={data.alamat || '-'} /> {/* Ensure Alamat row */}
                 <DataRow label="No. Daftar Ulang" value={data.nomorDaftarUlang} boldValue/>
            </div>

            {/* Detail Daftar Ulang - Checklist with tight spacing */}
            <div className="mb-1 print:mb-1"> {/* Reduced bottom margin */}
                 <p className="mb-0.5 text-xs font-medium print:text-[9pt] print:mb-0.5">Kelengkapan:</p> {/* Label for checklist */}
                <div className="ml-2 grid grid-cols-1 gap-y-0 print:ml-2 print:gap-y-0"> {/* Tighter grid */}
                     <ChecklistItem checked={data.kelengkapanKK} label="KK/Akte (asli)" />
                     <ChecklistItem checked={data.kelengkapanSKL} label="Surat Kelulusan (asli)" />
                     <ChecklistItem checked={true} label="Fotocopi KK/Akte" /> {/* Hardcoded checked as per image */}
                     <ChecklistItem checked={data.kelengkapanPiagam} label="Fotocopi Piagam / Sertifikat Juara" />
                     <ChecklistItem checked={data.kelengkapanSKTM} label="SKTM / Surat Rekom PRNU" />
                </div>
                <div className="mt-1 flex items-center print:mt-1 ml-2"> {/* Increased top margin slightly */}
                     <ChecklistItem checked={data.bayarDaftarUlang} label="Daftar Ulang" />
                      {data.bayarDaftarUlang && (
                         <span className="ml-2 bg-black text-white font-semibold px-1 py-0.5 rounded text-[9pt] print:text-[8pt] print:ml-2 print:px-1 print:py-0.5"> {/* Increased margin */}
                              {formatCurrency(data.biayaDaftarUlang)}
                         </span>
                      )}
                </div>
             </div>
             {/* Info Box - Moved below checklist */}
             <div className={cn(
                 "border border-black p-1.5 text-center text-[8pt] leading-tight print:text-[7pt] print:p-1 small-print bg-gray-100 print:bg-gray-100 mt-1 mb-1", // Adjusted padding and margins
                 isArsip ? 'h-8 print:h-8' : '' // Keep height for Arsip or let content dictate for non-arsip
              )}>
                  {!isArsip ? (
                      <>
                          Selamat bergabung di Madrasah Hebat, MA NU 01 Banyuputih.<br/>
                          Info keberangkatan pertama akan di informasikan di grup Whatsapp Siswa Baru 2025
                      </>
                  ) : (
                      // Keep the box for layout consistency, maybe add a placeholder or just height
                      <div className="h-8 print:h-8"></div> // Adjust height as needed or remove if spacing is enough
                  )}
              </div>
          </div>

        {/* Footer - Pushes to bottom */}
        <div className="receipt-footer mt-auto pt-2"> {/* Use mt-auto and added padding-top */}
            {/* Signature - Positioned at the bottom right */}
            <div className="receipt-signature flex justify-end">
                <div className="text-center text-xs print:text-[9pt]">
                    <p>{tempatDaftar}, {formattedTanggal}</p>
                    <p>Panitia PPDB</p>
                    {/* Adjusted height for signature space */}
                    <div className="h-10 print:h-10 signature-space"></div>
                    <p className="font-bold underline print:font-bold">( {petugasNamaDisplay} )</p>
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
       // Use flex layout for side-by-side printing, ensure equal width and height
       <div className="print-container flex flex-col md:flex-row gap-4 print:flex print:flex-row print:gap-[10mm] h-full">
          {/* Copy 1: For Student */}
          <div className="receipt-outer-wrapper h-full"> {/* Added wrapper with border and h-full */}
             <Receipt data={data} namaPetugas={data.namaPetugas} />
          </div>

          {/* Copy 2: For Arsip */}
           <div className="receipt-outer-wrapper h-full"> {/* Added wrapper with border and h-full */}
              <Receipt data={data} isArsip={true} namaPetugas={data.namaPetugas} />
           </div>
       </div>
    );
  };

