"use client";

import { useState, useEffect } from 'react';
import type { GeneratorState } from '@/components/GeneratorCard';
import { GeneratorCard } from '@/components/GeneratorCard';
import { Github, Fuel, PlusCircle, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialGenerators: GeneratorState[] = [
  { id: Date.now() + 1, name: 'Дизельний агрегат 1', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0 },
  { id: Date.now() + 2, name: 'Дизельний агрегат 2', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0 },
  { id: Date.now() + 3, name: 'Дизельний агрегат 3', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0 },
];

const STORAGE_KEY_GENERATORS = 'fuelwise_generators_v2';
const STORAGE_KEY_COEFFICIENT = 'fuelwise_coefficient_v1';

export default function Home() {
  const [generators, setGenerators] = useState<GeneratorState[]>([]);
  const [kgCoefficient, setKgCoefficient] = useState<number>(0.85);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedGenerators = localStorage.getItem(STORAGE_KEY_GENERATORS);
    const savedCoefficient = localStorage.getItem(STORAGE_KEY_COEFFICIENT);
    
    if (savedGenerators) {
      const parsedGenerators: Pick<GeneratorState, 'id' | 'name' | 'fuelRate'>[] = JSON.parse(savedGenerators);
      setGenerators(parsedGenerators.map(g => ({
        ...g,
        initialFuel: 0,
        scheduledHours: 0,
        readinessHours: 0,
        relocation: 0,
        maintenance: 0,
        componentReplacement: 0,
      })));
    } else {
      setGenerators(initialGenerators);
    }

    if (savedCoefficient) {
      setKgCoefficient(parseFloat(savedCoefficient));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const dataToSave = generators.map(({ id, name, fuelRate }) => ({ id, name, fuelRate }));
      localStorage.setItem(STORAGE_KEY_GENERATORS, JSON.stringify(dataToSave));
    }
  }, [generators, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_COEFFICIENT, kgCoefficient.toString());
    }
  }, [kgCoefficient, isLoaded]);

  const handleGeneratorUpdate = (id: number, field: keyof GeneratorState, value: number | string) => {
    setGenerators(prev =>
      prev.map(gen => (gen.id === id ? { ...gen, [field]: value } : gen))
    );
  };

  const addGenerator = () => {
    const newId = Date.now();
    const newGenerator: GeneratorState = {
      id: newId,
      name: `Новий агрегат ${generators.length + 1}`,
      fuelRate: 0,
      initialFuel: 0,
      scheduledHours: 0,
      readinessHours: 0,
      relocation: 0,
      maintenance: 0,
      componentReplacement: 0,
    };
    setGenerators(prev => [...prev, newGenerator]);
  };

  const removeGenerator = (id: number) => {
    setGenerators(prev => prev.filter(gen => gen.id !== id));
  };
  
  if (!isLoaded) {
    return null;
  }

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
        <div className="mb-8 p-6 bg-card rounded-lg border flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-grow space-y-2">
                <Label htmlFor="kgCoefficient" className="flex items-center gap-2 font-semibold">
                    <Weight className="size-5 text-primary"/>
                    Коефіцієнт переводу (л в кг)
                </Label>
                <Input
                    id="kgCoefficient"
                    type="number"
                    value={kgCoefficient || ''}
                    onChange={(e) => setKgCoefficient(parseFloat(e.target.value) || 0)}
                    placeholder="напр., 0.85"
                />
                <p className="text-xs text-muted-foreground">Цей коефіцієнт буде застосовано до всіх значень в літрах для розрахунку ваги.</p>
            </div>
            <Button onClick={addGenerator}>
              <PlusCircle className="mr-2 h-4 w-4" /> Додати агрегат
            </Button>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {generators.map(gen => (
            <GeneratorCard 
              key={gen.id} 
              generator={gen} 
              onUpdate={handleGeneratorUpdate} 
              onRemove={removeGenerator}
              kgCoefficient={kgCoefficient}
            />
          ))}
        </div>
      </main>

      <footer className="text-center p-4 text-sm text-muted-foreground border-t mt-8 bg-card">
          Створено за допомогою Next.js та ShadCN UI.
      </footer>
    </div>
  );
}
