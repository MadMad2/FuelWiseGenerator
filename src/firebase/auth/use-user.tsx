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
        // This hook will no longer force redirections.
        // Page-level logic will handle that.
    }, [user, isUserLoading, router]);

    return { user, isUserLoading, userError };
};
