"use client";

import type { FC } from 'react';
import React from 'react';
import type { GeneratorState } from '@/components/GeneratorCard';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Fuel, Clock, Zap, Truck, Package, Pencil, BarChart3, CheckCircle, XCircle } from "lucide-react";
import { RifleIcon } from "@/components/GeneratorCard";

interface DetailedReportDialogProps {
  generators: GeneratorState[];
  kgCoefficient: number;
}

const KgDisplay: FC<{ value: number, coefficient: number }> = ({ value, coefficient }) => {
  if (coefficient <= 0 || !isFinite(value) || value === 0) return null;
  const kgValue = value * coefficient;
  if (kgValue < 0) return null;
  return <span className="text-xs text-destructive ml-2">({kgValue.toFixed(2)} кг)</span>;
};

const calculateConsumption = (gen: GeneratorState) => {
    const scheduled = (gen.scheduledHours || 0) * (gen.fuelRate || 0);
    const readiness = (gen.readinessHours || 0) * (gen.fuelRate || 0);
    const relocation = gen.relocation || 0;
    const maintenance = gen.maintenance || 0;
    const componentReplacement = gen.componentReplacement || 0;
    const additional = (gen.additionalExpenses || []).reduce((sum, exp) => sum + (exp.value || 0), 0);
    const total = scheduled + readiness + relocation + maintenance + componentReplacement + additional;
    const remaining = (gen.initialFuel || 0) - total;
    
    return { scheduled, readiness, relocation, maintenance, componentReplacement, additional, total, remaining };
}

export const DetailedReportDialog: FC<DetailedReportDialogProps> = ({ generators, kgCoefficient }) => {

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <BarChart3 className="size-6 text-primary" />
          Детальний звіт
        </DialogTitle>
        <DialogDescription>
          Розгорнутий звіт по кожному агрегату.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto -mr-6 pr-6">
        <Accordion type="multiple" className="w-full">
            {generators.map(gen => {
                const consumptions = calculateConsumption(gen);
                const hasEnoughFuel = consumptions.remaining >= 0;

                return (
                    <AccordionItem value={String(gen.id)} key={gen.id}>
                        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md transition-colors -mx-4">
                            <div className="flex justify-between items-center w-full pr-2">
                                <span className="font-semibold text-base truncate flex-1 text-left">{gen.name}</span>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="text-right">
                                        <span className="text-muted-foreground">Залишок:</span>
                                        <span className={`font-mono ml-2 ${hasEnoughFuel ? '' : 'text-destructive'}`}>{consumptions.remaining.toFixed(2)} л</span>
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 px-4 py-2 bg-muted/50 rounded-md">
                                <div className="sm:col-span-2 flex justify-between items-baseline text-base font-medium">
                                    <span>Початкове паливо:</span>
                                    <span className="font-mono flex items-baseline">{(gen.initialFuel || 0).toFixed(2)} л <KgDisplay value={gen.initialFuel || 0} coefficient={kgCoefficient} /></span>
                                </div>
                                <div className="sm:col-span-2 flex justify-between items-baseline text-base font-semibold">
                                    <div className="flex items-center gap-2"><Fuel className="size-4 text-accent" /> Всього використано:</div>
                                    <div className="font-mono font-semibold flex items-baseline">{consumptions.total.toFixed(2)} л <KgDisplay value={consumptions.total} coefficient={kgCoefficient} /></div>
                                </div>
                                <div className="sm:col-span-2 flex justify-between items-baseline text-base font-semibold">
                                    <div className={`flex items-center gap-2 ${hasEnoughFuel ? 'text-primary' : 'text-destructive'}`}>
                                        {hasEnoughFuel ? <CheckCircle className="size-4"/> : <XCircle className="size-4"/>}
                                        Залишок палива:
                                    </div>
                                    <div className="font-mono font-semibold flex items-baseline">{consumptions.remaining.toFixed(2)} л <KgDisplay value={consumptions.remaining} coefficient={kgCoefficient} /></div>
                                </div>
                                
                                <Separator className="my-1 sm:col-span-2" />
                                
                                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="size-4" /> По графіку:</div>
                                <div className="text-right font-mono flex items-baseline justify-end">{consumptions.scheduled.toFixed(2)} л <KgDisplay value={consumptions.scheduled} coefficient={kgCoefficient} /></div>
                                
                                <div className="flex items-center gap-2 text-muted-foreground"><Zap className="size-4" /> По готовності:</div>
                                <div className="text-right font-mono flex items-baseline justify-end">{consumptions.readiness.toFixed(2)} л <KgDisplay value={consumptions.readiness} coefficient={kgCoefficient} /></div>
                                
                                <div className="flex items-center gap-2 text-muted-foreground"><Truck className="size-4" /> Переїзд:</div>
                                <div className="text-right font-mono flex items-baseline justify-end">{consumptions.relocation.toFixed(2)} л <KgDisplay value={consumptions.relocation} coefficient={kgCoefficient} /></div>

                                <div className="flex items-center gap-2 text-muted-foreground"><RifleIcon className="size-4" /> МВГ:</div>
                                <div className="text-right font-mono flex items-baseline justify-end">{consumptions.maintenance.toFixed(2)} л <KgDisplay value={consumptions.maintenance} coefficient={kgCoefficient} /></div>

                                <div className="flex items-center gap-2 text-muted-foreground"><Package className="size-4" /> АМКП:</div>
                                <div className="text-right font-mono flex items-baseline justify-end">{consumptions.componentReplacement.toFixed(2)} л <KgDisplay value={consumptions.componentReplacement} coefficient={kgCoefficient} /></div>

                                {gen.additionalExpenses.filter(e => e.name.trim()).map(exp => (
                                    <React.Fragment key={exp.id}>
                                        <div className="flex items-center gap-2 text-muted-foreground truncate"><Pencil className="size-4" /> {exp.name}:</div>
                                        <div className="text-right font-mono flex items-baseline justify-end">{(exp.value || 0).toFixed(2)} л <KgDisplay value={exp.value || 0} coefficient={kgCoefficient} /></div>
                                    </React.Fragment>
                                ))}

                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
        
        {generators.length === 0 && (
            <p className="text-muted-foreground text-center py-8">Немає агрегатів для відображення звіту.</p>
        )}
      </div>
    </>
  );
};
