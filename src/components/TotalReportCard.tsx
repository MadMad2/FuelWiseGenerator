"use client";

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Fuel, Clock, Zap, Truck, Package, Pencil, BarChart3 } from "lucide-react";
import { RifleIcon } from "@/components/GeneratorCard"; // Assuming RifleIcon is exported

interface ReportData {
    initialFuel: number;
    scheduledConsumption: number;
    readinessConsumption: number;
    relocationConsumption: number;
    maintenanceConsumption: number;
    componentReplacementConsumption: number;
    additionalConsumption: number;
    totalConsumption: number;
}

interface TotalReportCardProps {
    data: ReportData;
    kgCoefficient: number;
}

const KgDisplay: FC<{ value: number, coefficient: number }> = ({ value, coefficient }) => {
  if (coefficient <= 0 || !isFinite(value) || value === 0) return null;
  return <span className="text-xs text-destructive ml-2">({(value * coefficient).toFixed(2)} кг)</span>;
};

export const TotalReportCard: FC<TotalReportCardProps> = ({ data, kgCoefficient }) => {
    const remainingFuel = data.initialFuel - data.totalConsumption;

    return (
        <Card className="w-full shadow-md">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    <CardTitle>Загальний звіт</CardTitle>
                </div>
                <CardDescription>Підсумок по всіх агрегатах</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="md:col-span-2 flex justify-between items-baseline text-base font-semibold mb-2">
                        <span>Початкове паливо (всього):</span>
                        <span className="font-mono flex items-baseline">{data.initialFuel.toFixed(2)} л <KgDisplay value={data.initialFuel} coefficient={kgCoefficient} /></span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground"><Clock className="size-4" /> По графіку:</div>
                    <div className="text-right font-mono flex items-baseline justify-end">{data.scheduledConsumption.toFixed(2)} л <KgDisplay value={data.scheduledConsumption} coefficient={kgCoefficient} /></div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground"><Zap className="size-4" /> По готовності:</div>
                    <div className="text-right font-mono flex items-baseline justify-end">{data.readinessConsumption.toFixed(2)} л <KgDisplay value={data.readinessConsumption} coefficient={kgCoefficient} /></div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground"><Truck className="size-4" /> Переїзд:</div>
                    <div className="text-right font-mono flex items-baseline justify-end">{data.relocationConsumption.toFixed(2)} л <KgDisplay value={data.relocationConsumption} coefficient={kgCoefficient} /></div>

                    <div className="flex items-center gap-2 text-muted-foreground"><RifleIcon className="size-4" /> МВГ:</div>
                    <div className="text-right font-mono flex items-baseline justify-end">{data.maintenanceConsumption.toFixed(2)} л <KgDisplay value={data.maintenanceConsumption} coefficient={kgCoefficient} /></div>

                    <div className="flex items-center gap-2 text-muted-foreground"><Package className="size-4" /> АМКП:</div>
                    <div className="text-right font-mono flex items-baseline justify-end">{data.componentReplacementConsumption.toFixed(2)} л <KgDisplay value={data.componentReplacementConsumption} coefficient={kgCoefficient} /></div>

                    <div className="flex items-center gap-2 text-muted-foreground"><Pencil className="size-4" /> Додаткові витрати:</div>
                    <div className="text-right font-mono flex items-baseline justify-end">{data.additionalConsumption.toFixed(2)} л <KgDisplay value={data.additionalConsumption} coefficient={kgCoefficient} /></div>

                    <Separator className="my-2 md:col-span-2" />
                    
                    <div className="md:col-span-2 flex justify-between items-baseline text-base font-semibold">
                        <div className="flex items-center gap-2"><Fuel className="size-4 text-accent" /> Всього використано:</div>
                        <div className="font-mono font-semibold flex items-baseline">{data.totalConsumption.toFixed(2)} л <KgDisplay value={data.totalConsumption} coefficient={kgCoefficient} /></div>
                    </div>
                    
                    <div className="md:col-span-2 flex justify-between items-baseline text-base font-semibold mt-2">
                        <span>Залишок палива (всього):</span>
                        <span className="font-mono flex items-baseline">{remainingFuel < 0 ? '0.00' : remainingFuel.toFixed(2)} л <KgDisplay value={remainingFuel < 0 ? 0 : remainingFuel} coefficient={kgCoefficient} /></span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
