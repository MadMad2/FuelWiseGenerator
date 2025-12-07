"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSignature, Copy, Droplets, Weight, Info, Pencil, CalendarDays } from 'lucide-react';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useUser, useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';


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

const DEFAULT_TEMPLATE = `Звіт по агрегатам:\n\nАгрегат: {{gen.Дизельний_агрегат_1.name}}\nЗалишок: {{gen.Дизельний_агрегат_1.remainingFuel.liters}} л\n\nАгрегат: {{gen.Дизельний_агрегат_2.name}}\nЗалишок: {{gen.Дизельний_агрегат_2.remainingFuel.liters}} л`;

const sanitizeNameForPlaceholder = (name: string) => {
  return name.replace(/[^a-zA-Z0-9]/g, '_');
};

export const TextReportDialog = ({ generators, kgCoefficient }: TextReportDialogProps) => {
    const { user } = useUser();
    const firestore = useFirestore();
    const [template, setTemplate] = useState<string>(DEFAULT_TEMPLATE);
    
    const { toast } = useToast();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [selectedGeneratorId, setSelectedGeneratorId] = useState<string | undefined>(generators[0]?.id.toString());
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!user || !firestore) return;
        const settingsDocRef = doc(firestore, 'users', user.uid, 'settings', 'main');
        const unsubscribe = onSnapshot(settingsDocRef, (doc) => {
            if (doc.exists()) {
                const settings = doc.data();
                if (settings.reportTemplate) {
                    setTemplate(settings.reportTemplate);
                }
            }
        });
        return () => unsubscribe();
    }, [user, firestore]);

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

        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
        report = report.replace(/{{date}}/g, formattedDate);
        
        calculations.forEach((genData) => {
            const genNamePlaceholder = genData.sanitizedName;

            report = report.replace(new RegExp(`{{gen.${genNamePlaceholder}.name}}`, 'g'), genData.name);
            DYNAMIC_VALUES.forEach(val => {
                report = report.replace(new RegExp(`{{gen.${genNamePlaceholder}.${val.key}.liters}}`, 'g'), genData[val.key].liters);
                report = report.replace(new RegExp(`{{gen.${genNamePlaceholder}.${val.key}.kg}}`, 'g'), genData[val.key].kg);
            });
            
            genData.additionalExpenses.forEach((expValues: {liters: string, kg: string}, expName: string) => {
                 report = report.replace(new RegExp(`{{gen.${genNamePlaceholder}.exp.${expName}.liters}}`, 'g'), expValues.liters);
                 report = report.replace(new RegExp(`{{gen.${genNamePlaceholder}.exp.${expName}.kg}}`, 'g'), expValues.kg);
            });
        });

        report = report.replace(/{{[^}]+}}/g, '[немає даних]');
        
        return report;
    };
    
    const handleSaveTemplate = () => {
        if (!user || !firestore) return;
        const settingsDocRef = doc(firestore, 'users', user.uid, 'settings', 'main');
        setDocumentNonBlocking(settingsDocRef, { reportTemplate: template }, { merge: true });
        toast({ title: "Шаблон збережено!", description: "Ваш шаблон звіту було збережено в хмарі." });
        setIsEditing(false);
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


    if (isEditing) {
        return (
             <>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pencil className="size-6 text-primary" />
                        Редактор шаблону звіту
                    </DialogTitle>
                    <DialogDescription>
                        Створіть єдиний шаблон звіту. Оберіть агрегат, щоб додати його дані, та побудуйте звіт будь-якої складності.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-h-[70vh]">
                    <div className='flex flex-col gap-4'>
                        <div className="flex justify-between items-center">
                           <h3 className="font-semibold">Шаблон</h3>
                           <Button onClick={handleSaveTemplate} size="sm">Зберегти і закрити</Button>
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
                             <div className="flex flex-wrap gap-2 p-1">
                                <Badge variant="secondary" onClick={() => handleInsertPlaceholder(`{{date}}`)} className="cursor-pointer flex items-center gap-1.5"><CalendarDays className="size-3" />Дата</Badge>
                             </div>
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

                    <div className='flex flex-col gap-4'>
                        <h3 className="font-semibold">Результат (попередній перегляд)</h3>
                        <ScrollArea className="h-[calc(70vh-8rem)] rounded-md border bg-muted/50 p-4">
                            <pre className="text-sm whitespace-pre-wrap font-sans">
                                {finalReport || <span className="text-muted-foreground">Згенерований звіт з'явиться тут.</span>}
                            </pre>
                        </ScrollArea>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <FileSignature className="size-6 text-primary" />
                    Текстовий звіт
                </DialogTitle>
                <DialogDescription>
                    Сформований звіт на основі ваших даних та шаблону.
                </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-4 mt-4'>
                <div className="flex justify-end items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 size-4"/>
                        Редагувати шаблон
                    </Button>
                    <Button variant="default" size="sm" onClick={() => handleCopyToClipboard(finalReport)} disabled={!finalReport}>
                        <Copy className="mr-2 size-4"/>
                        Копіювати звіт
                    </Button>
                </div>
                <ScrollArea className="h-[60vh] rounded-md border bg-muted/50 p-4">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                        {finalReport || <span className="text-muted-foreground">Згенерований звіт з'явиться тут.</span>}
                    </pre>
                </ScrollArea>
            </div>
        </>
    );
};
