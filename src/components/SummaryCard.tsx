"use client";

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClipboardList, Droplets, Banknote } from "lucide-react";

interface SummaryCardProps {
  totalScheduledConsumption: number;
  totalReadinessConsumption: number;
  totalFuelCost: number;
  totalAdditionalExpenses: number;
}

export const SummaryCard: FC<SummaryCardProps> = ({
  totalScheduledConsumption,
  totalReadinessConsumption,
  totalFuelCost,
  totalAdditionalExpenses,
}) => {
  const grandTotalConsumption = totalScheduledConsumption + totalReadinessConsumption;
  const grandTotalCost = totalFuelCost + totalAdditionalExpenses;

  return (
    <Card className="shadow-md bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="text-primary" />
          Загальний підсумок
        </CardTitle>
        <CardDescription>Загальне споживання та вартість по всіх агрегатах.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2"><Droplets className="size-4 text-accent"/>Споживання палива</h4>
            <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Загальне планове:</p>
                <p className="font-mono">{totalScheduledConsumption.toFixed(2)} л</p>
            </div>
            <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Загальне за вимогою:</p>
                <p className="font-mono">{totalReadinessConsumption.toFixed(2)} л</p>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
                <p>Всього використано:</p>
                <p className="font-mono">{grandTotalConsumption.toFixed(2)} л</p>
            </div>
        </div>

        <Separator />

        <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2"><Banknote className="size-4 text-accent" />Витрати</h4>
            <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Загальна вартість палива:</p>
                <p className="font-mono">${totalFuelCost.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Додаткові витрати:</p>
                <p className="font-mono">${totalAdditionalExpenses.toFixed(2)}</p>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-lg text-primary">
                <p>Загальна сума:</p>
                <p className="font-mono">${grandTotalCost.toFixed(2)}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};
