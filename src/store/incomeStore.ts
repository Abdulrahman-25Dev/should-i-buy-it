import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage';

interface IncomeState {
  monthlyIncome: number;
  workHoursPerDay: number;
  workDaysPerWeek: number;
  hourlyRate: number;
  currency: string;

  setMonthlyIncome: (income: number) => void;
  setWorkHoursPerDay: (hours: number) => void;
  setWorkDaysPerWeek: (days: number) => void;
  setHourlyRate: (rate: number) => void;
  setCurrency: (currency: string) => void;
}

export const useIncomeStore = create<IncomeState>()(
  persist(
    (set, get) => ({
      monthlyIncome: 0,
      workHoursPerDay: 8,
      workDaysPerWeek: 5,
      hourlyRate: 50,
      currency: 'SAR',

      setMonthlyIncome: (income: number) => {
        const { workHoursPerDay, workDaysPerWeek } = get();
        const monthlyHours = workHoursPerDay * workDaysPerWeek * 4.33;
        const calculatedRate = monthlyHours > 0 ? Math.round((income / monthlyHours) * 100) / 100 : 0;

        set({
          monthlyIncome: income,
          hourlyRate: calculatedRate > 0 ? calculatedRate : get().hourlyRate,
        });
      },

      setWorkHoursPerDay: (hours: number) => {
        set({ workHoursPerDay: hours });
        const { monthlyIncome, workDaysPerWeek } = get();
        if (monthlyIncome > 0) {
          const monthlyHours = hours * workDaysPerWeek * 4.33;
          const calculatedRate = monthlyHours > 0 ? Math.round((monthlyIncome / monthlyHours) * 100) / 100 : 0;
          set({ hourlyRate: calculatedRate });
        }
      },

      setWorkDaysPerWeek: (days: number) => {
        set({ workDaysPerWeek: days });
        const { monthlyIncome, workHoursPerDay } = get();
        if (monthlyIncome > 0) {
          const monthlyHours = workHoursPerDay * days * 4.33;
          const calculatedRate = monthlyHours > 0 ? Math.round((monthlyIncome / monthlyHours) * 100) / 100 : 0;
          set({ hourlyRate: calculatedRate });
        }
      },

      setHourlyRate: (rate: number) => set({ hourlyRate: rate }),
      setCurrency: (currency: string) => set({ currency }),
    }),
    {
      name: 'income-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);