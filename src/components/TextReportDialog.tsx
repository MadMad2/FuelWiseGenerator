"use client";

import { useState, useMemo, useRef } from 'react';
import type { GeneratorState, AdditionalExpense } from '@/components/GeneratorCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSignature, Copy, Droplets, Weight, Info } from 'lucide-react';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

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

const STORAGE_KEY_TEMPLATE = 'fuelwise_report_template_v2';

// Function to create a unique placeholder from a name
const sanitizeNameForPlaceholder = (name: string) => {
  return name.replace(/[^a-zA-Z0-9]/g, '_');
};

export const TextReportDialog = ({ generators, kgCoefficient }: TextReportDialogProps) => {
    const [template, setTemplate] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STORAGE_KEY_TEMPLATE) || `Звіт по агрегатам:\n\nАгрегат: {{gen.Дизельний_агрегат_1.name}}\nЗалишок: {{gen.Дизельний_агрегат_1.remainingFuel.liters}} л\n\nАгрегат: {{gen.Дизельний_агрегат_2.name}}\nЗалишок: {{gen.Дизельний_агрегат_2.remainingFuel.liters}} л`;
        }
        return '';
    });
    
    const { toast } = useToast();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [selectedGeneratorId, setSelectedGeneratorId] = useState<string | undefined>(generators[0]?.id.toString());

    const calculations = useMemo(() => {
        const calcs = new Map<string, any>();
        generators.forEach(gen => {
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

            const additionalExpensesData = new Map<string, { liters: string, kg: string }>();
            gen.additionalExpenses.forEach(exp => {
                const sanitizedName = sanitizeNameForPlaceholder(exp.name);
                if (sanitizedName) {
                    additionalExpensesData.set(sanitizedName, getValues(exp.value || 0));
                }
            });

            calcs.set(gen.id.toString(), {
                name: gen.name,
                sanitizedName: sanitizeNameForPlaceholder(gen.name),
                initialFuel: getValues(gen.initialFuel || 0),
                totalConsumption: getValues(totalConsumption),
                remainingFuel: getValues(remainingFuel),
                scheduledConsumption: getValues(scheduledConsumption),
                readinessConsumption: getValues(readinessConsumption),
                relocation: getValues(relocation),
                maintenance: getValues(maintenance),
                componentReplacement: getValues(componentReplacement),
                additionalExpenses: additionalExpensesData,
            });
        });
        return calcs;
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
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
        }, 0);
    };

    const generateReport = () => {
        let report = template;
        
        calculations.forEach((genData) => {
            const genNamePlaceholder = genData.sanitizedName;

            // Main generator values
            report = report.replace(new RegExp(`{{gen.${genNamePlaceholder}.name}}`, 'g'), genData.name);
            DYNAMIC_VALUES.forEach(val => {
                report = report.replace(new RegExp(`{{gen.${genNamePlaceholder}.${val.key}.liters}}`, 'g'), genData[val.key].liters);
                report = report.replace(new RegExp(`{{gen.${genNamePlaceholder}.${val.key}.kg}}`, 'g'), genData[val.key].kg);
            });
            
            // Additional expenses
            genData.additionalExpenses.forEach((expValues: {liters: string, kg: string}, expName: string) => {
                 report = report.replace(new RegExp(`{{gen.${genNamePlaceholder}.exp.${expName}.liters}}`, 'g'), expValues.liters);
                 report = report.replace(new RegExp(`{{gen.${genNamePlaceholder}.exp.${expName}.kg}}`, 'g'), expValues.kg);
            });
        });

        // Clean up any un-replaced placeholders
        report = report.replace(/{{[^}]+}}/g, '[немає даних]');
        
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
    
    const finalReport = useMemo(generateReport, [template, calculations]);

    const selectedGenerator = selectedGeneratorId ? generators.find(g => g.id.toString() === selectedGeneratorId) : undefined;
    const selectedGeneratorSanitizedName = selectedGenerator ? sanitizeNameForPlaceholder(selectedGenerator.name) : '';
    
    const uniqueAdditionalExpenses = useMemo(() => {
        const expenses = new Map<string, string>();
        if (selectedGenerator) {
            selectedGenerator.additionalExpenses.forEach(exp => {
                if (exp.name.trim()) {
                    expenses.set(sanitizeNameForPlaceholder(exp.name), exp.name);
                }
            });
        }
        return Array.from(expenses.entries());
    }, [selectedGenerator]);

    return (
        <>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <FileSignature className="size-6 text-primary" />
                    Конструктор текстового звіту
                </DialogTitle>
                <DialogDescription>
                    Створіть єдиний шаблон звіту. Оберіть агрегат, щоб додати його дані, та побудуйте звіт будь-якої складності.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[70vh]">
                {/* Left side - Template Editor */}
                <div className='flex flex-col gap-4'>
                    <div className="flex justify-between items-center">
                       <h3 className="font-semibold">1. Редактор шаблону</h3>
                       <Button onClick={handleSaveTemplate} size="sm">Зберегти шаблон</Button>
                    </div>
                    <Textarea 
                        ref={textareaRef}
                        value={template}
                        onChange={e => setTemplate(e.target.value)}
                        rows={10}
                        placeholder="Введіть текст вашого звіту тут..."
                        className="text-sm"
                    />
                    <div className='space-y-3 p-3 border rounded-lg'>
                        <h4 className='text-sm font-medium'>Додавання даних до шаблону</h4>
                         <Select onValueChange={setSelectedGeneratorId} value={selectedGeneratorId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Оберіть агрегат для вставки даних" />
                            </SelectTrigger>
                            <SelectContent>
                                {generators.map(gen => (
                                    <SelectItem key={gen.id} value={gen.id.toString()}>{gen.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {selectedGeneratorId ? (
                             <ScrollArea className="h-40">
                                <div className="flex flex-wrap gap-2 p-1">
                                    <Badge variant="secondary" onClick={() => handleInsertPlaceholder(`{{gen.${selectedGeneratorSanitizedName}.name}}`)} className="cursor-pointer">Назва агрегату</Badge>
                                    {DYNAMIC_VALUES.map(val => (
                                        <div key={val.key} className="flex gap-1">
                                            <Badge variant="outline" onClick={() => handleInsertPlaceholder(`{{gen.${selectedGeneratorSanitizedName}.${val.key}.liters}}`)} className="cursor-pointer flex items-center gap-1.5"><Droplets className="size-3" />{val.label}</Badge>
                                            <Badge variant="outline" onClick={() => handleInsertPlaceholder(`{{gen.${selectedGeneratorSanitizedName}.${val.key}.kg}}`)} className="cursor-pointer flex items-center gap-1.5"><Weight className="size-3" />{val.label}</Badge>
                                        </div>
                                    ))}
                                    {uniqueAdditionalExpenses.length > 0 && (
                                       <>
                                         <div className='w-full text-xs text-muted-foreground pt-2'>Додаткові витрати для "{selectedGenerator?.name}"</div>
                                         {uniqueAdditionalExpenses.map(([sanitizedName, originalName]) => (
                                              <div key={sanitizedName} className="flex gap-1">
                                                  <Badge variant="outline" onClick={() => handleInsertPlaceholder(`{{gen.${selectedGeneratorSanitizedName}.exp.${sanitizedName}.liters}}`)} className="cursor-pointer flex items-center gap-1.5"><Droplets className="size-3" />{originalName}</Badge>
                                                  <Badge variant="outline" onClick={() => handleInsertPlaceholder(`{{gen.${selectedGeneratorSanitizedName}.exp.${sanitizedName}.kg}}`)} className="cursor-pointer flex items-center gap-1.5"><Weight className="size-3" />{originalName}</Badge>
                                              </div>
                                          ))}
                                       </>
                                    )}
                                </div>
                            </ScrollArea>
                        ) : (
                            <Alert variant="default" className="mt-2">
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    Оберіть агрегат, щоб побачити доступні для вставки змінні.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>

                {/* Right side - Preview */}
                <div className='flex flex-col gap-4'>
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">2. Результат</h3>
                        <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(finalReport)} disabled={!finalReport}>
                            <Copy className="mr-2 size-4"/>
                            Копіювати
                        </Button>
                    </div>
                    <ScrollArea className="h-[calc(70vh-8rem)] rounded-md border bg-muted/50 p-4">
                        <pre className="text-sm whitespace-pre-wrap font-sans">
                            {finalReport || <span className="text-muted-foreground">Згенерований звіт з'явиться тут.</span>}
                        </pre>
                    </ScrollArea>
                </div>
            </div>
        </>
    );
};
