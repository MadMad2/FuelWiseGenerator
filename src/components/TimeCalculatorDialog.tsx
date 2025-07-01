"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Clock } from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TimeEntry {
  id: number;
  hours: string;
  minutes: string;
}

export const TimeCalculatorDialog = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([{ id: Date.now(), hours: '', minutes: '' }]);

  const handleEntryChange = (id: number, field: 'hours' | 'minutes', value: string) => {
    setEntries(prev =>
      prev.map(entry => (entry.id === id ? { ...entry, [field]: value.replace(/[^0-9]/g, '') } : entry))
    );
  };

  const addEntry = () => {
    setEntries(prev => [...prev, { id: Date.now(), hours: '', minutes: '' }]);
  };

  const removeEntry = (id: number) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };
  
  const total = useMemo(() => {
    const totalMinutes = entries.reduce((acc, entry) => {
      const hours = parseInt(entry.hours, 10) || 0;
      const minutes = parseInt(entry.minutes, 10) || 0;
      return acc + (hours * 60) + minutes;
    }, 0);
    
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    return {
      hours: totalHours,
      minutes: remainingMinutes,
    };
  }, [entries]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Clock className="size-6 text-primary" />
          Калькулятор часу
        </DialogTitle>
        <DialogDescription>
          Додайте часові проміжки, щоб отримати їх суму. Використовуйте результат для заповнення полів на картках агрегатів.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto -mr-6 pr-6">
        {entries.map((entry, index) => (
          <div key={entry.id} className="flex items-end gap-2">
            <div className="grid w-full gap-1.5">
              <Label htmlFor={`hours-${entry.id}`}>Години</Label>
              <Input
                id={`hours-${entry.id}`}
                type="number"
                placeholder="Год"
                value={entry.hours}
                onChange={e => handleEntryChange(entry.id, 'hours', e.target.value)}
              />
            </div>
            <span className="mb-2.5 font-bold">:</span>
            <div className="grid w-full gap-1.5">
              <Label htmlFor={`minutes-${entry.id}`}>Хвилини</Label>
              <Input
                id={`minutes-${entry.id}`}
                type="number"
                placeholder="Хв"
                value={entry.minutes}
                onChange={e => handleEntryChange(entry.id, 'minutes', e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => removeEntry(entry.id)}
              disabled={entries.length <= 1}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addEntry}>
          <PlusCircle className="mr-2 size-4" /> Додати рядок
        </Button>
      </div>
      <Separator />
      <div className="pt-4 space-y-3">
        <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Загальний час:</span>
                <span className="font-bold font-mono tracking-wider">{`${total.hours} год ${total.minutes} хв`}</span>
            </div>
        </div>
      </div>
    </>
  );
};
