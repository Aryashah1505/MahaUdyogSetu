import { useState, useEffect } from 'react';

/**
 * Month names for multilingual formatting if needed
 */
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_SHORT_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTHS_MR = [
  'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
  'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
];

const MONTHS_HI = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

export type DateFormatType = 'full' | 'short' | 'iso' | 'with-time' | 'time' | 'month-year' | 'dd-mm-yyyy';

/**
 * Format a given date into consistent standard display strings.
 * Defaults to the live current system/browser date.
 */
export function formatLocalDate(
  dateInput?: Date | string | number | null,
  format: DateFormatType = 'full',
  lang: 'en' | 'mr' | 'hi' = 'en'
): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) {
    return '';
  }

  const day = d.getDate();
  const monthIdx = d.getMonth();
  const year = d.getFullYear();

  // Time components
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const timeStr = `${hours}:${minStr} ${ampm}`;

  if (format === 'iso') {
    const mm = monthIdx + 1 < 10 ? `0${monthIdx + 1}` : `${monthIdx + 1}`;
    const dd = day < 10 ? `0${day}` : `${day}`;
    return `${year}-${mm}-${dd}`;
  }

  if (format === 'dd-mm-yyyy') {
    const mm = monthIdx + 1 < 10 ? `0${monthIdx + 1}` : `${monthIdx + 1}`;
    const dd = day < 10 ? `0${day}` : `${day}`;
    return `${dd}/${mm}/${year}`;
  }

  if (format === 'time') {
    return timeStr;
  }

  let monthName = MONTHS_EN[monthIdx];
  let shortMonthName = MONTHS_SHORT_EN[monthIdx];

  if (lang === 'mr') {
    monthName = MONTHS_MR[monthIdx];
    shortMonthName = MONTHS_MR[monthIdx];
  } else if (lang === 'hi') {
    monthName = MONTHS_HI[monthIdx];
    shortMonthName = MONTHS_HI[monthIdx];
  }

  switch (format) {
    case 'short':
      return `${day} ${shortMonthName} ${year}`;
    case 'with-time':
      return `${day} ${monthName} ${year}, ${timeStr}`;
    case 'month-year':
      return `${monthName} ${year}`;
    case 'full':
    default:
      return `${day} ${monthName} ${year}`;
  }
}

/**
 * Returns dynamic string for current local browser date.
 */
export function getCurrentLocalDate(
  format: DateFormatType = 'full',
  lang: 'en' | 'mr' | 'hi' = 'en'
): string {
  return formatLocalDate(new Date(), format, lang);
}

/**
 * Returns ISO date string (YYYY-MM-DD) for N days before today.
 */
export function getDateNDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatLocalDate(d, 'iso');
}

/**
 * React hook that provides live auto-updating current date string.
 * Checks and updates every minute and on midnight crossing.
 */
export function useLiveDate(format: DateFormatType = 'full', lang: 'en' | 'mr' | 'hi' = 'en'): {
  date: Date;
  formattedDate: string;
  isoDate: string;
  formattedWithTime: string;
} {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    // Initial sync
    setCurrentDate(new Date());

    // Check periodically so when calendar day changes or minutes tick, state updates seamlessly
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 15000); // 15 seconds check

    return () => clearInterval(interval);
  }, []);

  return {
    date: currentDate,
    formattedDate: formatLocalDate(currentDate, format, lang),
    isoDate: formatLocalDate(currentDate, 'iso'),
    formattedWithTime: formatLocalDate(currentDate, 'with-time', lang)
  };
}
