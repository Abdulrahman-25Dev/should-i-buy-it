// src/lib/calculations.ts

export interface TrueCostResult {
  hours: number;
  severity: 'low' | 'medium' | 'high';
}

export function calculateTrueCost(price: number, hourlyRate: number): TrueCostResult {
  if (price <= 0 || hourlyRate <= 0) {
    return { hours: 0, severity: 'low' };
  }

  // حساب عدد الساعات المطلوبة لدفع قيمة المنتج
  const hours = Math.round((price / hourlyRate) * 10) / 10;

  // تحديد شدة/تأثير التكلفة (Severity Indicator)
  let severity: 'low' | 'medium' | 'high' = 'low';
  if (hours >= 16) {
    severity = 'high'; // يستنزف أكثر من يومين عمل (16+ ساعة)
  } else if (hours >= 8) {
    severity = 'medium'; // يستنزف يوم عمل كامل (8-16 ساعة)
  }

  return { hours, severity };
}