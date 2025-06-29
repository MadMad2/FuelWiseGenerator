"use client";

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Truck, Wrench, Package } from "lucide-react";

export interface ExpenseState {
  fuelPrice: number;
  transportation: number;
  mvg: number; // Maintenance
  amkp: number; // Component Replacement
}

interface ExpenseCardProps {
  expenses: ExpenseState;
  onUpdate: (field: keyof ExpenseState, value: number) => void;
}

export const ExpenseCard: FC<ExpenseCardProps> = ({ expenses, onUpdate }) => {
  const handleInputChange = (field: keyof ExpenseState, value: string) => {
    const numValue = parseFloat(value);
    onUpdate(field, isNaN(numValue) ? 0 : numValue);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="text-primary" />
          Витрати та вартість
        </CardTitle>
        <CardDescription>Встановіть ціну на паливо та додайте інші операційні витрати.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fuelPrice">Ціна палива (за літр)</Label>
          <Input id="fuelPrice" type="number" value={expenses.fuelPrice || ''} onChange={(e) => handleInputChange('fuelPrice', e.target.value)} placeholder="напр., 55.50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transportation" className="flex items-center gap-2"><Truck className="size-4 text-muted-foreground" />Транспортування</Label>
          <Input id="transportation" type="number" value={expenses.transportation || ''} onChange={(e) => handleInputChange('transportation', e.target.value)} placeholder="напр., 500" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mvg" className="flex items-center gap-2"><Wrench className="size-4 text-muted-foreground" />Обслуговування (МВГ)</Label>
          <Input id="mvg" type="number" value={expenses.mvg || ''} onChange={(e) => handleInputChange('mvg', e.target.value)} placeholder="напр., 200" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amkp" className="flex items-center gap-2"><Package className="size-4 text-muted-foreground" />Компоненти (АМКП)</Label>
          <Input id="amkp" type="number" value={expenses.amkp || ''} onChange={(e) => handleInputChange('amkp', e.target.value)} placeholder="напр., 150" />
        </div>
      </CardContent>
    </Card>
  );
};
