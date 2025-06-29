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
          Overall Summary
        </CardTitle>
        <CardDescription>Total consumption and cost across all units.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2"><Droplets className="size-4 text-accent"/>Fuel Consumption</h4>
            <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Total Scheduled:</p>
                <p className="font-mono">{totalScheduledConsumption.toFixed(2)} L</p>
            </div>
            <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Total On-Demand:</p>
                <p className="font-mono">{totalReadinessConsumption.toFixed(2)} L</p>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
                <p>Total Used:</p>
                <p className="font-mono">{grandTotalConsumption.toFixed(2)} L</p>
            </div>
        </div>

        <Separator />

        <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2"><Banknote className="size-4 text-accent" />Costs</h4>
            <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Total Fuel Cost:</p>
                <p className="font-mono">${totalFuelCost.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Additional Expenses:</p>
                <p className="font-mono">${totalAdditionalExpenses.toFixed(2)}</p>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-lg text-primary">
                <p>Grand Total:</p>
                <p className="font-mono">${grandTotalCost.toFixed(2)}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};
