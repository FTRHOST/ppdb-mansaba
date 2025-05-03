
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

// Mock user data structure
interface AuthUser {
    name: string;
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
            const loggedInUser: AuthUser = { name: "Admin User", isAdmin: true };
            console.log("Login successful:", loggedInUser);
            setUser(loggedInUser);
            // Store user in local storage for persistence (REMOVE in real app)
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
    }, []);

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
        if (!loading && !user && window.location.pathname.startsWith('/admin')) {
            console.log("RequireAuth: Not logged in, redirecting.");
            router.push('/login');
        } else {
             console.log(`RequireAuth: Status - Loading: ${loading}, User: ${!!user}`);
        }
    }, [loading, user, router]);

    return { user, loading, login, logout, requireAuth };
};

