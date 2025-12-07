"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase/provider';

// This is a placeholder hook. 
// The actual useUser hook is now part of the provider.tsx
// but we need to keep this file for existing imports.

export const useUser = () => {
    const { user, isUserLoading, userError } = useFirebase();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && user) {
            // If user is logged in, and tries to access a public page like login/signup,
            // you might want to redirect them to the dashboard.
            // This logic depends on where you use the hook.
            // For a protected route component, the logic would be:
             if (window.location.pathname === '/' || window.location.pathname === '/signup') {
               router.push('/dashboard');
             }
        } else if (!isUserLoading && !user) {
            // If user is not logged in, and is not on a public page, redirect to login.
             if (window.location.pathname !== '/' && window.location.pathname !== '/signup') {
                router.push('/');
             }
        }
    }, [user, isUserLoading, router]);

    return { user, isUserLoading, userError };
};
