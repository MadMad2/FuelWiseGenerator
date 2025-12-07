"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import type { GeneratorState, GeneratorAction } from '@/components/GeneratorCard';
import { GeneratorCard } from '@/components/GeneratorCard';
import { Fuel, PlusCircle, Weight, FileText, Clock, Zap, Truck, Wrench, Package, Pencil, Calculator, FileSignature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { TimeCalculatorDialog } from '@/components/TimeCalculatorDialog';
import { TextReportDialog } from '@/components/TextReportDialog';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

const initialGenerators: GeneratorState[] = [
  { id: Date.now() + 1, name: 'Дизельний агрегат 1', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0, additionalExpenses: [] },
  { id: Date.now() + 2, name: 'Дизельний агрегат 2', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0, additionalExpenses: [] },
  { id: Date.now() + 3, name: 'Дизельний агрегат 3', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0, additionalExpenses: [] },
];

const STORAGE_KEY_GENERATORS = 'fuelwise_generators_v4';
const STORAGE_KEY_COEFFICIENT = 'fuelwise_coefficient_v1';

const KgDisplay: FC<{ value: number, coefficient: number }> = ({ value, coefficient }) => {
  if (coefficient <= 0 || !isFinite(value) || value === 0) return null;
  return <span className="text-xs text-muted-foreground ml-2">({(value * coefficient).toFixed(2)} кг)</span>;
};

export default function Home() {
  const [generators, setGenerators] = useState<GeneratorState[]>([]);
  const [kgCoefficient, setKgCoefficient] = useState<number>(0.85);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedGenerators = localStorage.getItem(STORAGE_KEY_GENERATORS);
    const savedCoefficient = localStorage.getItem(STORAGE_KEY_COEFFICIENT);
    
    if (savedGenerators) {
      const parsedGenerators: Pick<GeneratorState, 'id' | 'name' | 'fuelRate' | 'additionalExpenses' | 'relocation' | 'maintenance' | 'componentReplacement'>[] = JSON.parse(savedGenerators);
      setGenerators(parsedGenerators.map(g => ({
        ...g,
        initialFuel: 0,
        scheduledHours: 0,
        readinessHours: 0,
        relocation: g.relocation || 0,
        maintenance: g.maintenance || 0,
        componentReplacement: g.componentReplacement || 0,
        additionalExpenses: g.additionalExpenses ? g.additionalExpenses.map(exp => ({ ...exp, value: 0 })) : [],
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
      const dataToSave = generators.map(({ id, name, fuelRate, additionalExpenses, relocation, maintenance, componentReplacement }) => ({
        id,
        name,
        fuelRate,
        relocation,
        maintenance,
        componentReplacement,
        additionalExpenses: additionalExpenses.map(({ id, name }) => ({ id, name, value: 0 })),
      }));
      localStorage.setItem(STORAGE_KEY_GENERATORS, JSON.stringify(dataToSave));
    }
  }, [generators, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_COEFFICIENT, kgCoefficient.toString());
    }
  }, [kgCoefficient, isLoaded]);
  
  const handleGeneratorChange = (generatorId: number) => (action: GeneratorAction) => {
    setGenerators(prev =>
      prev.map(gen => {
        if (gen.id !== generatorId) {
          return gen;
        }

        switch (action.type) {
          case 'update_field': {
            return { ...gen, [action.payload.field]: action.payload.value };
          }
          case 'add_expense': {
            const newExpense = { id: Date.now(), name: 'Нова витрата', value: 0 };
            return { ...gen, additionalExpenses: [...gen.additionalExpenses, newExpense] };
          }
          case 'remove_expense':
            return {
              ...gen,
              additionalExpenses: gen.additionalExpenses.filter(exp => exp.id !== action.payload.expenseId),
            };
          case 'update_expense': {
            const { expenseId, field, value } = action.payload;
            return {
              ...gen,
              additionalExpenses: gen.additionalExpenses.map(exp =>
                exp.id === expenseId ? { ...exp, [field]: value } : exp
              ),
            };
          }
          default:
            return gen;
        }
      })
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
      additionalExpenses: [],
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 px-4 md:px-8 border-b bg-card">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Fuel className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">Калькулятор палива</h1>
          </div>
          <ThemeSwitcher />
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
                    onChange={(e) => setKgCoefficient(parseFloat(e.target.value) || 0)}
                    placeholder="напр., 0.85"
                />
                <p className="text-xs text-muted-foreground">Цей коефіцієнт буде застосовано до всіх значень в літрах для розрахунку ваги.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 self-start md:self-center flex-wrap justify-end">
                <Button onClick={addGenerator}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Додати агрегат
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" disabled={generators.length === 0}>
                            <FileText className="mr-2 h-4 w-4" /> Показати звіт
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Звіт по агрегатам</DialogTitle>
                            <DialogDescription>
                                Детальний звіт по кожному з {generators.length} агрегатів.
                            </DialogDescription>
                        </DialogHeader>
                          <Accordion type="single" collapsible className="w-full max-h-[70vh] overflow-y-auto -mr-6 pr-6">
                              {generators.map(gen => {
                                  const scheduledConsumption = (gen.scheduledHours || 0) * (gen.fuelRate || 0);
                                  const readinessConsumption = (gen.readinessHours || 0) * (gen.fuelRate || 0);
                                  const relocationConsumption = gen.relocation || 0;
                                  const maintenanceConsumption = gen.maintenance || 0;
                                  const componentReplacementConsumption = gen.componentReplacement || 0;
                                  const additionalConsumptionTotal = gen.additionalExpenses.reduce((acc, exp) => acc + (exp.value || 0), 0);
                                  const totalConsumption = scheduledConsumption + readinessConsumption + relocationConsumption + maintenanceConsumption + componentReplacementConsumption + additionalConsumptionTotal;
                                  const remainingFuel = (gen.initialFuel || 0) - totalConsumption;
                                  
                                  return (
                                      <AccordionItem value={`item-${gen.id}`} key={gen.id}>
                                          <AccordionTrigger>
                                              <div className="flex justify-between items-center w-full pr-2">
                                                  <span className="font-semibold text-left">{gen.name}</span>
                                                  <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                                                      Використано: <span className="font-mono text-destructive">{totalConsumption.toFixed(2)} л</span>
                                                  </span>
                                              </div>
                                          </AccordionTrigger>
                                          <AccordionContent>
                                              <div className="text-sm space-y-4 pt-2">
                                                  <div className="grid grid-cols-1 gap-3 rounded-lg border p-4">
                                                      <div className="flex justify-between items-baseline">
                                                          <span className="text-muted-foreground">Початкове паливо:</span>
                                                          <span className="font-semibold flex items-baseline">{(gen.initialFuel || 0).toFixed(2)} л <KgDisplay value={gen.initialFuel || 0} coefficient={kgCoefficient} /></span>
                                                      </div>
                                                      <div className="flex justify-between items-baseline">
                                                          <span className="text-muted-foreground text-destructive">Всього використано:</span>
                                                          <span className="font-semibold text-destructive flex items-baseline">{totalConsumption.toFixed(2)} л <KgDisplay value={totalConsumption} coefficient={kgCoefficient} /></span>
                                                      </div>
                                                      <div className="flex justify-between items-baseline">
                                                          <span className="text-muted-foreground text-primary">Залишок палива:</span>
                                                          <span className="font-semibold text-primary flex items-baseline">{remainingFuel.toFixed(2)} л <KgDisplay value={remainingFuel} coefficient={kgCoefficient} /></span>
                                                      </div>
                                                  </div>
                                                  
                                                  <div className="space-y-2 p-4 border rounded-lg">
                                                      <h4 className="font-semibold -mx-4 -mt-4 mb-3 p-3 border-b bg-muted/50 rounded-t-lg">Деталізація витрат</h4>
                                                      <div className="flex justify-between items-baseline"><div className='flex items-center gap-2'><Clock className="size-4 text-muted-foreground" />По графіку:</div> <span className='font-mono flex items-baseline'>{scheduledConsumption.toFixed(2)} л <KgDisplay value={scheduledConsumption} coefficient={kgCoefficient} /></span></div>
                                                      <div className="flex justify-between items-baseline"><div className='flex items-center gap-2'><Zap className="size-4 text-muted-foreground" />По готовності:</div> <span className='font-mono flex items-baseline'>{readinessConsumption.toFixed(2)} л <KgDisplay value={readinessConsumption} coefficient={kgCoefficient} /></span></div>
                                                      <div className="flex justify-between items-baseline"><div className='flex items-center gap-2'><Truck className="size-4 text-muted-foreground" />Переїзд:</div> <span className='font-mono flex items-baseline'>{relocationConsumption.toFixed(2)} л <KgDisplay value={relocationConsumption} coefficient={kgCoefficient} /></span></div>
                                                      <div className="flex justify-between items-baseline"><div className='flex items-center gap-2'><Wrench className="size-4 text-muted-foreground" />МВГ:</div> <span className='font-mono flex items-baseline'>{maintenanceConsumption.toFixed(2)} л <KgDisplay value={maintenanceConsumption} coefficient={kgCoefficient} /></span></div>
                                                      <div className="flex justify-between items-baseline"><div className='flex items-center gap-2'><Package className="size-4 text-muted-foreground" />АМКП:</div> <span className='font-mono flex items-baseline'>{componentReplacementConsumption.toFixed(2)} л <KgDisplay value={componentReplacementConsumption} coefficient={kgCoefficient} /></span></div>
                                                      
                                                      {gen.additionalExpenses.filter(e => e.name.trim()).length > 0 && <Separator className="my-2"/>}

                                                      {gen.additionalExpenses.filter(e => e.name.trim()).map(exp => (
                                                         <div key={exp.id} className="flex justify-between items-baseline"><div className='flex items-center gap-2 truncate'><Pencil className="size-4 text-muted-foreground" />{exp.name}:</div> <span className='font-mono flex items-baseline whitespace-nowrap'>{(exp.value || 0).toFixed(2)} л <KgDisplay value={exp.value || 0} coefficient={kgCoefficient} /></span></div>
                                                      ))}
                                                  </div>
                                              </div>
                                          </AccordionContent>
                                      </AccordionItem>
                                  )
                              })}
                          </Accordion>
                          {generators.length === 0 && (
                               <p className="text-center text-muted-foreground py-8">Немає агрегатів для звіту.</p>
                          )}
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
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" disabled={generators.length === 0}>
                            <FileSignature className="mr-2 h-4 w-4" /> Текстовий звіт
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                       <TextReportDialog generators={generators} kgCoefficient={kgCoefficient} />
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
        Created Dmytro Oliinyk
      </footer>
    </div>
  );
}
