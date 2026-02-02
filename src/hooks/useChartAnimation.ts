import { useState, useEffect, useRef } from 'react';

export interface AnimatedValue {
  current: number;
  target: number;
  velocity: number;
}

/**
 * Hook for animating numeric values with spring physics
 */
export function useAnimatedValue(
  targetValue: number,
  config: { stiffness?: number; damping?: number; mass?: number } = {}
): number {
  const { stiffness = 170, damping = 26, mass = 1 } = config;
  
  const [displayValue, setDisplayValue] = useState(targetValue);
  const animationRef = useRef<number>();
  const valueRef = useRef<AnimatedValue>({
    current: targetValue,
    target: targetValue,
    velocity: 0
  });

  useEffect(() => {
    valueRef.current.target = targetValue;
    
    const animate = () => {
      const { current, target, velocity } = valueRef.current;
      
      // Spring physics
      const force = (target - current) * stiffness;
      const dampingForce = velocity * damping;
      const acceleration = (force - dampingForce) / mass;
      
      const newVelocity = velocity + acceleration * 0.016; // ~60fps
      const newValue = current + newVelocity * 0.016;
      
      valueRef.current.current = newValue;
      valueRef.current.velocity = newVelocity;
      
      setDisplayValue(newValue);
      
      // Stop when close enough and velocity is low
      if (Math.abs(target - newValue) < 0.01 && Math.abs(newVelocity) < 0.01) {
        valueRef.current.current = target;
        valueRef.current.velocity = 0;
        setDisplayValue(target);
        return;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, stiffness, damping, mass]);

  return displayValue;
}

/**
 * Hook for animating arrays of data points
 */
export function useAnimatedDataSeries<T extends { value: number }>(
  data: T[],
  duration: number = 500
): T[] {
  const [animatedData, setAnimatedData] = useState<T[]>(data);
  const previousDataRef = useRef<T[]>(data);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const previousData = previousDataRef.current;
    previousDataRef.current = data;
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    startTimeRef.current = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate values
      const interpolated = data.map((point, index) => {
        const prevValue = previousData[index]?.value ?? point.value;
        const newValue = prevValue + (point.value - prevValue) * eased;
        return { ...point, value: newValue };
      });
      
      setAnimatedData(interpolated);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, duration]);

  return animatedData;
}

/**
 * Generate a unique key for data to trigger animations
 */
export function getDataKey(periodStart: string, periodEnd: string): string {
  return `${periodStart}-${periodEnd}`;
}
