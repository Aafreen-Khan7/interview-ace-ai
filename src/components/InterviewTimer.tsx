import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Timer, AlertTriangle } from 'lucide-react';

interface InterviewTimerProps {
  timeLimit: number; // in seconds
  isActive: boolean;
  onTimeUp: () => void;
  onTimeUpdate: (elapsed: number) => void;
  className?: string;
}

export function InterviewTimer({ 
  timeLimit, 
  isActive, 
  onTimeUp, 
  onTimeUpdate,
  className 
}: InterviewTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const remaining = Math.max(0, timeLimit - elapsed);
  const progress = (remaining / timeLimit) * 100;
  
  // Determine urgency level
  const isWarning = remaining <= timeLimit * 0.3 && remaining > timeLimit * 0.1;
  const isCritical = remaining <= timeLimit * 0.1;
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLimit, onTimeUp, onTimeUpdate]);

  // Notify parent about elapsed/time-up from a separate effect (avoids setState-in-render)
  useEffect(() => {
    // Only notify when timer is active
    if (!isActive) return;

    onTimeUpdate(elapsed);
    if (elapsed >= timeLimit) {
      onTimeUp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed]);
  
  // Reset when question changes
  const reset = useCallback(() => {
    setElapsed(0);
  }, []);
  
  // Expose reset method
  useEffect(() => {
    if (!isActive && elapsed > 0) {
      // Don't reset automatically, let parent handle it
    }
  }, [isActive, elapsed]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Circular progress timer */}
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-secondary"
          />
          {/* Progress circle */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 36}`}
            strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
            className={cn(
              "transition-all duration-1000",
              isCritical ? "text-destructive" : isWarning ? "text-warning" : "text-primary"
            )}
          />
        </svg>
        
        {/* Timer text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isCritical && <AlertTriangle className="w-3 h-3 text-destructive animate-pulse mb-0.5" />}
          <span className={cn(
            "text-lg font-mono font-bold",
            isCritical ? "text-destructive" : isWarning ? "text-warning" : "text-foreground"
          )}>
            {formatTime(remaining)}
          </span>
        </div>
      </div>
      
      {/* Label */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Timer className="w-3 h-3" />
        <span>Time Remaining</span>
      </div>
      
      {/* Time bonus indicator */}
      {progress > 70 && (
        <div className="text-xs text-success font-medium animate-pulse">
          +Time Bonus Active
        </div>
      )}
    </div>
  );
}

// Hook for managing timer state per question
export function useQuestionTimer(timeLimit: number) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);
  
  const stop = useCallback(() => {
    setIsRunning(false);
    return elapsed;
  }, [elapsed]);
  
  const reset = useCallback(() => {
    setElapsed(0);
    setIsRunning(false);
  }, []);
  
  const updateElapsed = useCallback((newElapsed: number) => {
    setElapsed(newElapsed);
  }, []);
  
  // Calculate time bonus: faster = higher bonus
  const calculateTimeBonus = useCallback(() => {
    const percentUsed = elapsed / timeLimit;
    
    if (percentUsed <= 0.3) return 2; // Used less than 30% time: +2 bonus
    if (percentUsed <= 0.5) return 1.5; // Used less than 50% time: +1.5 bonus
    if (percentUsed <= 0.7) return 1; // Used less than 70% time: +1 bonus
    if (percentUsed <= 0.9) return 0.5; // Used less than 90% time: +0.5 bonus
    if (percentUsed >= 1) return -1; // Ran out of time: -1 penalty
    return 0;
  }, [elapsed, timeLimit]);
  
  return {
    elapsed,
    isRunning,
    start,
    stop,
    reset,
    updateElapsed,
    calculateTimeBonus,
    remaining: Math.max(0, timeLimit - elapsed)
  };
}
