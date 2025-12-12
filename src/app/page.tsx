"use client";

import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import type { GeneratorState, GeneratorAction } from '@/components/GeneratorCard';
import { GeneratorCard } from '@/components/GeneratorCard';
import { Fuel, PlusCircle, Weight, Calculator, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { TimeCalculatorDialog } from '@/components/TimeCalculatorDialog';
import { DetailedReportDialog } from '@/components/DetailedReportDialog';

const STORAGE_KEY_GENERATORS = 'fuelwise_generators_v6';
const STORAGE_KEY_COEFFICIENT = 'fuelwise_coefficient_v2';

const initialGenerators: GeneratorState[] = [
  { id: Date.now() + 1, name: 'Дизельний агрегат 1', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0, additionalExpenses: [] },
  { id: Date.now() + 2, name: 'Дизельний агрегат 2', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0, additionalExpenses: [] },
  { id: Date.now() + 3, name: 'Дизельний агрегат 3', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0, additionalExpenses: [] },
];

export default function HomePage() {
  const [generators, setGenerators] = useState<GeneratorState[]>([]);
  const [kgCoefficient, setKgCoefficient] = useState<number>(0.85);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Data Loading Effect ---
  useEffect(() => {
    try {
      const savedGenerators = localStorage.getItem(STORAGE_KEY_GENERATORS);
      const savedCoefficient = localStorage.getItem(STORAGE_KEY_COEFFICIENT);
      
      setGenerators(savedGenerators ? JSON.parse(savedGenerators) : initialGenerators);
      if (savedCoefficient) {
        setKgCoefficient(parseFloat(savedCoefficient));
      }
    } catch (error) {
      console.error("Could not read from localStorage:", error);
      setGenerators(initialGenerators);
    }
    setIsLoaded(true);
  }, []);

  // --- Data Saving Effect ---
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY_GENERATORS, JSON.stringify(generators));
        localStorage.setItem(STORAGE_KEY_COEFFICIENT, kgCoefficient.toString());
      } catch (error) {
        console.error("Could not write to localStorage:", error);
      }
    }
  }, [generators, kgCoefficient, isLoaded]);

  
  const handleGeneratorChange = (generatorId: string | number) => (action: GeneratorAction) => {
    setGenerators(prev =>
      prev.map(gen => {
        if (gen.id !== generatorId) {
          return gen;
        }

        let updatedGen: GeneratorState;

        switch (action.type) {
          case 'update_field':
            updatedGen = { ...gen, [action.payload.field]: action.payload.value };
            break;
          case 'add_expense':
            const newExpense = { id: Date.now(), name: 'Нова витрата', value: 0 };
            updatedGen = { ...gen, additionalExpenses: [...gen.additionalExpenses, newExpense] };
            break;
          case 'remove_expense':
            updatedGen = { ...gen, additionalExpenses: gen.additionalExpenses.filter(exp => exp.id !== action.payload.expenseId) };
            break;
          case 'update_expense': {
            const { expenseId, field, value } = action.payload;
            updatedGen = { ...gen, additionalExpenses: gen.additionalExpenses.map(exp => exp.id === expenseId ? { ...exp, [field]: value } : exp )};
            break;
          }
          default:
            updatedGen = gen;
        }
        
        return updatedGen;
      })
    );
  };

  const addGenerator = () => {
    const newGeneratorData: Omit<GeneratorState, 'id'> = {
      name: `Новий агрегат ${generators.length + 1}`,
      fuelRate: 0,
      initialFuel: 0,
      scheduledHours: 0,
      readinessHours: 0,
      relocation: 0,
      maintenance: 0,
      componentReplacement: 0,
      additionalExpenses: [],
    };
    
    setGenerators(prev => [...prev, { ...newGeneratorData, id: Date.now() }]);
  };

  const removeGenerator = (id: string | number) => {
      setGenerators(prev => prev.filter(gen => gen.id !== id));
  };
  
  const handleCoefficientChange = (value: number) => {
    setKgCoefficient(value);
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Завантаження...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 px-4 md:px-8 border-b bg-card">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Fuel className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">Калькулятор палива</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 flex-grow">
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
                    onChange={(e) => handleCoefficientChange(parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Цей коефіцієнт буде застосовано до всіх значень в літрах для розрахунку ваги.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 self-start md:self-center flex-wrap justify-end">
                <Button onClick={addGenerator}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Додати агрегат
                </Button>
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <BarChart3 className="mr-2 h-4 w-4" /> Детальний звіт
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DetailedReportDialog generators={generators} kgCoefficient={kgCoefficient} />
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Calculator className="mr-2 h-4 w-4" /> Калькулятор часу
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <TimeCalculatorDialog />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {generators.map(gen => (
            <GeneratorCard 
              key={gen.id} 
              generator={gen} 
              onUpdate={handleGeneratorChange(gen.id)} 
              onRemove={removeGenerator}
              kgCoefficient={kgCoefficient}
            />
          ))}
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        Created by Dmytro Oliinyk
      </footer>
    </div>
  );
}
