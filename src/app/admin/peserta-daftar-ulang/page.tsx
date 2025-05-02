
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Printer, Download, Search, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Import Indonesian locale

// Mock data structure - adjust based on actual daftar ulang data
interface PesertaDaftarUlang {
  id: number; // Unique DB ID for daftar ulang record
  pendaftarId: number; // Link to Pendaftar table
  nomorPendaftaran: string;
  nomorDaftarUlang: string;
  nama: string;
  sekolahAsal: string;
  tanggalDaftarUlang: string; // Format: YYYY-MM-DD or display format
  ukuranSeragam: string;
}

// Mock data - replace with actual data fetching (filter pendaftar based on statusDaftarUlang='Sudah')
const mockData: PesertaDaftarUlang[] = [
  { id: 101, pendaftarId: 1, nomorPendaftaran: 'A-2526/0001', nomorDaftarUlang: 'DU-1', nama: 'Ahmad Fauzi', sekolahAsal: 'MTs N 1 Batang', tanggalDaftarUlang: '2024-07-15', ukuranSeragam: 'L' },
  { id: 102, pendaftarId: 3, nomorPendaftaran: 'A-2526/0003', nomorDaftarUlang: 'DU-2', nama: 'Citra Lestari', sekolahAsal: 'MTs Al Hidayah', tanggalDaftarUlang: '2024-07-15', ukuranSeragam: 'M' },
  { id: 103, pendaftarId: 6, nomorPendaftaran: 'A-2526/0006', nomorDaftarUlang: 'DU-3', nama: 'Fitri Handayani', sekolahAsal: 'SMP N 1 Subah', tanggalDaftarUlang: '2024-07-16', ukuranSeragam: 'XL' },
];

export default function PesertaDaftarUlangPage() {
  const [peserta, setPeserta] = useState<PesertaDaftarUlang[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    // TODO: Replace with actual API call to fetch peserta daftar ulang data
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      setPeserta(mockData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handlePrintBukti = (daftarUlangId: number) => {
    console.log('Print Bukti Clicked for Daftar Ulang ID:', daftarUlangId);
    // Open the print page in a new tab/window, passing the DAFTAR ULANG ID
    const printUrl = `/admin/cetak-bukti-du/${daftarUlangId}`;
    console.log('Attempting to open URL:', printUrl);
    const newWindow = window.open(printUrl, '_blank', 'noopener,noreferrer');
    if (newWindow) {
        console.log('New window opened successfully.');
    } else {
        console.error('Failed to open new window. Check pop-up blocker.');
        alert('Gagal membuka halaman cetak. Mohon izinkan pop-up untuk situs ini.');
    }
  };

  const handleEditDaftarUlang = (id: number) => {
    // TODO: Implement edit daftar ulang logic (e.g., navigate to edit page or open modal)
    console.log('Edit daftar ulang for ID:', id);
    // Example: router.push(`/admin/edit-daftar-ulang/${id}`);
     alert('Fitur edit daftar ulang belum diimplementasikan.');
  };

 const handleExportExcel = () => {
    // TODO: Implement Excel export logic
    console.log('Exporting to Excel...');
    alert('Fitur export Excel belum diimplementasikan.');
  };

   const handlePrintTable = () => {
     // TODO: Implement table print logic
     console.log('Printing table...');
     window.print(); // Basic browser print
   };

  const filteredData = peserta.filter(item =>
    item.nomorPendaftaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nomorDaftarUlang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sekolahAsal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <CheckCircle className="text-green-600"/> Peserta Sudah Daftar Ulang
          </CardTitle>
          <CardDescription>Daftar peserta didik yang telah menyelesaikan proses daftar ulang.</CardDescription>
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
              <div className="relative w-full md:w-1/3">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input
                   type="search"
                   placeholder="Cari peserta..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-8 w-full"
                 />
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={handlePrintTable}>
                   <Printer className="mr-2 h-4 w-4" />
                   Cetak Tabel
                 </Button>
                 <Button variant="outline" size="sm" onClick={handleExportExcel}>
                   <Download className="mr-2 h-4 w-4" />
                   Export Excel
                 </Button>
               </div>
            </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Memuat data...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>No. Daftar Ulang</TableHead>
                  <TableHead>No. Pendaftaran</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Sekolah Asal</TableHead>
                  <TableHead>Tgl Daftar Ulang</TableHead>
                  <TableHead>Ukuran Seragam</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.nomorDaftarUlang}</TableCell>
                      <TableCell>{item.nomorPendaftaran}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>{item.sekolahAsal}</TableCell>
                      <TableCell>{format(new Date(item.tanggalDaftarUlang), 'dd MMMM yyyy', { locale: id })}</TableCell>
                      <TableCell>{item.ukuranSeragam}</TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" className="h-8 w-8 p-0">
                               <span className="sr-only">Buka menu</span>
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                             <DropdownMenuItem onClick={() => handleEditDaftarUlang(item.id)}>
                               <Edit className="mr-2 h-4 w-4" />
                               <span>Edit Daftar Ulang</span>
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handlePrintBukti(item.id)}> {/* Pass Daftar Ulang ID */}
                               <Printer className="mr-2 h-4 w-4" />
                               <span>Cetak Bukti</span>
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Tidak ada data peserta yang sudah daftar ulang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
               <TableCaption>Total {filteredData.length} peserta sudah daftar ulang.</TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
