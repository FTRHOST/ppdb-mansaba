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
import { Printer, Download, Search, Shirt } from 'lucide-react'; // Using Shirt icon
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// Mock data structure for uniform report
interface SeragamReportItem {
  ukuran: string; // S, M, L, XL, etc.
  jenisKelamin: 'Laki-laki' | 'Perempuan' | 'Total'; // Added Total for overall summary
  osis: number;
  pramuka: number;
  batik: number;
  olahraga: number;
}

// Mock data - replace with actual data aggregation from daftar ulang records
const mockRawData = [
  // Sample daftar ulang records (subset of fields needed)
  { id: 101, jenisKelamin: 'Laki-laki', ukuranSeragam: 'L', seragamOsis: true, seragamPramuka: true, seragamBatik: true, seragamOlahraga: false },
  { id: 102, jenisKelamin: 'Perempuan', ukuranSeragam: 'M', seragamOsis: true, seragamPramuka: true, seragamBatik: true, seragamOlahraga: true },
  { id: 103, jenisKelamin: 'Laki-laki', ukuranSeragam: 'XL', seragamOsis: true, seragamPramuka: false, seragamBatik: true, seragamOlahraga: true },
  { id: 104, jenisKelamin: 'Laki-laki', ukuranSeragam: 'L', seragamOsis: true, seragamPramuka: true, seragamBatik: true, seragamOlahraga: true },
  { id: 105, jenisKelamin: 'Perempuan', ukuranSeragam: 'M', seragamOsis: true, seragamPramuka: true, seragamBatik: false, seragamOlahraga: true },
  { id: 106, jenisKelamin: 'Perempuan', ukuranSeragam: 'S', seragamOsis: false, seragamPramuka: true, seragamBatik: true, seragamOlahraga: true },
   { id: 107, jenisKelamin: 'Laki-laki', ukuranSeragam: 'XXL', seragamOsis: true, seragamPramuka: true, seragamBatik: true, seragamOlahraga: true },
];

// Function to process raw data into the report structure
const processSeragamData = (rawData: any[]): SeragamReportItem[] => {
  const reportMap: { [key: string]: SeragamReportItem } = {};
  const ukuranOrder = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Custom']; // Define order

  rawData.forEach(item => {
    const key = `${item.ukuranSeragam}-${item.jenisKelamin}`;
    if (!reportMap[key]) {
      reportMap[key] = {
        ukuran: item.ukuranSeragam,
        jenisKelamin: item.jenisKelamin,
        osis: 0,
        pramuka: 0,
        batik: 0,
        olahraga: 0,
      };
    }
    if (item.seragamOsis) reportMap[key].osis++;
    if (item.seragamPramuka) reportMap[key].pramuka++;
    if (item.seragamBatik) reportMap[key].batik++;
    if (item.seragamOlahraga) reportMap[key].olahraga++;
  });

  // Calculate Totals
  ukuranOrder.forEach(ukuran => {
       const totalKey = `${ukuran}-Total`;
       reportMap[totalKey] = {
           ukuran: ukuran,
           jenisKelamin: 'Total',
           osis: (reportMap[`${ukuran}-Laki-laki`]?.osis || 0) + (reportMap[`${ukuran}-Perempuan`]?.osis || 0),
           pramuka: (reportMap[`${ukuran}-Laki-laki`]?.pramuka || 0) + (reportMap[`${ukuran}-Perempuan`]?.pramuka || 0),
           batik: (reportMap[`${ukuran}-Laki-laki`]?.batik || 0) + (reportMap[`${ukuran}-Perempuan`]?.batik || 0),
           olahraga: (reportMap[`${ukuran}-Laki-laki`]?.olahraga || 0) + (reportMap[`${ukuran}-Perempuan`]?.olahraga || 0),
       };
       // Remove total if all counts are zero
        if (reportMap[totalKey].osis === 0 && reportMap[totalKey].pramuka === 0 && reportMap[totalKey].batik === 0 && reportMap[totalKey].olahraga === 0) {
             delete reportMap[totalKey];
        }
   });


   // Sort the results based on ukuranOrder and then jenisKelamin
    return Object.values(reportMap).sort((a, b) => {
       const indexA = ukuranOrder.indexOf(a.ukuran);
       const indexB = ukuranOrder.indexOf(b.ukuran);
       if (indexA !== indexB) return indexA - indexB;

        // Define order for jenisKelamin within each ukuran
       const jkOrder = ['Laki-laki', 'Perempuan', 'Total'];
       return jkOrder.indexOf(a.jenisKelamin) - jkOrder.indexOf(b.jenisKelamin);
   });
};


export default function LaporanSeragamPage() {
  const [reportData, setReportData] = useState<SeragamReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'total' | 'laki' | 'perempuan'>('total');

  // Simulate data fetching and processing
  useEffect(() => {
    // TODO: Replace mockRawData with actual API call to fetch necessary fields from daftar ulang records
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      const processedData = processSeragamData(mockRawData);
      setReportData(processedData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleExportExcel = () => {
    // TODO: Implement Excel export logic for the current view (tab)
    console.log(`Exporting Seragam Report (${activeTab}) to Excel...`);
    alert('Fitur export Excel belum diimplementasikan.');
  };

  const handlePrintTable = () => {
    // TODO: Implement table print logic for the current view (tab)
    console.log(`Printing Seragam Report (${activeTab}) table...`);
     window.print(); // Basic browser print
  };

  const getFilteredData = (tab: 'total' | 'laki' | 'perempuan'): SeragamReportItem[] => {
     switch (tab) {
         case 'laki':
             return reportData.filter(item => item.jenisKelamin === 'Laki-laki');
         case 'perempuan':
             return reportData.filter(item => item.jenisKelamin === 'Perempuan');
         case 'total':
         default:
             return reportData.filter(item => item.jenisKelamin === 'Total');
     }
 };

 // Chart data preparation based on active tab
 const chartData = getFilteredData(activeTab).map(item => ({
     name: item.ukuran,
     Osis: item.osis,
     Pramuka: item.pramuka,
     Batik: item.batik,
     Olahraga: item.olahraga,
 }));


  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <Shirt /> Laporan Kebutuhan Seragam
          </CardTitle>
          <CardDescription>Rekapitulasi jumlah kebutuhan seragam berdasarkan ukuran dan jenis kelamin.</CardDescription>
          <div className="flex justify-end gap-2 pt-4">
                 {/* Note: Search might be less useful here unless searching by size */}
                 <Button variant="outline" size="sm" onClick={handlePrintTable}>
                   <Printer className="mr-2 h-4 w-4" />
                   Cetak Tabel ({activeTab})
                 </Button>
                 <Button variant="outline" size="sm" onClick={handleExportExcel}>
                   <Download className="mr-2 h-4 w-4" />
                   Export Excel ({activeTab})
                 </Button>
           </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Memuat laporan...</p>
          ) : (
             <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
               <TabsList className="grid w-full grid-cols-3 mb-4">
                 <TabsTrigger value="total">Total Kebutuhan</TabsTrigger>
                 <TabsTrigger value="laki">Laki-laki</TabsTrigger>
                 <TabsTrigger value="perempuan">Perempuan</TabsTrigger>
               </TabsList>

               {/* Chart Section - Display chart based on active tab */}
               <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-center text-primary">
                      Grafik Kebutuhan Seragam ({activeTab === 'total' ? 'Total' : activeTab === 'laki' ? 'Laki-laki' : 'Perempuan'})
                  </h3>
                   <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={chartData}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="name" />
                         <YAxis allowDecimals={false}/>
                         <Tooltip />
                         <Legend />
                         <Bar dataKey="Osis" stackId="a" fill="#8884d8" /> {/* Example colors */}
                         <Bar dataKey="Pramuka" stackId="a" fill="#82ca9d" />
                         <Bar dataKey="Batik" stackId="a" fill="#ffc658" />
                         <Bar dataKey="Olahraga" stackId="a" fill="#ff7300" />
                       </BarChart>
                   </ResponsiveContainer>
               </div>

                {/* Table Section - Render tables within TabsContent */}
                <TabsContent value={activeTab}>
                   <Table>
                     <TableHeader>
                       <TableRow>
                         <TableHead>Ukuran</TableHead>
                         <TableHead className="text-right">Osis</TableHead>
                         <TableHead className="text-right">Pramuka</TableHead>
                         <TableHead className="text-right">Batik</TableHead>
                         <TableHead className="text-right">Olahraga</TableHead>
                         <TableHead className="text-right font-semibold">Total Pcs</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {getFilteredData(activeTab).length > 0 ? (
                         getFilteredData(activeTab).map((item) => {
                           const totalPcs = item.osis + item.pramuka + item.batik + item.olahraga;
                           // Only render row if totalPcs > 0 for Total tab, always render for L/P
                           if (activeTab === 'total' && totalPcs === 0) return null;
                           return (
                             <TableRow key={`${item.ukuran}-${item.jenisKelamin}`}>
                               <TableCell className="font-medium">{item.ukuran}</TableCell>
                               <TableCell className="text-right">{item.osis}</TableCell>
                               <TableCell className="text-right">{item.pramuka}</TableCell>
                               <TableCell className="text-right">{item.batik}</TableCell>
                               <TableCell className="text-right">{item.olahraga}</TableCell>
                               <TableCell className="text-right font-semibold">{totalPcs}</TableCell>
                             </TableRow>
                           );
                         })
                       ) : (
                         <TableRow>
                           <TableCell colSpan={6} className="h-24 text-center">
                             Tidak ada data seragam untuk kategori ini.
                           </TableCell>
                         </TableRow>
                       )}
                     </TableBody>
                       <TableCaption>
                           Rekap kebutuhan seragam {activeTab === 'total' ? 'total' : activeTab === 'laki' ? 'laki-laki' : 'perempuan'}.
                       </TableCaption>
                   </Table>
                </TabsContent>
             </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
