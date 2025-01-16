import React, { createContext, useContext, useMemo, useState } from 'react';

export interface CheckInRecord {
  date: string;
}

export interface CheckInRecords {
  mode: 'limit' | 'exhaustive';
  total: number;
  data: CheckInRecord[];
}

interface CheckInContextType {
  checkInRecords: CheckInRecords;
  handleCheckIn: (date: string, check: boolean) => void;
  switchMode: (mode: 'limit' | 'exhaustive') => void;
  getByMonth: (year: number, month: number) => number[];
}

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);
export function CheckInProvider({ children }: { children: React.ReactNode }) {
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecords>({
    mode: 'limit',
    total: 16,
    data: [
      { date: '2024-12-27' },
      { date: '2024-12-28' },
      { date: '2024-12-30' },
      { date: '2025-01-01' },
      { date: '2025-01-02' },
      { date: '2025-01-03' },
      { date: '2025-01-05' },
      { date: '2025-01-06' },
      { date: '2025-01-07' },
      { date: '2025-01-08' },
      { date: '2025-01-09' },
      { date: '2025-01-12' },
      { date: '2025-01-13' },
      { date: '2025-01-14' },
      { date: '2025-01-15' },
      { date: '2025-01-16' },
    ],
  });

  const groupedRecords = useMemo(() => {
    return groupByMonth(checkInRecords.data);
  }, [checkInRecords.data]);

  const handleCheckIn = (date: string, check: boolean) => {
    setCheckInRecords((prevRecords) => {
      const existingRecord = prevRecords.data.find(
        (record) => record.date === date,
      );
      if (existingRecord) {
        return {
          ...prevRecords,
          data: check
            ? prevRecords.data.filter((record) => record.date !== date)
            : [...prevRecords.data, { date }],
        };
      }
      if (check) {
        return {
          ...prevRecords,
          data: [...prevRecords.data, { date }],
        };
      }
      return prevRecords;
    });
  };

  const switchMode = (mode: 'limit' | 'exhaustive') => {
    setCheckInRecords((prevRecords) => ({
      ...prevRecords,
      mode,
    }));
  };

  const getByMonth = (year: number, month: number) => {
    return groupedRecords[year]?.[month] || [];
  };

  return (
    <CheckInContext.Provider
      value={{ checkInRecords, handleCheckIn, switchMode, getByMonth }}
    >
      {children}
    </CheckInContext.Provider>
  );
}

export function useCheckIn() {
  const context = useContext(CheckInContext);
  if (context === undefined) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return context;
}

export function groupByMonth(records: CheckInRecord[]) {
  const result: Record<number, Record<number, number[]>> = {};
  records.forEach((record) => {
    const date = new Date(record.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    if (!result[year]) {
      result[year] = {};
    }
    if (!result[year][month]) {
      result[year][month] = [];
    }
    result[year][month].push(date.getDate());
  });
  return result;
}
