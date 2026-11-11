/**
 * Utility to convert Excel serial dates and Gregorian dates to Jalali/Shamsi Persian dates
 */

export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  jy += Math.floor((days - 1) / 365);
  if (days > 0) days = (days - 1) % 365;
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

const PERSIAN_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

/**
 * Formats any raw date value from Excel (numeric serial like 46205, ISO string, or Persian text) into readable Persian date
 */
export function formatExcelDate(raw: any): string {
  if (raw === null || raw === undefined || raw === '') return '';
  
  const str = String(raw).trim();
  if (!str) return '';

  // 1. If it already contains Persian month names, return as is
  if (PERSIAN_MONTH_NAMES.some(m => str.includes(m))) {
    return str;
  }

  // 2. If it is already a Shamsi slash format like 1403/05/08 or 1405/05/13
  if (/^1[34]\d\d[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(str)) {
    return str;
  }

  // 3. If it is a numeric Excel date serial (e.g. 40000 to 55000)
  const num = Number(str);
  if (!isNaN(num) && num > 30000 && num < 70000) {
    try {
      // Excel serial date to Date (accounting for leap year bug: 25569 = 1970-01-01)
      const date = new Date(Math.round((num - 25569) * 86400 * 1000));
      const gy = date.getUTCFullYear();
      const gm = date.getUTCMonth() + 1;
      const gd = date.getUTCDate();
      const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);
      const monthName = PERSIAN_MONTH_NAMES[jm - 1] || `${jm}`;
      return `${jd} ${monthName} ${jy}`;
    } catch {
      return str;
    }
  }

  // 4. If it is a standard ISO date (e.g. 2026-08-08)
  const parsedDate = new Date(str);
  if (!isNaN(parsedDate.getTime()) && str.includes('-')) {
    try {
      const gy = parsedDate.getUTCFullYear();
      const gm = parsedDate.getUTCMonth() + 1;
      const gd = parsedDate.getUTCDate();
      const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);
      const monthName = PERSIAN_MONTH_NAMES[jm - 1] || `${jm}`;
      return `${jd} ${monthName} ${jy}`;
    } catch {
      return str;
    }
  }

  return str;
}
