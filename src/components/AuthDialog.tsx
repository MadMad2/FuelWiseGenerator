"use client";

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp, initiateGoogleSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from './ui/separator';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.1v2.7h5.1c-.2 1-1.5 3.2-5.1 3.2-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6c1.4 0 2.6.5 3.6 1.4l2.1-2.1C15.2 3.5 13.2 2.4 11.2 2.4c-4.9 0-9 4.1-9 9s4.1 9 9 9c5.1 0 8.5-3.6 8.5-8.8c0-.5-.1-1.1-.2-1.5z"/></svg>
);

export function AuthDialog() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loading, setLoading] = useState<null | 'login' | 'signup' | 'google'>(null);

  const auth = useAuth();
  const { toast } = useToast();

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading('login');
    initiateEmailSignIn(auth, loginEmail, loginPassword)
      .catch((error: any) => {
        console.error("Sign in error", error);
        toast({
          variant: "destructive",
          title: "Помилка входу",
          description: error.message || "Не вдалося увійти. Перевірте ваші дані.",
        });
      })
      .finally(() => {
        setLoading(null);
      });
  };

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading('signup');
    initiateEmailSignUp(auth, signupEmail, signupPassword)
      .catch((error: any) => {
        console.error("Sign up error", error);
        toast({
          variant: "destructive",
          title: "Помилка реєстрації",
          description: error.message || "Акаунт з такою поштою вже існує або пароль занадто короткий.",
        });
      })
      .finally(() => {
        setLoading(null);
      });
  };
  
  const handleGoogleSignIn = () => {
    if (!auth) return;
    setLoading('google');
    initiateGoogleSignIn(auth)
      .catch((error: any) => {
        console.error("Google sign in error", error);
        toast({
          variant: "destructive",
          title: "Помилка входу через Google",
          description: error.message || "Не вдалося увійти. Спробуйте інший спосіб.",
        });
      })
      .finally(() => {
        setLoading(null);
      });
  };

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Вхід</TabsTrigger>
        <TabsTrigger value="signup">Реєстрація</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Вхід</CardTitle>
            <CardDescription>
              Увійдіть у свій акаунт, щоб синхронізувати дані.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={!!loading}>
                {loading === 'google' ? 'Обробка...' : <><GoogleIcon /><span className='ml-2'>Увійти через Google</span></>}
            </Button>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Або</span>
                </div>
            </div>
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={!!loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={!!loading}
                />
              </div>
               <Button type="submit" className="w-full" disabled={!!loading}>
                {loading === 'login' ? 'Вхід...' : 'Увійти'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Реєстрація</CardTitle>
            <CardDescription>
              Створіть акаунт, щоб зберігати дані в хмарі.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="grid gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                    id="signup-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    disabled={!!loading}
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="signup-password">Пароль (мін. 6 символів)</Label>
                <Input
                    id="signup-password"
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    disabled={!!loading}
                />
                </div>
                <Button type="submit" className="w-full" disabled={!!loading}>
                    {loading === 'signup' ? 'Створення...' : 'Створити акаунт'}
                </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
