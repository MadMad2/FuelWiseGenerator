"use client";

import type { FC } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Fuel, Clock, Zap, Package, Trash2, PlusCircle, Truck, Pencil, Cog } from "lucide-react";

// Inline SVG for the rifle icon
export const RifleIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 4h3v4" />
    <path d="M17.5 11.5 22 7" />
    <path d="M15 9h.01" />
    <path d="m3 21 6-6" />
    <path d="m6 18 3.5-3.5" />
    <path d="m4 16 6-6" />
    <path d="M13.5 6.5 19 1" />
    <path d="m17 8 3-3" />
    <path d="M7.5 13.5 10 11" />
  </svg>
);


export interface AdditionalExpense {
  id: number;
  name: string;
  value: number;
}

export interface GeneratorState {
  id: number | string;
  name: string;
  fuelRate: number;
  initialFuel: number;
  scheduledHours: number;
  readinessHours: number;
  relocation: number;
  maintenance: number;
  componentReplacement: number;
  additionalExpenses: AdditionalExpense[];
}

export type GeneratorAction =
  | { type: 'update_field'; payload: { field: 'name'; value: string } }
  | { type: 'update_field'; payload: { field: 'fuelRate' | 'initialFuel' | 'scheduledHours' | 'readinessHours' | 'relocation' | 'maintenance' | 'componentReplacement'; value: number } }
  | { type: 'add_expense' }
  | { type: 'remove_expense'; payload: { expenseId: number } }
  | { type: 'update_expense'; payload: { expenseId: number; field: 'name'; value: string } }
  | { type: 'update_expense'; payload: { expenseId: number; field: 'value'; value: number } };

interface GeneratorCardProps {
  generator: GeneratorState;
  onUpdate: (action: GeneratorAction) => void;
  onRemove: (id: number | string) => void;
  kgCoefficient: number;
}

const KgDisplay: FC<{ value: number, coefficient: number }> = ({ value, coefficient }) => {
  if (coefficient <= 0 || !isFinite(value) || value === 0) return null;
  return <span className="text-xs text-destructive ml-2">({(value * coefficient).toFixed(2)} кг)</span>;
};

const TimeInput: FC<{
  id: string;
  label: string;
  totalHours: number;
  onChange: (totalHours: number) => void;
}> = ({ id, label, totalHours, onChange }) => {
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = parseInt(e.target.value, 10) || 0;
    onChange(newHours + minutes / 60);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinutes = parseInt(e.target.value, 10) || 0;
    if (newMinutes >= 60) newMinutes = 59;
    onChange(hours + newMinutes / 60);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-h`}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input id={`${id}-h`} type="number" value={hours === 0 ? '' : hours} onChange={handleHourChange} placeholder="Год" min="0" />
        <span className="text-muted-foreground">:</span>
        <Input id={`${id}-m`} type="number" value={minutes === 0 ? '' : minutes} onChange={handleMinuteChange} placeholder="Хв" max="59" min="0" />
      </div>
    </div>
  );
};

export const GeneratorCard: FC<GeneratorCardProps> = ({ generator, onUpdate, onRemove, kgCoefficient }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName) {
      nameInputRef.current?.focus();
    }
  }, [isEditingName]);
  
  const scheduledConsumption = (generator.scheduledHours || 0) * (generator.fuelRate || 0);
  const readinessConsumption = (generator.readinessHours || 0) * (generator.fuelRate || 0);
  const relocationConsumption = generator.relocation || 0;
  const maintenanceConsumption = generator.maintenance || 0;
  const componentReplacementConsumption = generator.componentReplacement || 0;
  const additionalConsumptionTotal = generator.additionalExpenses.reduce((acc, exp) => acc + (exp.value || 0), 0);

  const totalConsumption = scheduledConsumption + readinessConsumption + relocationConsumption + maintenanceConsumption + componentReplacementConsumption + additionalConsumptionTotal;
  const remainingFuel = (generator.initialFuel || 0) - totalConsumption;
  const remainingFuelPercentage = (generator.initialFuel || 0) > 0 ? (remainingFuel / generator.initialFuel) * 100 : 0;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ type: 'update_field', payload: { field: 'name', value: e.target.value }});
  };

  const handleInputChange = (field: 'fuelRate' | 'initialFuel' | 'relocation' | 'maintenance' | 'componentReplacement', value: string) => {
    const numValue = parseFloat(value);
    onUpdate({ type: 'update_field', payload: { field, value: isNaN(numValue) ? 0 : numValue } });
  };
  
  const handleTimeChange = (field: 'scheduledHours' | 'readinessHours', totalHours: number) => {
    onUpdate({ type: 'update_field', payload: { field, value: totalHours } });
  };

  const addExpense = () => {
    onUpdate({ type: 'add_expense' });
  };

  const removeExpense = (expenseId: number) => {
    onUpdate({ type: 'remove_expense', payload: { expenseId } });
  };
  
  const updateExpense = (expenseId: number, field: 'name' | 'value', rawValue: string) => {
    if (field === 'value') {
      const numValue = parseFloat(rawValue);
      onUpdate({ type: 'update_expense', payload: { expenseId, field, value: isNaN(numValue) ? 0 : numValue } });
    } else {
      onUpdate({ type: 'update_expense', payload: { expenseId, field, value: rawValue } });
    }
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-grow min-w-0">
            <Cog className="text-primary flex-shrink-0 animate-spin-slow" />
            {isEditingName ? (
              <Input
                ref={nameInputRef}
                value={generator.name}
                onChange={handleNameChange}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    setIsEditingName(false);
                  }
                }}
                className="text-2xl font-semibold leading-none tracking-tight border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              />
            ) : (
              <>
                <h2 className="text-2xl font-semibold leading-none tracking-tight truncate flex-grow cursor-pointer" onClick={() => setIsEditingName(true)}>{generator.name}</h2>
                <Button variant="ghost" size="icon" className="text-muted-foreground/50 hover:text-primary flex-shrink-0 h-auto w-auto p-0" onClick={() => setIsEditingName(true)}>
                  <Pencil className="size-4" />
                </Button>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => onRemove(generator.id)}>
            <Trash2 className="size-4" />
            <span className="sr-only">Видалити</span>
          </Button>
        </div>
        <CardDescription>Налаштуйте та відстежуйте цей генератор.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div className="space-y-2">
          <Label htmlFor={`fuelRate-${generator.id}`}>Витрата палива (л/год)</Label>
          <Input id={`fuelRate-${generator.id}`} type="number" value={generator.fuelRate || ''} onChange={(e) => handleInputChange('fuelRate', e.target.value)} placeholder="напр., 5.5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`initialFuel-${generator.id}`}>Початкове паливо (л)</Label>
          <Input id={`initialFuel-${generator.id}`} type="number" value={generator.initialFuel || ''} onChange={(e) => handleInputChange('initialFuel', e.target.value)} placeholder="напр., 1000" />
        </div>
        
        <TimeInput
          id={`scheduled-time-${generator.id}`}
          label="По графіку (год:хв)"
          totalHours={generator.scheduledHours}
          onChange={(totalHours) => handleTimeChange('scheduledHours', totalHours)}
        />
        
        <TimeInput
          id={`readiness-time-${generator.id}`}
          label="По готовності (год:хв)"
          totalHours={generator.readinessHours}
          onChange={(totalHours) => handleTimeChange('readinessHours', totalHours)}
        />

        <div className="space-y-2">
            <Label htmlFor={`relocation-${generator.id}`} className="flex items-center gap-2"><Truck className="size-4 text-muted-foreground"/>Переїзд (л)</Label>
            <Input id={`relocation-${generator.id}`} type="number" value={generator.relocation || ''} onChange={(e) => handleInputChange('relocation', e.target.value)} placeholder="напр., 50"/>
        </div>
        <div className="space-y-2">
            <Label htmlFor={`maintenance-${generator.id}`} className="flex items-center gap-2"><RifleIcon className="size-4 text-muted-foreground"/>МВГ (л)</Label>
            <Input id={`maintenance-${generator.id}`} type="number" value={generator.maintenance || ''} onChange={(e) => handleInputChange('maintenance', e.target.value)} placeholder="напр., 10"/>
        </div>
        <div className="space-y-2 col-span-1 md:col-span-2">
            <Label htmlFor={`componentReplacement-${generator.id}`} className="flex items-center gap-2"><Package className="size-4 text-muted-foreground"/>АМКП (л)</Label>
            <Input id={`componentReplacement-${generator.id}`} type="number" value={generator.componentReplacement || ''} onChange={(e) => handleInputChange('componentReplacement', e.target.value)} placeholder="напр., 5"/>
        </div>

        <div className="space-y-4 col-span-1 md:col-span-2">
          <Separator />
          <div className="flex justify-between items-center pt-2">
            <h4 className="font-semibold text-base">Додаткові витрати</h4>
            <Button variant="outline" size="sm" onClick={addExpense}>
              <PlusCircle className="mr-2 size-4" /> Додати
            </Button>
          </div>
          <div className="space-y-3">
            {generator.additionalExpenses.map(exp => (
              <div key={exp.id} className="flex items-end gap-2">
                <div className="flex-grow space-y-1 relative">
                  <Label htmlFor={`exp-name-${exp.id}`} className="sr-only">Назва витрати</Label>
                  <Input
                    id={`exp-name-${exp.id}`}
                    type="text"
                    value={exp.name}
                    onChange={(e) => updateExpense(exp.id, 'name', e.target.value)}
                    placeholder="Назва витрати"
                    className="pr-8"
                  />
                  <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 pointer-events-none" />
                </div>
                <div className="w-28 shrink-0 space-y-1">
                  <Label htmlFor={`exp-value-${exp.id}`} className="sr-only">Витрата (л)</Label>
                  <Input
                    id={`exp-value-${exp.id}`}
                    type="number"
                    value={exp.value || ''}
                    onChange={(e) => updateExpense(exp.id, 'value', e.target.value)}
                    placeholder="Літри"
                  />
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeExpense(exp.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {generator.additionalExpenses.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">Немає додаткових витрат.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-4">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Залишок палива</span>
            <span className="font-medium flex items-baseline">{remainingFuel < 0 ? '0.00' : remainingFuel.toFixed(2)} л <KgDisplay value={remainingFuel < 0 ? 0 : remainingFuel} coefficient={kgCoefficient} /></span>
          </div>
          <Progress value={remainingFuelPercentage < 0 ? 0 : remainingFuelPercentage} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
        </div>
        <Separator />
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground"><Clock className="size-4" /> По графіку:</div>
          <div className="text-right font-mono flex items-baseline justify-end">{scheduledConsumption.toFixed(2)} л <KgDisplay value={scheduledConsumption} coefficient={kgCoefficient} /></div>
          
          <div className="flex items-center gap-2 text-muted-foreground"><Zap className="size-4" /> По готовності:</div>
          <div className="text-right font-mono flex items-baseline justify-end">{readinessConsumption.toFixed(2)} л <KgDisplay value={readinessConsumption} coefficient={kgCoefficient} /></div>
          
          <div className="flex items-center gap-2 text-muted-foreground"><Truck className="size-4" /> Переїзд:</div>
          <div className="text-right font-mono flex items-baseline justify-end">{relocationConsumption.toFixed(2)} л <KgDisplay value={relocationConsumption} coefficient={kgCoefficient} /></div>
          
          <div className="flex items-center gap-2 text-muted-foreground"><RifleIcon className="size-4" /> МВГ:</div>
          <div className="text-right font-mono flex items-baseline justify-end">{maintenanceConsumption.toFixed(2)} л <KgDisplay value={maintenanceConsumption} coefficient={kgCoefficient} /></div>
          
          <div className="flex items-center gap-2 text-muted-foreground"><Package className="size-4" /> АМКП:</div>
          <div className="text-right font-mono flex items-baseline justify-end">{componentReplacementConsumption.toFixed(2)} л <KgDisplay value={componentReplacementConsumption} coefficient={kgCoefficient} /></div>

          {generator.additionalExpenses.filter(e => e.name.trim()).map(exp => (
             <React.Fragment key={exp.id}>
                <div className="flex items-center gap-2 text-muted-foreground truncate"><Pencil className="size-4" /> {exp.name}:</div>
                <div className="text-right font-mono flex items-baseline justify-end">{(exp.value || 0).toFixed(2)} л <KgDisplay value={exp.value || 0} coefficient={kgCoefficient} /></div>
             </React.Fragment>
          ))}
          
          <Separator className="my-1 col-span-2" />
          
          <div className="flex items-center gap-2 font-semibold"><Fuel className="size-4 text-accent" /> Всього використано:</div>
          <div className="text-right font-mono font-semibold flex items-baseline justify-end">{totalConsumption.toFixed(2)} л <KgDisplay value={totalConsumption} coefficient={kgCoefficient} /></div>
        </div>
      </CardFooter>
    </Card>
  );
};
