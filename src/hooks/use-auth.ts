
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
                     if (window.location.pathname.startsWith('/admin')) {
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
                 if (window.location.pathname.startsWith('/admin')) {
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
        if (username === 'admin' && password === 'password') {
            const loggedInUser: AuthUser = { name: "Admin Utama", username: "admin", isAdmin: true };
            console.log("Login successful (Admin):", loggedInUser);
            setUser(loggedInUser);
            localStorage.setItem('mockUser', JSON.stringify(loggedInUser));
            setLoading(false);
            return true;
         } else if (username === 'petugas' && password === 'password') { // Add petugas user
             const loggedInUser: AuthUser = { name: "Petugas PPDB", username: "petugas", isAdmin: false };
             console.log("Login successful (Petugas):", loggedInUser);
             setUser(loggedInUser);
             localStorage.setItem('mockUser', JSON.stringify(loggedInUser));
             setLoading(false);
             return true;
        } else {
            console.log("Login failed: Invalid credentials");
            toast({
                title: "Login Gagal",
                description: "Username atau password salah.",
                variant: "destructive",
            });
            setLoading(false);
            return false;
        }
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
            if (!user && window.location.pathname.startsWith('/admin')) {
                console.log("RequireAuth: Not logged in, redirecting.");
                router.push('/login');
            } else {
                console.log(`RequireAuth: Status - Logged In: ${!!user}`);
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

        // Mock logic: Assume username 'admin_new' is taken
        if (newUsername === 'admin_new') {
             toast({ title: "Update Gagal", description: "Username sudah digunakan.", variant: "destructive" });
             return false;
        }

        if (user) {
            const updatedUser = { ...user, name: newName, username: newUsername };
            setUser(updatedUser);
            localStorage.setItem('mockUser', JSON.stringify(updatedUser)); // Update mock storage
            console.log("Profile updated locally:", updatedUser);
            return true;
        }
        return false; // Should not happen if called when logged in
    }, [user]);

    const changeUserPassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
        // --- TODO: Implement actual API call to change password ---
        console.log("Attempting to change password...");
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

        // Mock logic: Assume current password is 'password'
        if (currentPassword !== 'password') { // Replace 'password' with check against actual current password hash in real app
             toast({ title: "Gagal", description: "Password saat ini salah.", variant: "destructive" });
             return false;
        }

        // Simulate successful password change
        console.log("Password changed successfully (mock).");
        // In a real app, the backend handles the change. No local user state change needed usually.
        return true;
    }, []);
    // --- End Placeholder Functions ---


    return { user, loading, login, logout, requireAuth, updateUserProfile, changeUserPassword };
};
