import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

export type RecordMode = 'limit' | 'exhaustive';

export interface CheckInRecord {
  date: Date;
  record: {
    mode: RecordMode;
    count: number | null;
  };
  note: string;
}

export interface CheckInRecords {
  stats: {
    [_key in RecordMode]: number;
  };
  data: CheckInRecord[];
  theme: {
    [_key in RecordMode]: string;
  };
}

interface CheckInState extends CheckInRecords {}

interface CheckInContextType extends CheckInState {
  getBetween: (start: Date, end?: Date) => CheckInRecord[];
  getRecord: (date: Date) => CheckInRecord | undefined;
  setRecord: (record: CheckInStateSetAction['payload']) => void;
  deleteRecord: (date: Date) => void;
}

type CheckInStateInitAction = {
  type: 'init';
  payload: CheckInRecord[];
};

type CheckInStateSetAction = {
  type: 'set_record';
  payload: CheckInRecord;
};

type CheckInStateDeleteAction = {
  type: 'delete_record';
  payload: Date;
};

type CheckInStateAction =
  | CheckInStateInitAction
  | CheckInStateSetAction
  | CheckInStateDeleteAction;

const initialState: CheckInState = {
  stats: {
    limit: 0,
    exhaustive: 0,
  },
  data: [],
  theme: {
    limit: '#8AB86E',
    exhaustive: '#FF6B6B',
  },
};

/**
 * Binary search for the target date in the data array
 *
 * @param data The array of check-in records
 * @param target The target date to search for
 * @returns The index of the target date in the data array
 * @returns The maximum index that is not greater than the target date
 */
const binarySearch = (data: CheckInRecord[], target: Date) => {
  let left = 0;
  let right = data.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (data[mid].date < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  if (data[left]?.date.toISOString() === target.toISOString()) {
    return [left, left];
  }
  return [-1, left];
};

const init = (state: CheckInState, action: CheckInStateInitAction) => {
  const stats = action.payload.reduce(
    (acc, record) => {
      acc[record.record.mode] = acc[record.record.mode] + 1 || 1;
      return acc;
    },
    {} as Record<RecordMode, number>,
  );
  return {
    ...state,
    data: action.payload,
    stats,
  };
};

const setRecord = (state: CheckInState, action: CheckInStateSetAction) => {
  const [index, prefix] = binarySearch(state.data, action.payload.date);
  const originalMode = state.data[index]?.record.mode;
  const newMode = action.payload.record.mode;
  const originalCount = state.data[index]?.record.count;
  const newCount = action.payload.record.count;
  if (index !== -1) {
    // Existing record
    if (newMode === originalMode && newCount === originalCount) {
      // No change
      return state;
    }
    // Update record
    const newData = [
      ...state.data.slice(0, index),
      action.payload,
      ...state.data.slice(index + 1),
    ];
    return {
      ...state,
      stats: {
        ...state.stats,
        [newMode]: state.stats[newMode] + 1,
        [originalMode]: state.stats[originalMode] - 1,
      },
      data: newData,
    };
  }
  // Insert record
  const newData = [
    ...state.data.slice(0, prefix),
    action.payload,
    ...state.data.slice(prefix),
  ];
  return {
    ...state,
    stats: {
      ...state.stats,
      [newMode]: state.stats[newMode] + 1,
    },
    data: newData,
  };
};

const deleteRecord = (
  state: CheckInState,
  action: CheckInStateDeleteAction,
) => {
  const [index] = binarySearch(state.data, action.payload);
  if (index === -1) {
    return state;
  }
  const deletedRecord = state.data[index];
  const newData = [
    ...state.data.slice(0, index),
    ...state.data.slice(index + 1),
  ];
  return {
    ...state,
    data: newData,
    stats: {
      ...state.stats,
      [deletedRecord.record.mode]: state.stats[deletedRecord.record.mode] - 1,
    },
  };
};

const checkInStateReducer = (
  state: CheckInState,
  action: CheckInStateAction,
) => {
  switch (action.type) {
    case 'init':
      return init(state, action);
    case 'set_record':
      return setRecord(state, action);
    case 'delete_record':
      return deleteRecord(state, action);
    default:
      return state;
  }
};

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);
export function CheckInProvider({ children }: { children: React.ReactNode }) {
  const [records, dispatch] = useReducer(checkInStateReducer, initialState);

  useEffect(() => {
    dispatch({
      type: 'init',
      payload: Array.from({ length: 365 }, (_, index) => {
        const mode =
          Math.random() < 0.5 ? ('limit' as const) : ('exhaustive' as const);
        return {
          date: new Date(Date.UTC(2025, 0, index + 1)),
          record: {
            mode,
            count: mode === 'exhaustive' ? 1 : null,
          },
          note: [
            '😅Ut ab tempore velit omnis itaque.',
            'Blanditiis 🤏 vero blanditiis porro voluptatum ut.',
            'Placeat iure 🦍 optio.',
            'Corrupti voluptates placeat 🍠 nesciunt et qui voluptatem architecto nobis quia.',
            'Qui optio quaerat commodi 🌝 est nisi distinctio eos est mollitia.',
            'Fugiat nesciunt nostrum. 🎃',
            'Libero dolores et 🗿 blanditiis quidem repellendus et quas. Placeat consequatur quia ullam consectetur sed tenetur fuga alias. Ut repellendus ducimus. Quam excepturi cumque. Quas provident sint iusto maiores.',
            'Aut earum 🈳 et aut enim. Ullam nam eaque cumque beatae consequatur excepturi. Sequi hic dolore iusto quibusdam sit. Mollitia itaque quam sint eos voluptas. Dolores incidunt illum fugiat atque voluptatem.',
            '🇺🇳 Quidem sit magni dicta officiis sed et.\nDeleniti repudiandae quia dolore quia.\nVoluptate id exercitationem.',
          ][Math.floor(Math.random() * 9)],
        };
      }).filter(() => Math.random() < 0.5),
    });
  }, []);
  const getBetween = useCallback(
    (start: Date, end?: Date) => {
      end =
        end ?? new Date(Date.UTC(start.getFullYear(), start.getMonth() + 1, 0));
      const [, startIndex] = binarySearch(records.data, start);
      const [, endIndex] = binarySearch(records.data, end);
      return records.data.slice(startIndex, endIndex + 1);
    },
    [records.data],
  );

  const getRecord = useCallback(
    (date: Date) => {
      const [index] = binarySearch(records.data, date);
      if (index === -1) {
        return;
      }
      return records.data[index];
    },
    [records.data],
  );

  const handleSet = useCallback((record: CheckInRecord) => {
    dispatch({ type: 'set_record', payload: record });
  }, []);

  const handleDelete = useCallback((date: Date) => {
    dispatch({ type: 'delete_record', payload: date });
  }, []);

  return (
    <CheckInContext.Provider
      value={{
        ...records,
        getBetween,
        getRecord,
        setRecord: handleSet,
        deleteRecord: handleDelete,
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

export const getModeTheme = (mode: RecordMode) => {
  return mode === 'limit' ? '#8AB86E' : '#FF6B6B';
};
