'use client';

import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressBar({ 
  progress, 
  className, 
  showPercentage = false, 
  animated = true 
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Progress</span>
        {showPercentage && (
          <span className="text-sm text-muted-foreground">{clampedProgress}%</span>
        )}
      </div>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        {animated ? (
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${clampedProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ) : (
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${clampedProgress}%` }}
          />
        )}
      </div>
    </div>
  );
}

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  className?: string;
}

export function StepProgress({ currentStep, totalSteps, steps, className }: StepProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                index < currentStep
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                  ? "bg-primary/20 text-primary border-2 border-primary"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span className="text-xs mt-1 text-center max-w-20">{step}</span>
          </div>
        ))}
      </div>
      <ProgressBar 
        progress={(currentStep / totalSteps) * 100} 
        showPercentage={false}
      />
    </div>
  );
}
