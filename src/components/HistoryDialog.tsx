"use client";

import type { FC } from 'react';
import React from 'react';
import type { GeneratorState } from '@/components/GeneratorCard';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Fuel, Clock, Zap, Truck, Package, Pencil, CheckCircle, XCircle, Inbox, BookMarked, Trash2 } from "lucide-react";
import { RifleIcon } from "@/components/GeneratorCard";
import { Button } from './ui/button';

export interface HistoryEntry {
  id: number;
  timestamp: string;
  note: string;
  generators: GeneratorState[];
  kgCoefficient: number;
}

interface HistoryDialogProps {
  history: HistoryEntry[];
  onDelete: (id: number) => void;
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

const HistoryReport: FC<{ entry: HistoryEntry }> = ({ entry }) => {
  const { generators, kgCoefficient } = entry;

  return (
     <Accordion type="multiple" className="w-full">
            {generators.map(gen => {
                const consumptions = calculateConsumption(gen);
                const hasEnoughFuel = consumptions.remaining >= 0;

                return (
                    <AccordionItem value={`hist-gen-${gen.id}`} key={`hist-gen-${gen.id}`}>
                        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md transition-colors -mx-4 text-sm">
                            <div className="flex justify-between items-center w-full pr-2">
                                <span className="font-semibold truncate flex-1 text-left">{gen.name}</span>
                                <div className="flex items-center gap-3 text-xs">
                                    <div className="text-right">
                                        <span className="text-muted-foreground">Залишок:</span>
                                        <span className={`font-mono ml-2 ${hasEnoughFuel ? '' : 'text-destructive'}`}>{consumptions.remaining.toFixed(2)} л</span>
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 px-4 py-2 bg-muted/50 rounded-md">
                                <div className="sm:col-span-2 flex justify-between items-baseline text-sm sm:text-base font-semibold">
                                    <div className="flex items-center gap-2"><Inbox className="size-4" />Початкове паливо:</div>
                                    <span className="font-mono flex items-baseline">{(gen.initialFuel || 0).toFixed(2)} л <KgDisplay value={gen.initialFuel || 0} coefficient={kgCoefficient} /></span>
                                </div>
                                <div className="sm:col-span-2 flex justify-between items-baseline text-sm sm:text-base font-semibold">
                                    <div className="flex items-center gap-2 text-accent"><Fuel className="size-4" /> Всього використано:</div>
                                    <div className="font-mono font-semibold flex items-baseline">{consumptions.total.toFixed(2)} л <KgDisplay value={consumptions.total} coefficient={kgCoefficient} /></div>
                                </div>
                                <div className="sm:col-span-2 flex justify-between items-baseline text-sm sm:text-base font-semibold">
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
  );
}

export const HistoryDialog: FC<HistoryDialogProps> = ({ history, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <BookMarked className="size-6 text-primary" />
          Журнал розрахунків
        </DialogTitle>
        <DialogDescription>
          Переглядайте та керуйте збереженими записами розрахунків.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto -mr-6 pr-6">
        {history.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {history.map(entry => (
              <AccordionItem value={`entry-${entry.id}`} key={entry.id} className="border rounded-md">
                <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md transition-colors text-base">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col text-left">
                      <span className="font-semibold">{formatDate(entry.timestamp)}</span>
                      {entry.note && <span className="text-sm font-normal text-muted-foreground">{entry.note}</span>}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t">
                  <HistoryReport entry={entry} />
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="mt-4">
                          <Trash2 className="mr-2 h-4 w-4" /> Видалити запис
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Цю дію неможливо скасувати. Це назавжди видалить запис із журналу.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Скасувати</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(entry.id)}>Видалити</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-center py-8">Журнал порожній. Збережіть детальний звіт, щоб створити перший запис.</p>
        )}
      </div>
    </>
  );
};
