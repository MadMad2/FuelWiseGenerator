'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<void> {
  return signInAnonymously(authInstance).then(() => {}).catch(err => {
    console.error("Anonymous sign-in failed", err);
    throw err;
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<void> {
  return createUserWithEmailAndPassword(authInstance, email, password).then(() => {}).catch(err => {
    console.error("Email sign-up failed", err);
    throw err;
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<void> {
  return signInWithEmailAndPassword(authInstance, email, password).then(() => {}).catch(err => {
    console.error("Email sign-in failed", err);
    throw err;
  });
}

/** Initiate Google sign-in (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(authInstance, provider).then(() => {}).catch(err => {
    console.error("Google sign-in failed", err);
    throw err;
  });
}
