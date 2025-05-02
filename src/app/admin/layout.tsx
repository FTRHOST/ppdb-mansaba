'use client';

import type React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar'; // Assuming sidebar component exists
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Users, UserPlus, ListChecks, FileText, Settings, Edit, FileInput, BarChart3, BookUser, BriefcaseBusiness, School } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // Mock authentication - replace with real auth check
  const isAdmin = true; // Assume user is admin for now

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" />
             </svg>
            <span className="font-semibold text-lg text-primary group-data-[collapsible=icon]:hidden">
              MANSABA PPDB
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/admin')}
                tooltip="Dashboard"
              >
                <Link href="/admin">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarSeparator />

             <SidebarGroup>
              <SidebarGroupLabel>Pendaftaran</SidebarGroupLabel>
               <SidebarMenuItem>
                 <SidebarMenuButton
                   asChild
                   isActive={isActive('/admin/input-daftar-ulang')}
                   tooltip="Input Daftar Ulang"
                 >
                   <Link href="/admin/input-daftar-ulang">
                     <FileInput />
                     <span>Input Daftar Ulang</span>
                   </Link>
                 </SidebarMenuButton>
               </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/admin/data-pendaftar')}
                  tooltip="Data Pendaftar"
                >
                  <Link href="/admin/data-pendaftar">
                    <Users />
                    <span>Data Pendaftar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
             </SidebarGroup>

             <SidebarGroup>
               <SidebarGroupLabel>Status Daftar Ulang</SidebarGroupLabel>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive('/admin/peserta-daftar-ulang')}
                    tooltip="Peserta Daftar Ulang"
                  >
                    <Link href="/admin/peserta-daftar-ulang">
                      <ListChecks />
                      <span>Sudah Daftar Ulang</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive('/admin/belum-daftar-ulang')}
                    tooltip="Belum Daftar Ulang"
                  >
                    <Link href="/admin/belum-daftar-ulang">
                      <Edit /> {/* Using Edit as a placeholder for 'pending' */}
                      <span>Belum Daftar Ulang</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarGroup>

             <SidebarGroup>
               <SidebarGroupLabel>Laporan</SidebarGroupLabel>
                 <SidebarMenuItem>
                   <SidebarMenuButton
                     asChild
                     isActive={isActive('/admin/data-pendaftar-lengkap')}
                     tooltip="Data Lengkap"
                   >
                     <Link href="/admin/data-pendaftar-lengkap">
                       <FileText />
                       <span>Data Pendaftar Lengkap</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive('/admin/laporan-harian')}
                      tooltip="Laporan Harian"
                    >
                      <Link href="/admin/laporan-harian">
                        <BarChart3 />
                        <span>Laporan Harian</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive('/admin/laporan-sekolah')}
                      tooltip="Laporan Asal Sekolah"
                    >
                      <Link href="/admin/laporan-sekolah">
                        <School />
                        <span>Laporan Asal Sekolah</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive('/admin/laporan-seragam')}
                      tooltip="Laporan Seragam"
                    >
                      <Link href="/admin/laporan-seragam">
                        <BriefcaseBusiness /> {/* Using Briefcase as placeholder */}
                        <span>Laporan Seragam</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
             </SidebarGroup>

             {isAdmin && ( // Only show these if user is admin
               <SidebarGroup>
                 <SidebarGroupLabel>Administrasi</SidebarGroupLabel>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive('/admin/input-petugas')}
                      tooltip="Input Petugas"
                    >
                      <Link href="/admin/input-petugas">
                        <UserPlus />
                        <span>Input Petugas</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive('/admin/pengaturan')}
                      tooltip="Pengaturan"
                    >
                      <Link href="/admin/pengaturan">
                        <Settings />
                        <span>Pengaturan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
               </SidebarGroup>
             )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => { /* Add logout logic */ console.log('Logout clicked'); }} tooltip="Logout">
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 md:justify-end">
             <SidebarTrigger className="md:hidden" />
             {/* Add User profile dropdown or other header elements here */}
             <div className="text-sm text-muted-foreground">Admin Area</div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
             {children}
          </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
