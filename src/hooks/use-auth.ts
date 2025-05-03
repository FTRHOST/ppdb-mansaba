'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Simulate fetching auth state on initial load
    useEffect(() => {
        setLoading(true);
        console.log("Checking auth status...");
        // Check local storage or session storage for mock login state
        const storedUser = localStorage.getItem('mockUser');
        if (storedUser) {
            try {
                const parsedUser: AuthUser = JSON.parse(storedUser);
                 // Simulate delay
                setTimeout(() => {
                    console.log("User found in storage:", parsedUser);
                    setUser(parsedUser);
                    setLoading(false);
                }, 500);
            } catch (e) {
                 console.error("Error parsing stored user:", e);
                 localStorage.removeItem('mockUser'); // Clear invalid data
                 // Simulate delay
                setTimeout(() => {
                     setLoading(false);
                     console.log("No user found or error parsing, redirecting to login.");
                     // Redirect if on an admin page and not logged in
                     if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
                         router.push('/login');
                     }
                 }, 500);
            }
        } else {
            // Simulate delay
            setTimeout(() => {
                 setLoading(false);
                 console.log("No user found in storage, redirecting to login.");
                 // Redirect if on an admin page and not logged in
                 if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
                     router.push('/login');
                 }
            }, 500);
        }
    }, [router]);

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        setLoading(true);
        console.log("Attempting login with:", username);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock authentication logic
        // 1. Check for hardcoded admin user
        if (username === 'admin' && password === 'password') {
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
                // Handle error appropriately, maybe clear the faulty data
            }
        }

        // Find the petugas by username (case-sensitive match)
        const foundPetugas = petugasList.find(p => p.username === username);

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
        setLoading(false);
        return false;

    }, [router]); // Added router dependency to useCallback

    const logout = useCallback(async () => {
        setLoading(true);
        console.log("Logging out...");
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        setUser(null);
        // Clear stored user data
        localStorage.removeItem('mockUser');
        setLoading(false);
        console.log("Logout complete, redirecting to login.");
        router.push('/login'); // Redirect to the login page
    }, [router]);


     // Function to redirect if not authenticated (useful for protecting pages)
     const requireAuth = useCallback(() => {
        // Check if loading is complete before potentially redirecting
        if (!loading) {
            if (!user && typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
                console.log("RequireAuth: Not logged in, redirecting.");
                router.push('/login');
            } else {
                 // Only log if not redirecting
                 if (user || (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin'))) {
                    console.log(`RequireAuth: Status - Logged In: ${!!user}`);
                 }
            }
        } else {
            console.log("RequireAuth: Still loading auth state...");
        }
    }, [loading, user, router]);


    // --- Placeholder Functions for Profile Management ---
    const updateUserProfile = useCallback(async (newName: string, newUsername: string): Promise<boolean> => {
        // --- TODO: Implement actual API call to update user profile ---
        console.log("Attempting to update profile:", { newName, newUsername });
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

        if (!user) return false; // Should not happen if called when logged in

        // Mock logic: Check if new username conflicts with admin or other petugas
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
        localStorage.setItem('mockUser', JSON.stringify(updatedUser)); // Update mock storage

        // Also update the username in the petugas list if the current user is a petugas
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
        // --- TODO: Implement actual API call to change password ---
        console.log("Attempting to change password...");
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

         if (!user) return false; // Should not happen if logged out

         let correctCurrentPassword = false;

         // Check admin password
         if (user.isAdmin && user.username === 'admin' && currentPassword === 'password') {
             correctCurrentPassword = true;
             // In a real app, you'd send current/new password to backend for admin
             console.log("Password changed successfully for admin (mock).");
         } else if (!user.isAdmin) {
             // Check petugas password from local storage
             const storedPetugas = localStorage.getItem('petugasAccounts');
             let petugasList: PetugasAccount[] = [];
              if (storedPetugas) {
                  try { petugasList = JSON.parse(storedPetugas); } catch (e) { console.error("Error parsing petugas list for password check:", e); }
              }
              const foundPetugas = petugasList.find(p => p.username.toLowerCase() === user.username.toLowerCase());

              // IMPORTANT: Comparing plain text - insecure!
              if (foundPetugas && foundPetugas.password === currentPassword) {
                  correctCurrentPassword = true;
                  // Update password in the mock storage
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

        // Simulate successful password change if current was correct
        return true;
    }, [user]);
    // --- End Placeholder Functions ---


    return { user, loading, login, logout, requireAuth, updateUserProfile, changeUserPassword };
};
