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
import { Edit, Printer, Download, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// Mock data structure - replace with actual data type from API/DB
interface Pendaftar {
  id: number; // Unique DB ID
  nomorPendaftaran: string;
  nama: string;
  sekolahAsal: string;
  statusDaftarUlang: 'Sudah' | 'Belum'; // Example status
}

// Mock data - replace with actual data fetching
const mockData: Pendaftar[] = [
  { id: 1, nomorPendaftaran: 'A-2526/0001', nama: 'Ahmad Fauzi', sekolahAsal: 'MTs N 1 Batang', statusDaftarUlang: 'Sudah' },
  { id: 2, nomorPendaftaran: 'A-2526/0002', nama: 'Budi Santoso', sekolahAsal: 'SMP N 2 Banyuputih', statusDaftarUlang: 'Belum' },
  { id: 3, nomorPendaftaran: 'A-2526/0003', nama: 'Citra Lestari', sekolahAsal: 'MTs Al Hidayah', statusDaftarUlang: 'Sudah' },
  { id: 4, nomorPendaftaran: 'A-2526/0004', nama: 'Dewi Anggraini', sekolahAsal: 'SMP Islam Terpadu', statusDaftarUlang: 'Belum' },
  { id: 5, nomorPendaftaran: 'A-2526/0005', nama: 'Eko Prasetyo', sekolahAsal: 'MTs N 1 Batang', statusDaftarUlang: 'Belum' },
  { id: 6, nomorPendaftaran: 'A-2526/0006', nama: 'Fitri Handayani', sekolahAsal: 'SMP N 1 Subah', statusDaftarUlang: 'Sudah' },
];

export default function DataPendaftarPage() {
  const [pendaftar, setPendaftar] = useState<Pendaftar[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    // TODO: Replace with actual API call to fetch pendaftar data
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      setPendaftar(mockData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handlePrintFormulir = (id: number) => {
    // TODO: Implement print formulir logic
    console.log('Cetak formulir for ID:', id);
    alert('Fitur cetak formulir belum diimplementasikan.');
  };

  const handleEditPendaftar = (id: number) => {
    // TODO: Implement edit pendaftar logic (e.g., navigate to edit page or open modal)
    console.log('Edit pendaftar for ID:', id);
    alert('Fitur edit pendaftar belum diimplementasikan.');
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
     alert('Fitur cetak tabel (lebih canggih) belum diimplementasikan.');
   };


  const filteredData = pendaftar.filter(item =>
    item.nomorPendaftaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sekolahAsal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Data Pendaftar</CardTitle>
          <CardDescription>Daftar calon peserta didik baru yang telah mengisi formulir pendaftaran.</CardDescription>
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
              <div className="relative w-full md:w-1/3">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input
                   type="search"
                   placeholder="Cari pendaftar..."
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
                  <TableHead>Nomor Pendaftaran</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Sekolah Asal</TableHead>
                  {/* <TableHead>Status Daftar Ulang</TableHead> */}
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.nomorPendaftaran}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>{item.sekolahAsal}</TableCell>
                      {/* <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.statusDaftarUlang === 'Sudah' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item.statusDaftarUlang}
                        </span>
                      </TableCell> */}
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
                            <DropdownMenuItem onClick={() => handleEditPendaftar(item.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Data</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrintFormulir(item.id)}>
                              <Printer className="mr-2 h-4 w-4" />
                              <span>Cetak Formulir</span>
                            </DropdownMenuItem>
                            {/* Add more actions if needed */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Tidak ada data pendaftar yang cocok dengan pencarian Anda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
                <TableCaption>Total {filteredData.length} pendaftar ditemukan.</TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
