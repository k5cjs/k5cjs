export function isDateEqual(date1: Date, date2: Date): boolean {
  return date1.getTime() === date2.getTime();
}

export function removeTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function isDateBetween(checkDate: Date, startDate: Date, endDate: Date): boolean {
  return checkDate >= startDate && checkDate <= endDate;
}

export function findLeftMostDay(dates: (Date | null)[]): Date | null {
  const validDates = dates.filter((date): date is Date => !!date);

  if (validDates.length === 0) {
    return null;
  }

  return validDates.reduce((leftmostDate, date) => (date < leftmostDate ? date : leftmostDate), validDates[0]);
}

export function findRightMostDay(dates: (Date | null)[]): Date | null {
  const validDates = dates.filter((date): date is Date => !!date);

  if (validDates.length === 0) {
    return null;
  }

  return validDates.reduce((rightMostDate, date) => (date > rightMostDate ? date : rightMostDate), validDates[0]);
}
