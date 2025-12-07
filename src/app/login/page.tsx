"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { Fuel, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    // Non-blocking call
    initiateEmailSignIn(auth, email, password)
      .catch((error: any) => {
        console.error("Sign in error", error);
        toast({
          variant: "destructive",
          title: "Помилка входу",
          description: "Не вдалося увійти. Перевірте ваші дані.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
       <div className="absolute top-6 left-6 flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <Fuel className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">Калькулятор палива</h1>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Вхід</CardTitle>
          <CardDescription>
            Введіть ваші дані для входу в обліковий запис.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Пароль</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Вхід...' : 'Увійти'}
            </Button>
             <Button variant="outline" className="w-full" type="button" onClick={() => router.push('/signup')}>
              Немає акаунту? Зареєструватися
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
