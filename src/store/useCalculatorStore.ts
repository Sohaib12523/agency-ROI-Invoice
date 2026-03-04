import { create } from "zustand";

interface CalculatorState {
  clientRevenue: number;
  aov: number;
  currentConversion: number;
  estimatedImprovement: number;
  estimatedTrafficGrowth: number;
  projectDuration: number;
  agencyCost: number;
  isOptimistic: boolean;

  setClientRevenue: (val: number) => void;
  setAov: (val: number) => void;
  setCurrentConversion: (val: number) => void;
  setEstimatedImprovement: (val: number) => void;
  setEstimatedTrafficGrowth: (val: number) => void;
  setProjectDuration: (val: number) => void;
  setAgencyCost: (val: number) => void;
  setIsOptimistic: (val: boolean) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  clientRevenue: 50000,
  aov: 150,
  currentConversion: 2.5,
  estimatedImprovement: 20,
  estimatedTrafficGrowth: 10,
  projectDuration: 6,
  agencyCost: 5000,
  isOptimistic: true,

  setClientRevenue: (val) => set({ clientRevenue: val }),
  setAov: (val) => set({ aov: val }),
  setCurrentConversion: (val) => set({ currentConversion: val }),
  setEstimatedImprovement: (val) => set({ estimatedImprovement: val }),
  setEstimatedTrafficGrowth: (val) => set({ estimatedTrafficGrowth: val }),
  setProjectDuration: (val) => set({ projectDuration: val }),
  setAgencyCost: (val) => set({ agencyCost: val }),
  setIsOptimistic: (val) => set({ isOptimistic: val }),
}));
