'use client';

import type React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, FileInput, BarChart3 } from 'lucide-react';

// Mock data - replace with actual data fetching
const dashboardStats = {
  totalPendaftar: 125,
  sudahDaftarUlang: 80,
  belumDaftarUlang: 45,
  pendaftarHariIni: 15,
  daftarUlangHariIni: 7,
};

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-primary">Dashboard PPDB</h1>
      <p className="text-muted-foreground">Ringkasan status pendaftaran peserta didik baru.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendaftar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalPendaftar}</div>
            <p className="text-xs text-muted-foreground">Jumlah keseluruhan pendaftar</p>
          </CardContent>
        </Card>
        <Card className="shadow hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sudah Daftar Ulang</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.sudahDaftarUlang}</div>
            <p className="text-xs text-muted-foreground">Telah menyelesaikan proses daftar ulang</p>
          </CardContent>
        </Card>
        <Card className="shadow hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Daftar Ulang</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.belumDaftarUlang}</div>
            <p className="text-xs text-muted-foreground">Menunggu proses daftar ulang</p>
          </CardContent>
        </Card>
         <Card className="shadow hover:shadow-md transition-shadow md:col-span-1 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendaftar Hari Ini</CardTitle>
             <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendaftarHariIni}</div>
             <p className="text-xs text-muted-foreground">Pendaftar baru pada hari ini</p>
          </CardContent>
        </Card>
         <Card className="shadow hover:shadow-md transition-shadow md:col-span-1 lg:col-span-1">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Daftar Ulang Hari Ini</CardTitle>
             <FileInput className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{dashboardStats.daftarUlangHariIni}</div>
             <p className="text-xs text-muted-foreground">Peserta yang daftar ulang hari ini</p>
           </CardContent>
         </Card>
      </div>

      {/* Placeholder for recent activity or quick actions */}
      <Card className="shadow">
         <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Menampilkan log aktivitas terakhir.</CardDescription>
         </CardHeader>
         <CardContent>
            <p className="text-muted-foreground italic">Belum ada aktivitas terbaru.</p>
            {/* TODO: Implement recent activity log */}
         </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
