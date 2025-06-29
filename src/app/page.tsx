"use client";

import { useState, useMemo } from 'react';
import type { GeneratorState } from '@/components/GeneratorCard';
import type { ExpenseState } from '@/components/ExpenseCard';
import { GeneratorCard } from '@/components/GeneratorCard';
import { ExpenseCard } from '@/components/ExpenseCard';
import { SummaryCard } from '@/components/SummaryCard';
import { Github, Fuel } from 'lucide-react';

const initialGenerators: GeneratorState[] = [
  { id: 1, name: 'Дизельний агрегат 1', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0 },
  { id: 2, name: 'Дизельний агрегат 2', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0 },
  { id: 3, name: 'Дизельний агрегат 3', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0 },
];

const initialExpenses: ExpenseState = {
  fuelPrice: 0,
  transportation: 0,
  mvg: 0,
  amkp: 0,
};

export default function Home() {
  const [generators, setGenerators] = useState<GeneratorState[]>(initialGenerators);
  const [expenses, setExpenses] = useState<ExpenseState>(initialExpenses);

  const handleGeneratorUpdate = (id: number, field: keyof GeneratorState, value: number | string) => {
    setGenerators(prev =>
      prev.map(gen => (gen.id === id ? { ...gen, [field]: value } : gen))
    );
  };

  const handleExpenseUpdate = (field: keyof ExpenseState, value: number) => {
    setExpenses(prev => ({ ...prev, [field]: value }));
  };

  const totals = useMemo(() => {
    const consumption = generators.map(g => ({
      scheduled: (g.scheduledHours || 0) * (g.fuelRate || 0),
      readiness: (g.readinessHours || 0) * (g.fuelRate || 0),
    }));

    const totalScheduledConsumption = consumption.reduce((acc, curr) => acc + curr.scheduled, 0);
    const totalReadinessConsumption = consumption.reduce((acc, curr) => acc + curr.readiness, 0);
    const grandTotalConsumption = totalScheduledConsumption + totalReadinessConsumption;

    const totalFuelCost = grandTotalConsumption * (expenses.fuelPrice || 0);
    const totalAdditionalExpenses = (expenses.transportation || 0) + (expenses.mvg || 0) + (expenses.amkp || 0);

    return {
      totalScheduledConsumption,
      totalReadinessConsumption,
      totalFuelCost,
      totalAdditionalExpenses,
    };
  }, [generators, expenses]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 md:px-8 border-b bg-card">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Fuel className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold font-headline text-primary">FuelWise Генератор</h1>
              <p className="text-sm text-muted-foreground">Калькулятор палива та вартості для дизельного генератора</p>
            </div>
          </div>
          <a href="https://github.com/firebase/genkit/tree/main/studio" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-6 w-6" />
          </a>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-8">
            {generators.map(gen => (
              <GeneratorCard key={gen.id} generator={gen} onUpdate={handleGeneratorUpdate} />
            ))}
          </div>
          <div className="flex flex-col gap-8 xl:sticky top-8">
            <ExpenseCard expenses={expenses} onUpdate={handleExpenseUpdate} />
            <SummaryCard {...totals} />
          </div>
        </div>
      </main>

      <footer className="text-center p-4 text-sm text-muted-foreground border-t mt-8 bg-card">
          Створено за допомогою Next.js та ShadCN UI.
      </footer>
    </div>
  );
}
