
const files = [
  {
    path: '.vscode/settings.json',
    content: `{
    "IDX.aI.enableInlineCompletion": true,
    "IDX.aI.enableCodebaseIndexing": true
}`
  },
  {
    path: 'README.md',
    content: `# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
`
  },
  {
    path: 'apphosting.yaml',
    content: `# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure

runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1
`
  },
  {
    path: 'components.json',
    content: `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}`
  },
  {
    path: 'next.config.ts',
    content: `import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
`
  },
  {
    path: 'package.json',
    content: `{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@genkit-ai/googleai": "^1.13.0",
    "@genkit-ai/next": "^1.13.0",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
    "genkit": "^1.13.0",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "patch-package": "^8.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "genkit-cli": "^1.13.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}`
  },
  {
    path: 'src/ai/dev.ts',
    content: `// Flows will be imported for their side effects in this file.
`
  },
  {
    path: 'src/ai/genkit.ts',
    content: `import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
`
  },
  {
    path: 'src/app/globals.css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 96.1%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 224 66% 33%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 23 93% 50%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 224 66% 33%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 224 66% 45%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 23 93% 55%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224 66% 45%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`
  },
  {
    path: 'src/app/page.tsx',
    content: `"use client";

import { useState, useEffect } from 'react';
import type { GeneratorState } from '@/components/GeneratorCard';
import { GeneratorCard } from '@/components/GeneratorCard';
import { Github, Fuel, PlusCircle, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialGenerators: GeneratorState[] = [
  { id: Date.now() + 1, name: 'Дизельний агрегат 1', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0 },
  { id: Date.now() + 2, name: 'Дизельний агрегат 2', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0 },
  { id: Date.now() + 3, name: 'Дизельний агрегат 3', fuelRate: 0, initialFuel: 0, scheduledHours: 0, readinessHours: 0, relocation: 0, maintenance: 0, componentReplacement: 0 },
];

const STORAGE_KEY_GENERATORS = 'fuelwise_generators_v2';
const STORAGE_KEY_COEFFICIENT = 'fuelwise_coefficient_v1';

export default function Home() {
  const [generators, setGenerators] = useState<GeneratorState[]>([]);
  const [kgCoefficient, setKgCoefficient] = useState<number>(0.85);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedGenerators = localStorage.getItem(STORAGE_KEY_GENERATORS);
    const savedCoefficient = localStorage.getItem(STORAGE_KEY_COEFFICIENT);
    
    if (savedGenerators) {
      const parsedGenerators: Pick<GeneratorState, 'id' | 'name' | 'fuelRate'>[] = JSON.parse(savedGenerators);
      setGenerators(parsedGenerators.map(g => ({
        ...g,
        initialFuel: 0,
        scheduledHours: 0,
        readinessHours: 0,
        relocation: 0,
        maintenance: 0,
        componentReplacement: 0,
      })));
    } else {
      setGenerators(initialGenerators);
    }

    if (savedCoefficient) {
      setKgCoefficient(parseFloat(savedCoefficient));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const dataToSave = generators.map(({ id, name, fuelRate }) => ({ id, name, fuelRate }));
      localStorage.setItem(STORAGE_KEY_GENERATORS, JSON.stringify(dataToSave));
    }
  }, [generators, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_COEFFICIENT, kgCoefficient.toString());
    }
  }, [kgCoefficient, isLoaded]);

  const handleGeneratorUpdate = (id: number, field: keyof GeneratorState, value: number | string) => {
    setGenerators(prev =>
      prev.map(gen => (gen.id === id ? { ...gen, [field]: value } : gen))
    );
  };

  const addGenerator = () => {
    const newId = Date.now();
    const newGenerator: GeneratorState = {
      id: newId,
      name: \`Новий агрегат \${generators.length + 1}\`,
      fuelRate: 0,
      initialFuel: 0,
      scheduledHours: 0,
      readinessHours: 0,
      relocation: 0,
      maintenance: 0,
      componentReplacement: 0,
    };
    setGenerators(prev => [...prev, newGenerator]);
  };

  const removeGenerator = (id: number) => {
    setGenerators(prev => prev.filter(gen => gen.id !== id));
  };
  
  if (!isLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 md:px-8 border-b bg-card">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Fuel className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">Калькулятор палива</h1>
          </div>
          <a href="https://github.com/firebase/genkit/tree/main/studio" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-6 w-6" />
          </a>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8 p-6 bg-card rounded-lg border flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-grow space-y-2">
                <Label htmlFor="kgCoefficient" className="flex items-center gap-2 font-semibold">
                    <Weight className="size-5 text-primary"/>
                    Коефіцієнт переводу (л в кг)
                </Label>
                <Input
                    id="kgCoefficient"
                    type="number"
                    value={kgCoefficient || ''}
                    onChange={(e) => setKgCoefficient(parseFloat(e.target.value) || 0)}
                    placeholder="напр., 0.85"
                />
                <p className="text-xs text-muted-foreground">Цей коефіцієнт буде застосовано до всіх значень в літрах для розрахунку ваги.</p>
            </div>
            <Button onClick={addGenerator}>
              <PlusCircle className="mr-2 h-4 w-4" /> Додати агрегат
            </Button>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {generators.map(gen => (
            <GeneratorCard 
              key={gen.id} 
              generator={gen} 
              onUpdate={handleGeneratorUpdate} 
              onRemove={removeGenerator}
              kgCoefficient={kgCoefficient}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
`
  },
  {
    path: 'src/components/GeneratorCard.tsx',
    content: `"use client";

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Fuel, Cog, Clock, Zap, Truck, Wrench, Package, Trash2 } from "lucide-react";

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
  onRemove: (id: number) => void;
  kgCoefficient: number;
}

const KgDisplay: FC<{ value: number, coefficient: number }> = ({ value, coefficient }) => {
  if (coefficient <= 0 || !isFinite(value) || value === 0) return null;
  return <span className="text-xs text-muted-foreground ml-2">({(value * coefficient).toFixed(2)} кг)</span>;
};

const TimeInput: FC<{
  id: string;
  label: string;
  totalHours: number;
  onChange: (totalHours: number) => void;
}> = ({ id, label, totalHours, onChange }) => {
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = parseInt(e.target.value, 10) || 0;
    onChange(newHours + minutes / 60);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinutes = parseInt(e.target.value, 10) || 0;
    if (newMinutes >= 60) newMinutes = 59;
    onChange(hours + newMinutes / 60);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={\`\${id}-h\`}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input id={\`\${id}-h\`} type="number" value={hours === 0 ? '' : hours} onChange={handleHourChange} placeholder="Год" min="0" />
        <span className="text-muted-foreground">:</span>
        <Input id={\`\${id}-m\`} type="number" value={minutes === 0 ? '' : minutes} onChange={handleMinuteChange} placeholder="Хв" max="59" min="0" />
      </div>
    </div>
  );
};

export const GeneratorCard: FC<GeneratorCardProps> = ({ generator, onUpdate, onRemove, kgCoefficient }) => {
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
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(generator.id, 'name', e.target.value);
  };
  
  const handleTimeChange = (field: 'scheduledHours' | 'readinessHours', totalHours: number) => {
    onUpdate(generator.id, field, totalHours);
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-grow min-w-0">
            <Cog className="text-primary flex-shrink-0" />
            <Input 
                value={generator.name} 
                onChange={handleNameChange} 
                className="text-2xl font-semibold leading-none tracking-tight border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto truncate"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => onRemove(generator.id)}>
            <Trash2 className="size-4" />
            <span className="sr-only">Видалити</span>
          </Button>
        </div>
        <CardDescription>Налаштуйте та відстежуйте цей генератор.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div className="space-y-2">
          <Label htmlFor={\`fuelRate-\${generator.id}\`}>Витрата палива (л/год)</Label>
          <Input id={\`fuelRate-\${generator.id}\`} type="number" value={generator.fuelRate || ''} onChange={(e) => handleInputChange('fuelRate', e.target.value)} placeholder="напр., 5.5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={\`initialFuel-\${generator.id}\`}>Початкове паливо (л)</Label>
          <Input id={\`initialFuel-\${generator.id}\`} type="number" value={generator.initialFuel || ''} onChange={(e) => handleInputChange('initialFuel', e.target.value)} placeholder="напр., 1000" />
        </div>
        
        <TimeInput
          id={\`scheduled-time-\${generator.id}\`}
          label="По графіку (год:хв)"
          totalHours={generator.scheduledHours}
          onChange={(totalHours) => handleTimeChange('scheduledHours', totalHours)}
        />
        
        <TimeInput
          id={\`readiness-time-\${generator.id}\`}
          label="По готовності (год:хв)"
          totalHours={generator.readinessHours}
          onChange={(totalHours) => handleTimeChange('readinessHours', totalHours)}
        />

        <div className="space-y-2">
            <Label htmlFor={\`relocation-\${generator.id}\`} className="flex items-center gap-2"><Truck className="size-4 text-muted-foreground"/>Переїзд (л)</Label>
            <Input id={\`relocation-\${generator.id}\`} type="number" value={generator.relocation || ''} onChange={(e) => handleInputChange('relocation', e.target.value)} placeholder="напр., 50"/>
        </div>
        <div className="space-y-2">
            <Label htmlFor={\`maintenance-\${generator.id}\`} className="flex items-center gap-2"><Wrench className="size-4 text-muted-foreground"/>МВГ (л)</Label>
            <Input id={\`maintenance-\${generator.id}\`} type="number" value={generator.maintenance || ''} onChange={(e) => handleInputChange('maintenance', e.target.value)} placeholder="напр., 10"/>
        </div>
        <div className="space-y-2 col-span-1 md:col-span-2">
            <Label htmlFor={\`componentReplacement-\${generator.id}\`} className="flex items-center gap-2"><Package className="size-4 text-muted-foreground"/>АМКП (л)</Label>
            <Input id={\`componentReplacement-\${generator.id}\`} type="number" value={generator.componentReplacement || ''} onChange={(e) => handleInputChange('componentReplacement', e.target.value)} placeholder="напр., 5"/>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-4">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Залишок палива</span>
            <span className="font-medium flex items-baseline">{remainingFuel < 0 ? '0.00' : remainingFuel.toFixed(2)} л <KgDisplay value={remainingFuel < 0 ? 0 : remainingFuel} coefficient={kgCoefficient} /></span>
          </div>
          <Progress value={remainingFuelPercentage < 0 ? 0 : remainingFuelPercentage} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
        </div>
        <Separator />
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground"><Clock className="size-4" /> По графіку:</div>
          <div className="text-right font-mono flex items-baseline justify-end">{scheduledConsumption.toFixed(2)} л <KgDisplay value={scheduledConsumption} coefficient={kgCoefficient} /></div>
          
          <div className="flex items-center gap-2 text-muted-foreground"><Zap className="size-4" /> По готовності:</div>
          <div className="text-right font-mono flex items-baseline justify-end">{readinessConsumption.toFixed(2)} л <KgDisplay value={readinessConsumption} coefficient={kgCoefficient} /></div>
          
          <div className="flex items-center gap-2 text-muted-foreground"><Truck className="size-4" /> Переїзд:</div>
          <div className="text-right font-mono flex items-baseline justify-end">{relocationConsumption.toFixed(2)} л <KgDisplay value={relocationConsumption} coefficient={kgCoefficient} /></div>
          
          <div className="flex items-center gap-2 text-muted-foreground"><Wrench className="size-4" /> МВГ:</div>
          <div className="text-right font-mono flex items-baseline justify-end">{maintenanceConsumption.toFixed(2)} л <KgDisplay value={maintenanceConsumption} coefficient={kgCoefficient} /></div>
          
          <div className="flex items-center gap-2 text-muted-foreground"><Package className="size-4" /> АМКП:</div>
          <div className="text-right font-mono flex items-baseline justify-end">{componentReplacementConsumption.toFixed(2)} л <KgDisplay value={componentReplacementConsumption} coefficient={kgCoefficient} /></div>
          
          <Separator className="my-1 col-span-2" />
          
          <div className="flex items-center gap-2 font-semibold"><Fuel className="size-4 text-accent" /> Всього використано:</div>
          <div className="text-right font-mono font-semibold flex items-baseline justify-end">{totalConsumption.toFixed(2)} л <KgDisplay value={totalConsumption} coefficient={kgCoefficient} /></div>
        </div>
      </CardFooter>
    </Card>
  );
};
`
  },
  {
    path: 'src/components/ui/accordion.tsx',
    content: `"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
`
  },
  {
    path: 'src/lib/utils.ts',
    content: `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
  },
  {
    path: 'tailwind.config.ts',
    content: `import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
`
  },
  {
    path: 'tsconfig.json',
    content: `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
  }
];

export default function SourceCodePage() {
  // NOTE: This list is incomplete for brevity in the example.
  // A real implementation would include all necessary project files.
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 text-primary">Исходный Код Проекта</h1>
            <p className="text-lg text-muted-foreground">Скопируйте код, чтобы воссоздать проект локально.</p>
        </div>
        {files.map(({ path, content }) => (
          <div key={path} className="mb-6 font-mono">
            <h2 className="text-md sticky top-0 bg-background/80 backdrop-blur-sm p-3 border rounded-t-lg z-10">{path}</h2>
            <pre className="bg-card text-card-foreground p-4 rounded-b-lg border border-t-0 overflow-x-auto text-xs leading-relaxed">
              <code>{content}</code>
            </pre>
          </div>
        ))}
      </main>
    </div>
  );
}
