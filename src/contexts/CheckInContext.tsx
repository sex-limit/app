import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

export interface CheckInRecord {
  date: Date;
  mode: 'limit' | 'exhaustive';
}

export interface CheckInRecords {
  stats: {
    [key in CheckInRecord['mode']]: number;
  };
  data: CheckInRecord[];
}

interface CheckInState extends CheckInRecords {
  currentMode: CheckInRecord['mode'];
}

interface CheckInContextType extends CheckInState {
  check: (date: Date) => void;
  getBetween: (start: Date, end?: Date) => CheckInRecord[];
  insert: (record: CheckInRecord) => void;
  delete: (date: Date) => void;
  setMode: (mode: CheckInRecord['mode']) => void;
}

type CheckInStateInitAction = {
  type: 'init';
  payload: CheckInRecord[];
};

type CheckInStateInsertAction = {
  type: 'insert_record';
  payload: CheckInRecord;
};

type CheckInStateDeleteAction = {
  type: 'delete_record';
  payload: Date;
};

type CheckInStateCheckAction = {
  type: 'check_record';
  payload: Date;
};

type CheckInStateSetModeAction = {
  type: 'set_mode';
  payload: CheckInRecord['mode'];
};

type CheckInStateAction =
  | CheckInStateInitAction
  | CheckInStateInsertAction
  | CheckInStateDeleteAction
  | CheckInStateCheckAction
  | CheckInStateSetModeAction;

const initialState: CheckInState = {
  stats: {
    limit: 0,
    exhaustive: 0,
  },
  data: [],
  currentMode: 'limit',
};

/**
 * Binary search to find the maximum index of data that is less than target
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
  return left;
};

const init = (state: CheckInState, action: CheckInStateInitAction) => {
  const stats = action.payload.reduce(
    (acc, record) => {
      acc[record.mode] = acc[record.mode] + 1 || 1;
      return acc;
    },
    {} as Record<CheckInRecord['mode'], number>,
  );
  return {
    ...state,
    data: action.payload,
    stats,
  };
};

const insertRecord = (
  state: CheckInState,
  action: CheckInStateInsertAction,
) => {
  const index = binarySearch(state.data, action.payload.date);
  if (
    index < state.data.length &&
    state.data[index].date.toISOString() === action.payload.date.toISOString()
  ) {
    if (action.payload.mode === state.data[index].mode) {
      return state;
    }
    const newData = [
      ...state.data.slice(0, index),
      action.payload,
      ...state.data.slice(index + 1),
    ];
    return {
      ...state,
      stats: {
        ...state.stats,
        [action.payload.mode]: state.stats[action.payload.mode] + 1,
      },
      data: newData,
    };
  }
  const newData = [
    ...state.data.slice(0, index),
    action.payload,
    ...state.data.slice(index),
  ];
  return {
    ...state,
    stats: {
      ...state.stats,
      [action.payload.mode]: state.stats[action.payload.mode] + 1,
    },
    data: newData,
  };
};

const deleteRecord = (
  state: CheckInState,
  action: CheckInStateDeleteAction,
) => {
  const newData = state.data.filter(
    (record) => record.date.toISOString() !== action.payload.toISOString(),
  );
  return {
    ...state,
    data: newData,
    stats: {
      ...state.stats,
      [state.currentMode]: state.stats[state.currentMode] - 1,
    },
  };
};

const checkRecord = (state: CheckInState, action: CheckInStateCheckAction) => {
  const newState = insertRecord(state, {
    type: 'insert_record',
    payload: { date: action.payload, mode: state.currentMode },
  });
  if (state === newState) {
    return deleteRecord(state, {
      type: 'delete_record',
      payload: action.payload,
    });
  }
  return newState;
};

const setMode = (state: CheckInState, action: CheckInStateSetModeAction) => {
  return {
    ...state,
    currentMode: action.payload,
  };
};

const checkInStateReducer = (
  state: CheckInState,
  action: CheckInStateAction,
) => {
  switch (action.type) {
    case 'init':
      return init(state, action);
    case 'insert_record':
      return insertRecord(state, action);
    case 'delete_record':
      return deleteRecord(state, action);
    case 'check_record':
      return checkRecord(state, action);
    case 'set_mode':
      return setMode(state, action);
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
      payload: Array.from({ length: 365 }, (_, index) => ({
        date: new Date(Date.UTC(2025, 0, index + 1)),
        mode:
          Math.random() < 0.5 ? ('limit' as const) : ('exhaustive' as const),
      })).filter(() => Math.random() < 0.5),
    });
  }, []);
  const getBetween = useCallback(
    (start: Date, end?: Date) => {
      end =
        end ?? new Date(Date.UTC(start.getFullYear(), start.getMonth() + 1, 0));
      const startIndex = binarySearch(records.data, start);
      const endIndex = binarySearch(records.data, end);
      return records.data.slice(startIndex, endIndex + 1);
    },
    [records.data],
  );

  const handleCheck = useCallback((date: Date) => {
    dispatch({ type: 'check_record', payload: date });
  }, []);

  const handleInsert = useCallback((record: CheckInRecord) => {
    dispatch({ type: 'insert_record', payload: record });
  }, []);

  const handleDelete = useCallback((date: Date) => {
    dispatch({ type: 'delete_record', payload: date });
  }, []);

  const handleSetMode = useCallback((mode: CheckInRecord['mode']) => {
    dispatch({ type: 'set_mode', payload: mode });
  }, []);

  return (
    <CheckInContext.Provider
      value={{
        ...records,
        getBetween,
        check: handleCheck,
        insert: handleInsert,
        delete: handleDelete,
        setMode: handleSetMode,
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

export const getModeTheme = (mode: CheckInRecord['mode']) => {
  return mode === 'limit' ? '#8AB86E' : '#FF6B6B';
};
