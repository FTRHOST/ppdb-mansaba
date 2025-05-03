
'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Import usePathname
import { toast } from '@/hooks/use-toast';

// Mock user data structure
interface AuthUser {
    name: string;
    username: string; // Add username
    isAdmin: boolean; // Flag to differentiate admin and petugas
}

// Mock Petugas data structure (mirroring InputPetugasPage)
interface PetugasAccount {
    nama: string;
    username: string;
    password: string; // IMPORTANT: Storing plain text password is insecure. Only for mock purposes.
    isAdmin: boolean;
}


// Mock Auth Hook - Replace with actual implementation using Firebase Auth or other provider
export const useAuth = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true); // Start loading initially
    const router = useRouter();
    const pathname = usePathname(); // Get current path

    // Check auth state on initial load and pathname changes
    useEffect(() => {
        let isMounted = true; // Flag to prevent state updates on unmounted component
        setLoading(true); // Set loading true when checking starts
        console.log("Checking auth status for path:", pathname);

        // Use a shorter delay for checking storage
        const checkAuth = async () => {
            await new Promise(resolve => setTimeout(resolve, 50)); // Short delay

            if (!isMounted) return; // Don't proceed if unmounted

            const storedUser = localStorage.getItem('mockUser');
            let parsedUser: AuthUser | null = null;
            let shouldRedirect = false;

            if (storedUser) {
                try {
                    parsedUser = JSON.parse(storedUser);
                    console.log("User found in storage:", parsedUser);
                } catch (e) {
                    console.error("Error parsing stored user:", e);
                    localStorage.removeItem('mockUser'); // Clear invalid data
                }
            } else {
                console.log("No user found in storage.");
            }

            setUser(parsedUser); // Set user state (null if not found or error)
            setLoading(false); // Set loading false after check completes

            // Determine if redirect is needed *after* setting state
            const isAdminPath = pathname?.startsWith('/admin');
            const isLoginPage = pathname === '/login';
            if (!parsedUser && isAdminPath && !isLoginPage) {
                 console.log("Redirecting to login because no user and on admin path.");
                 shouldRedirect = true;
            }

             if (shouldRedirect) {
                 router.push('/login');
             }
        };

        checkAuth();

        // Cleanup function to set isMounted to false when component unmounts
        return () => {
            isMounted = false;
        };
    }, [pathname, router]); // Rerun check when path changes


    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        setLoading(true);
        console.log("Attempting login with:", username);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock authentication logic
        // 1. Check for hardcoded admin user
        if (username.toLowerCase() === 'admin' && password === 'password') { // Case-insensitive username check for admin
            const loggedInUser: AuthUser = { name: "Admin Utama", username: "admin", isAdmin: true };
            console.log("Login successful (Admin):", loggedInUser);
            setUser(loggedInUser);
            localStorage.setItem('mockUser', JSON.stringify(loggedInUser));
            setLoading(false);
            return true;
        }

        // 2. Check for petugas users stored in local storage
        const storedPetugas = localStorage.getItem('petugasAccounts');
        let petugasList: PetugasAccount[] = [];
        if (storedPetugas) {
            try {
                petugasList = JSON.parse(storedPetugas);
            } catch (e) {
                console.error("Error parsing stored petugas accounts:", e);
            }
        }

        // Find the petugas by username (case-insensitive match)
        const foundPetugas = petugasList.find(p => p.username.toLowerCase() === username.toLowerCase());

        if (foundPetugas) {
            // IMPORTANT: Comparing plain text passwords - highly insecure!
            if (foundPetugas.password === password) {
                const loggedInUser: AuthUser = {
                    name: foundPetugas.nama,
                    username: foundPetugas.username,
                    isAdmin: foundPetugas.isAdmin // Should be false for petugas
                };
                console.log("Login successful (Petugas):", loggedInUser);
                setUser(loggedInUser);
                localStorage.setItem('mockUser', JSON.stringify(loggedInUser));
                setLoading(false);
                return true;
            }
        }

        // 3. If neither admin nor a matching petugas is found
        console.log("Login failed: Invalid credentials");
        toast({
            title: "Login Gagal",
            description: "Username atau password salah.",
            variant: "destructive",
        });
        setUser(null); // Ensure user state is null on failed login
        localStorage.removeItem('mockUser'); // Clear any potentially leftover mockUser
        setLoading(false);
        return false;

    }, []); // Removed router dependency

    const logout = useCallback(async () => {
        setLoading(true);
        console.log("Logging out...");
        await new Promise(resolve => setTimeout(resolve, 300));
        setUser(null);
        localStorage.removeItem('mockUser');
        setLoading(false);
        console.log("Logout complete, redirecting to login.");
        router.push('/login');
    }, [router]);


     // Function to redirect if not authenticated (useful for protecting pages)
     // Ensure this only runs *after* the initial loading check is complete.
     const requireAuth = useCallback(() => {
        // Only check/redirect *after* the initial loading is done
        if (!loading) {
            const isAdminPath = pathname?.startsWith('/admin');
            const isLoginPage = pathname === '/login';
            if (!user && isAdminPath && !isLoginPage) {
                console.log("RequireAuth: Not logged in (after load), redirecting.");
                router.push('/login');
            } else if (user) {
                console.log(`RequireAuth: Status (after load) - Logged In: true (User: ${user.username}, Path: ${pathname})`);
            } else {
                 console.log(`RequireAuth: Status (after load) - Not logged in (Path: ${pathname}, Not redirecting as not on protected route)`);
            }
        } else {
            console.log("RequireAuth: Still loading auth state...");
        }
    }, [loading, user, pathname, router]); // Add router to dependencies


    // --- Placeholder Functions for Profile Management ---
    const updateUserProfile = useCallback(async (newName: string, newUsername: string): Promise<boolean> => {
        console.log("Attempting to update profile:", { newName, newUsername });
        await new Promise(resolve => setTimeout(resolve, 700));

        if (!user) return false;

        const storedPetugas = localStorage.getItem('petugasAccounts');
        let petugasList: PetugasAccount[] = [];
        if (storedPetugas) {
            try { petugasList = JSON.parse(storedPetugas); } catch (e) { console.error("Error parsing petugas list for update check:", e); }
        }

        const usernameTaken = (newUsername.toLowerCase() === 'admin' && user.username.toLowerCase() !== 'admin') ||
                              petugasList.some(p => p.username.toLowerCase() === newUsername.toLowerCase() && p.username.toLowerCase() !== user.username.toLowerCase());

        if (usernameTaken) {
             toast({ title: "Update Gagal", description: "Username sudah digunakan.", variant: "destructive" });
             return false;
        }

        const updatedUser = { ...user, name: newName, username: newUsername };
        setUser(updatedUser);
        localStorage.setItem('mockUser', JSON.stringify(updatedUser));

         if (!user.isAdmin) {
            const updatedPetugasList = petugasList.map(p =>
                p.username.toLowerCase() === user.username.toLowerCase() ? { ...p, username: newUsername, nama: newName } : p
            );
            localStorage.setItem('petugasAccounts', JSON.stringify(updatedPetugasList));
         }

        console.log("Profile updated locally:", updatedUser);
        return true;

    }, [user]);

    const changeUserPassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
        console.log("Attempting to change password...");
        await new Promise(resolve => setTimeout(resolve, 700));

         if (!user) return false;

         let correctCurrentPassword = false;

         if (user.isAdmin && user.username.toLowerCase() === 'admin' && currentPassword === 'password') {
             correctCurrentPassword = true;
             console.log("Password changed successfully for admin (mock).");
         } else if (!user.isAdmin) {
             const storedPetugas = localStorage.getItem('petugasAccounts');
             let petugasList: PetugasAccount[] = [];
              if (storedPetugas) {
                  try { petugasList = JSON.parse(storedPetugas); } catch (e) { console.error("Error parsing petugas list for password check:", e); }
              }
              const foundPetugas = petugasList.find(p => p.username.toLowerCase() === user.username.toLowerCase());

              if (foundPetugas && foundPetugas.password === currentPassword) {
                  correctCurrentPassword = true;
                  const updatedPetugasList = petugasList.map(p =>
                     p.username.toLowerCase() === user.username.toLowerCase() ? { ...p, password: newPassword } : p
                  );
                  localStorage.setItem('petugasAccounts', JSON.stringify(updatedPetugasList));
                  console.log("Password changed successfully for petugas (mock).");
              }
         }


        if (!correctCurrentPassword) {
             toast({ title: "Gagal", description: "Password saat ini salah.", variant: "destructive" });
             return false;
        }

        return true;
    }, [user]);
    // --- End Placeholder Functions ---


    return { user, loading, login, logout, requireAuth, updateUserProfile, changeUserPassword };
};
