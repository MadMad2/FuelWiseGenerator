"use client";

import { useState, useMemo, useRef } from 'react';
import type { GeneratorState } from '@/components/GeneratorCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileSignature, Copy, Droplets, Weight } from 'lucide-react';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface TextReportDialogProps {
    generators: GeneratorState[];
    kgCoefficient: number;
}

type ValueKey = 'initialFuel' | 'totalConsumption' | 'remainingFuel' | 'scheduledConsumption' | 'readinessConsumption' | 'relocation' | 'maintenance' | 'componentReplacement';
interface DynamicValue {
    key: ValueKey;
    label: string;
}

const DYNAMIC_VALUES: DynamicValue[] = [
    { key: 'initialFuel', label: 'Початкове паливо' },
    { key: 'totalConsumption', label: 'Всього використано' },
    { key: 'remainingFuel', label: 'Залишок палива' },
    { key: 'scheduledConsumption', label: 'Витрата по графіку' },
    { key: 'readinessConsumption', label: 'Витрата по готовності' },
    { key: 'relocation', label: 'Витрата на переїзд' },
    { key: 'maintenance', label: 'Витрата на МВГ' },
    { key: 'componentReplacement', label: 'Витрата на АМКП' },
];

const STORAGE_KEY_TEMPLATE = 'fuelwise_report_template_v1';

export const TextReportDialog = ({ generators, kgCoefficient }: TextReportDialogProps) => {
    const [template, setTemplate] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STORAGE_KEY_TEMPLATE) || `Звіт по агрегату {{gen.name}}:\n- Залишок палива: {{gen.remainingFuel.liters}} л ({{gen.remainingFuel.kg}} кг)`;
        }
        return '';
    });
    
    const { toast } = useToast();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const calculations = useMemo(() => {
        return generators.map(gen => {
            const scheduledConsumption = (gen.scheduledHours || 0) * (gen.fuelRate || 0);
            const readinessConsumption = (gen.readinessHours || 0) * (gen.fuelRate || 0);
            const relocation = gen.relocation || 0;
            const maintenance = gen.maintenance || 0;
            const componentReplacement = gen.componentReplacement || 0;
            const additionalConsumptionTotal = gen.additionalExpenses.reduce((acc, exp) => acc + (exp.value || 0), 0);
            const totalConsumption = scheduledConsumption + readinessConsumption + relocation + maintenance + componentReplacement + additionalConsumptionTotal;
            const remainingFuel = (gen.initialFuel || 0) - totalConsumption;

            const getValues = (value: number) => ({
                liters: value.toFixed(2),
                kg: (value * kgCoefficient).toFixed(2)
            });

            return {
                id: gen.id,
                name: gen.name,
                initialFuel: getValues(gen.initialFuel || 0),
                totalConsumption: getValues(totalConsumption),
                remainingFuel: getValues(remainingFuel),
                scheduledConsumption: getValues(scheduledConsumption),
                readinessConsumption: getValues(readinessConsumption),
                relocation: getValues(relocation),
                maintenance: getValues(maintenance),
                componentReplacement: getValues(componentReplacement),
                additionalExpenses: gen.additionalExpenses.map(exp => ({
                    id: exp.id,
                    name: exp.name,
                    ...getValues(exp.value || 0)
                }))
            };
        });
    }, [generators, kgCoefficient]);

    const handleInsertPlaceholder = (placeholder: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + placeholder + text.substring(end);
        
        setTemplate(newText);
        textarea.focus();
        // Move cursor to after the inserted placeholder
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
        }, 0);
    };

    const generateReport = (genData: typeof calculations[0]) => {
        let report = template;
        report = report.replace(/{{gen.name}}/g, genData.name);

        DYNAMIC_VALUES.forEach(val => {
            report = report.replace(new RegExp(`{{gen.${val.key}.liters}}`, 'g'), genData[val.key].liters);
            report = report.replace(new RegExp(`{{gen.${val.key}.kg}}`, 'g'), genData[val.key].kg);
        });

        genData.additionalExpenses.forEach(exp => {
            const expNameRegex = new RegExp(`{{exp.${exp.id}.name}}`, 'g');
            const expLitersRegex = new RegExp(`{{exp.${exp.id}.liters}}`, 'g');
            const expKgRegex = new RegExp(`{{exp.${exp.id}.kg}}`, 'g');
            report = report.replace(expNameRegex, exp.name);
            report = report.replace(expLitersRegex, exp.liters);
            report = report.replace(expKgRegex, exp.kg);
        });

        return report;
    };
    
    const handleSaveTemplate = () => {
        localStorage.setItem(STORAGE_KEY_TEMPLATE, template);
        toast({ title: "Шаблон збережено!", description: "Ваш шаблон звіту було збережено в локальному сховищі." });
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({ title: "Скопійовано!", description: "Звіт скопійовано у буфер обміну." });
        });
    };
    
    const totalReport = useMemo(() => {
        return calculations.map(generateReport).join('\n\n');
    }, [template, calculations]);

    return (
        <>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <FileSignature className="size-6 text-primary" />
                    Конструктор текстового звіту
                </DialogTitle>
                <DialogDescription>
                    Створіть власний шаблон звіту. Використовуйте змінні, щоб вставляти дані. Шаблон зберігається автоматично.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[70vh]">
                {/* Left side - Template Editor */}
                <div className='flex flex-col gap-4'>
                    <h3 className="font-semibold">1. Редактор шаблону</h3>
                    <Textarea 
                        ref={textareaRef}
                        value={template}
                        onChange={e => setTemplate(e.target.value)}
                        rows={10}
                        placeholder="Введіть текст вашого звіту тут..."
                        className="text-sm"
                    />
                    <div className='space-y-2'>
                        <h4 className='text-sm font-medium'>Вставити змінні:</h4>
                        <ScrollArea className="h-48">
                            <div className="flex flex-wrap gap-2 p-1">
                                <Badge variant="secondary" onClick={() => handleInsertPlaceholder(`{{gen.name}}`)} className="cursor-pointer">Назва агрегату</Badge>
                                {DYNAMIC_VALUES.map(val => (
                                    <div key={val.key} className="flex gap-1">
                                        <Badge variant="outline" onClick={() => handleInsertPlaceholder(`{{gen.${val.key}.liters}}`)} className="cursor-pointer flex items-center gap-1.5"><Droplets className="size-3" />{val.label}</Badge>
                                        <Badge variant="outline" onClick={() => handleInsertPlaceholder(`{{gen.${val.key}.kg}}`)} className="cursor-pointer flex items-center gap-1.5"><Weight className="size-3" />{val.label}</Badge>
                                    </div>
                                ))}
                                <Separator className='w-full'/>
                                <p className="text-xs text-muted-foreground w-full">Додаткові витрати (якщо вони є на агрегаті):</p>
                                {generators.flatMap(g => g.additionalExpenses).filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i && v.name.trim() !== '').map(exp => (
                                    <div key={exp.id} className="flex gap-1">
                                        <Badge variant="outline" onClick={() => handleInsertPlaceholder(`{{exp.${exp.id}.liters}}`)} className="cursor-pointer flex items-center gap-1.5"><Droplets className="size-3" />{exp.name}</Badge>
                                        <Badge variant="outline" onClick={() => handleInsertPlaceholder(`{{exp.${exp.id}.kg}}`)} className="cursor-pointer flex items-center gap-1.5"><Weight className="size-3" />{exp.name}</Badge>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                     <Button onClick={handleSaveTemplate} size="sm">Зберегти шаблон</Button>
                </div>

                {/* Right side - Preview */}
                <div className='flex flex-col gap-4'>
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">2. Попередній перегляд та результат</h3>
                        <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(totalReport)} disabled={!totalReport}>
                            <Copy className="mr-2 size-4"/>
                            Копіювати все
                        </Button>
                    </div>
                    <ScrollArea className="h-[calc(70vh-8rem)] rounded-md border bg-muted/50 p-4">
                        <pre className="text-sm whitespace-pre-wrap font-sans">
                            {totalReport || <span className="text-muted-foreground">Згенерований звіт з'явиться тут.</span>}
                        </pre>
                    </ScrollArea>
                </div>
            </div>
        </>
    );
};
