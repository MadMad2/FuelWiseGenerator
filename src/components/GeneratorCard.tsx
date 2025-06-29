"use client";

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Fuel, Cog, Clock, Zap, Truck, Wrench, Package } from "lucide-react";

export interface GeneratorState {
  id: number;
  name: string;
  fuelRate: number;
  initialFuel: number;
  scheduledHours: number;
  readinessHours: number;
  relocation: number;
  maintenance: number;
  componentReplacement: number;
}

interface GeneratorCardProps {
  generator: GeneratorState;
  onUpdate: (id: number, field: keyof GeneratorState, value: number | string) => void;
}

export const GeneratorCard: FC<GeneratorCardProps> = ({ generator, onUpdate }) => {
  const scheduledConsumption = (generator.scheduledHours || 0) * (generator.fuelRate || 0);
  const readinessConsumption = (generator.readinessHours || 0) * (generator.fuelRate || 0);
  const relocationConsumption = generator.relocation || 0;
  const maintenanceConsumption = generator.maintenance || 0;
  const componentReplacementConsumption = generator.componentReplacement || 0;

  const totalConsumption = scheduledConsumption + readinessConsumption + relocationConsumption + maintenanceConsumption + componentReplacementConsumption;
  const remainingFuel = (generator.initialFuel || 0) - totalConsumption;
  const remainingFuelPercentage = (generator.initialFuel || 0) > 0 ? (remainingFuel / generator.initialFuel) * 100 : 0;

  const handleInputChange = (field: keyof GeneratorState, value: string) => {
    const numValue = parseFloat(value);
    onUpdate(generator.id, field, isNaN(numValue) ? 0 : numValue);
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cog className="text-primary" />
          {generator.name}
        </CardTitle>
        <CardDescription>Налаштуйте та відстежуйте цей генератор.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`fuelRate-${generator.id}`}>Витрата палива (л/год)</Label>
          <Input id={`fuelRate-${generator.id}`} type="number" value={generator.fuelRate || ''} onChange={(e) => handleInputChange('fuelRate', e.target.value)} placeholder="напр., 5.5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`initialFuel-${generator.id}`}>Початкове паливо (л)</Label>
          <Input id={`initialFuel-${generator.id}`} type="number" value={generator.initialFuel || ''} onChange={(e) => handleInputChange('initialFuel', e.target.value)} placeholder="напр., 1000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`scheduledHours-${generator.id}`}>Планові години</Label>
          <Input id={`scheduledHours-${generator.id}`} type="number" value={generator.scheduledHours || ''} onChange={(e) => handleInputChange('scheduledHours', e.target.value)} placeholder="напр., 8" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`readinessHours-${generator.id}`}>Години за вимогою</Label>
          <Input id={`readinessHours-${generator.id}`} type="number" value={generator.readinessHours || ''} onChange={(e) => handleInputChange('readinessHours', e.target.value)} placeholder="напр., 24" />
        </div>
        <div className="space-y-2">
            <Label htmlFor={`relocation-${generator.id}`} className="flex items-center gap-2"><Truck className="size-4 text-muted-foreground"/>Переїзд (л)</Label>
            <Input id={`relocation-${generator.id}`} type="number" value={generator.relocation || ''} onChange={(e) => handleInputChange('relocation', e.target.value)} placeholder="напр., 50"/>
        </div>
        <div className="space-y-2">
            <Label htmlFor={`maintenance-${generator.id}`} className="flex items-center gap-2"><Wrench className="size-4 text-muted-foreground"/>МВГ (л)</Label>
            <Input id={`maintenance-${generator.id}`} type="number" value={generator.maintenance || ''} onChange={(e) => handleInputChange('maintenance', e.target.value)} placeholder="напр., 10"/>
        </div>
        <div className="space-y-2">
            <Label htmlFor={`componentReplacement-${generator.id}`} className="flex items-center gap-2"><Package className="size-4 text-muted-foreground"/>АМКП (л)</Label>
            <Input id={`componentReplacement-${generator.id}`} type="number" value={generator.componentReplacement || ''} onChange={(e) => handleInputChange('componentReplacement', e.target.value)} placeholder="напр., 5"/>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-4">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Залишок палива</span>
            <span className="font-medium">{remainingFuel < 0 ? 0 : remainingFuel.toFixed(2)} л</span>
          </div>
          <Progress value={remainingFuelPercentage} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
        </div>
        <Separator />
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground"><Clock className="size-4" /> Планове використання:</div>
          <div className="text-right font-mono">{scheduledConsumption.toFixed(2)} л</div>
          <div className="flex items-center gap-2 text-muted-foreground"><Zap className="size-4" /> Використання за вимогою:</div>
          <div className="text-right font-mono">{readinessConsumption.toFixed(2)} л</div>
          <div className="flex items-center gap-2 text-muted-foreground"><Truck className="size-4" /> Переїзд:</div>
          <div className="text-right font-mono">{relocationConsumption.toFixed(2)} л</div>
          <div className="flex items-center gap-2 text-muted-foreground"><Wrench className="size-4" /> МВГ:</div>
          <div className="text-right font-mono">{maintenanceConsumption.toFixed(2)} л</div>
          <div className="flex items-center gap-2 text-muted-foreground"><Package className="size-4" /> АМКП:</div>
          <div className="text-right font-mono">{componentReplacementConsumption.toFixed(2)} л</div>
          <Separator className="my-1 col-span-2" />
          <div className="flex items-center gap-2 font-semibold"><Fuel className="size-4 text-accent" /> Всього використано:</div>
          <div className="text-right font-mono font-semibold">{totalConsumption.toFixed(2)} л</div>
        </div>
      </CardFooter>
    </Card>
  );
};
