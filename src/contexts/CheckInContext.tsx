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
  modeTheme: string;
}

const mockLimitData = {
  mode: 'limit' as const,
  total: 16,
  data: Array.from({ length: 365 }, (_, index) => ({
    date: new Date(2025, 0, index + 1).toISOString().split('T')[0],
  })).filter(() => Math.random() < 0.5),
};

const mockExhaustiveData = {
  mode: 'exhaustive' as const,
  total: 365,
  data: Array.from({ length: 365 }, (_, index) => ({
    date: new Date(2025, 0, index + 1).toISOString().split('T')[0],
  })).filter(() => Math.random() < 0.5),
};

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);
export function CheckInProvider({ children }: { children: React.ReactNode }) {
  const [checkInRecords, setCheckInRecords] =
    useState<CheckInRecords>(mockLimitData);

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
    setCheckInRecords(() => {
      if (mode === 'limit') {
        return mockLimitData;
      }
      return mockExhaustiveData;
    });
  };

  const getByMonth = (year: number, month: number) => {
    return groupedRecords[year]?.[month] || [];
  };

  const modeTheme = useMemo(() => {
    return checkInRecords.mode === 'limit' ? '#8AB86E' : '#E1351F';
  }, [checkInRecords.mode]);

  return (
    <CheckInContext.Provider
      value={{
        checkInRecords,
        handleCheckIn,
        switchMode,
        getByMonth,
        modeTheme,
      }}
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
