"use client";

import { useState } from 'react';
import type { GeneratorState } from '@/components/GeneratorCard';
import { GeneratorCard } from '@/components/GeneratorCard';
import { Github, Fuel } from 'lucide-react';

const initialGenerators: GeneratorState[] = [
  { id: 1, name: 'Дизельний агрегат 1', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0 },
  { id: 2, name: 'Дизельний агрегат 2', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0 },
  { id: 3, name: 'Дизельний агрегат 3', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0 },
];

export default function Home() {
  const [generators, setGenerators] = useState<GeneratorState[]>(initialGenerators);

  const handleGeneratorUpdate = (id: number, field: keyof GeneratorState, value: number | string) => {
    setGenerators(prev =>
      prev.map(gen => (gen.id === id ? { ...gen, [field]: value } : gen))
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 md:px-8 border-b bg-card">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Fuel className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold font-headline text-primary">FuelWise Генератор</h1>
              <p className="text-sm text-muted-foreground">Калькулятор палива для дизельних генераторів</p>
            </div>
          </div>
          <a href="https://github.com/firebase/genkit/tree/main/studio" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-6 w-6" />
          </a>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {generators.map(gen => (
            <GeneratorCard key={gen.id} generator={gen} onUpdate={handleGeneratorUpdate} />
          ))}
        </div>
      </main>

      <footer className="text-center p-4 text-sm text-muted-foreground border-t mt-8 bg-card">
          Створено за допомогою Next.js та ShadCN UI.
      </footer>
    </div>
  );
}
