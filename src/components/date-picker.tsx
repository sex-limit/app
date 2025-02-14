import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  type LayoutRectangle,
  type StyleProp,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { getDaysInMonth, getFirstDayOfMonth } from '@/utils/date';

import { DropdownContext, DropdownProvider } from './dropdown';

export type PickerType = 'year' | 'month' | 'week' | 'day';

type IntervalType = PickerType | 'decade' | 'century';

interface DatePickerProviderProps {
  children: React.ReactNode;
}

export const DatePickerProvider = ({ children }: DatePickerProviderProps) => {
  return <DropdownProvider>{children}</DropdownProvider>;
};

interface DatePickerBaseProps {
  value: Date;
  onChange: (date: Date) => void;
}

interface BaseDatePickerProps extends DatePickerBaseProps {
  header: React.ReactNode;
  children: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
}

const BaseDatePicker = ({
  onPrev,
  onNext,
  header,
  children,
}: BaseDatePickerProps) => {
  return (
    <View className="flex-col bg-white ">
      {/* header */}
      <View className="flex-row items-center justify-between border-b border-neutral-200 p-2">
        <TouchableOpacity onPress={onPrev}>
          <Ionicons name="chevron-back" size={20} color="#333" />
        </TouchableOpacity>
        {header}
        <TouchableOpacity onPress={onNext}>
          <Ionicons name="chevron-forward" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      {/* body */}
      <View>{children}</View>
    </View>
  );
};

interface DatePickerItemProps {
  value: Date;
  active?: boolean;
  isCurrent?: boolean;
  disabled?: boolean;
  onPick: (value: Date) => void;
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const DatePickerItem = ({
  value,
  onPick,
  active,
  disabled,
  isCurrent,
  children,
  className,
  style,
}: DatePickerItemProps) => {
  const backgroundColor = active
    ? 'bg-[#cee6b3]'
    : isCurrent
      ? 'bg-neutral-200'
      : '';

  return (
    <TouchableOpacity
      onPress={() => onPick(value)}
      className={`items-center justify-center rounded-md ${backgroundColor} ${className}`}
      style={[style, { opacity: disabled ? 0.4 : 1 }]}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
};

const DecadePicker = ({ value, onChange }: DatePickerBaseProps) => {
  const [century, setCentury] = useState(floor(value, 'century'));

  const padding = 1;

  const candidates = Array.from(
    { length: 10 + padding * 2 },
    (_, i) => new Date(century.getFullYear() + (i - padding) * 10, 0, 1),
  );

  const handlePrev = () => {
    setCentury(prev(century, 'century'));
  };

  const handleNext = () => {
    setCentury(next(century, 'century'));
  };

  return (
    <BaseDatePicker
      value={value}
      onChange={onChange}
      onPrev={handlePrev}
      onNext={handleNext}
      header={<Text>{display(century, 'century')}</Text>}
    >
      <View className="h-full flex-row flex-wrap gap-1 p-1">
        {candidates.map((date, index) => (
          <DatePickerItem
            key={date.toISOString()}
            value={date}
            active={date.getFullYear() === value.getFullYear()}
            isCurrent={isCurrent(date, 'decade')}
            disabled={index < padding || index >= 10 + padding}
            onPick={() => {
              onChange(date);
            }}
            className="p1-2 py-5"
            style={{
              width: `${100 / 4 - 2}%`,
            }}
          >
            <Text>{displayShort(date, 'decade')}</Text>
          </DatePickerItem>
        ))}
      </View>
    </BaseDatePicker>
  );
};

const YearPicker = ({ value, onChange }: DatePickerBaseProps) => {
  const [decade, setDecade] = useState(floor(value, 'decade'));

  const [decadePickerVisible, setDecadePickerVisible] = useState(false);

  const Header = () => {
    return (
      <TouchableOpacity onPress={() => setDecadePickerVisible(true)}>
        <Text className="text-lg">{display(decade, 'decade')}</Text>
      </TouchableOpacity>
    );
  };

  const handleDecadeChange = (date: Date) => {
    setDecade(date);
    setDecadePickerVisible(false);
  };

  const padding = 1;

  const candidates = Array.from(
    { length: 10 + padding * 2 },
    (_, i) => new Date(decade.getFullYear() + (i - padding), 0, 1),
  );

  const handlePrev = () => {
    setDecade(prev(decade, 'decade'));
  };

  const handleNext = () => {
    setDecade(next(decade, 'decade'));
  };

  return (
    <>
      {decadePickerVisible && (
        <View className="absolute z-[100] bg-white">
          <DecadePicker value={decade} onChange={handleDecadeChange} />
        </View>
      )}
      <BaseDatePicker
        value={value}
        onChange={onChange}
        onPrev={handlePrev}
        onNext={handleNext}
        header={<Header />}
      >
        <View
          className="h-full flex-row flex-wrap gap-2"
          style={{
            opacity: decadePickerVisible ? 0 : 1,
          }}
        >
          {candidates.map((date, index) => (
            <DatePickerItem
              key={date.toISOString()}
              value={date}
              active={date.getFullYear() === value.getFullYear()}
              isCurrent={isCurrent(date, 'year')}
              disabled={index < padding || index >= 10 + padding}
              onPick={() => {
                onChange(date);
              }}
              className="px-2 py-5"
              style={{
                width: `${100 / 4 - 2}%`,
              }}
            >
              <Text>{displayShort(date, 'year')}</Text>
            </DatePickerItem>
          ))}
        </View>
      </BaseDatePicker>
    </>
  );
};

const MonthPicker = ({ value, onChange }: DatePickerBaseProps) => {
  const [year, setYear] = useState(floor(value, 'year'));

  const [yearPickerVisible, setYearPickerVisible] = useState(false);

  const Header = () => {
    return (
      <TouchableOpacity onPress={() => setYearPickerVisible(true)}>
        <Text className="text-lg">{display(year, 'year')}</Text>
      </TouchableOpacity>
    );
  };

  const handleYearChange = (date: Date) => {
    setYear(date);
    setYearPickerVisible(false);
  };

  const candidates = Array.from(
    { length: 12 },
    (_, i) => new Date(year.getFullYear(), i, 1),
  );

  const handlePrev = () => {
    setYear(prev(year, 'year'));
  };

  const handleNext = () => {
    setYear(next(year, 'year'));
  };

  return (
    <>
      {yearPickerVisible && (
        <View className="absolute z-[100] bg-white">
          <YearPicker value={year} onChange={handleYearChange} />
        </View>
      )}
      <BaseDatePicker
        value={value}
        onChange={onChange}
        onPrev={handlePrev}
        onNext={handleNext}
        header={<Header />}
      >
        <View
          className="flex-row flex-wrap gap-2 p-1"
          style={{
            opacity: yearPickerVisible ? 0 : 1,
          }}
        >
          {candidates.map((date) => (
            <DatePickerItem
              key={date.toISOString()}
              value={date}
              active={
                date.getFullYear() === value.getFullYear() &&
                date.getMonth() === value.getMonth()
              }
              isCurrent={isCurrent(date, 'month')}
              onPick={() => {
                onChange(date);
              }}
              className="px-2 py-5"
              style={{
                width: `${100 / 4 - 2}%`,
              }}
            >
              <Text>{displayShort(date, 'month')}</Text>
            </DatePickerItem>
          ))}
        </View>
      </BaseDatePicker>
    </>
  );
};

const DayPicker = ({ value, onChange }: DatePickerBaseProps) => {
  const [month, setMonth] = useState(floor(value, 'month'));

  const [monthPickerVisible, setMonthPickerVisible] = useState(false);

  const Header = () => {
    return (
      <TouchableOpacity onPress={() => setMonthPickerVisible(true)}>
        <Text className="text-lg">{display(month, 'month')}</Text>
      </TouchableOpacity>
    );
  };

  const handleMonthChange = (date: Date) => {
    setMonth(date);
    setMonthPickerVisible(false);
  };

  const days = getDaysInMonth(month.getFullYear(), month.getMonth());
  const firstWeekday =
    (getFirstDayOfMonth(month.getFullYear(), month.getMonth()) + 6) % 7;

  const paddingStart = firstWeekday;
  const paddingEnd = 7 - (((days + paddingStart - 1) % 7) + 1);

  const candidates = Array.from(
    { length: days + paddingStart + paddingEnd },
    (_, i) =>
      new Date(month.getFullYear(), month.getMonth(), i - paddingStart + 1),
  );

  const handlePrev = () => {
    setMonth(prev(month, 'month'));
  };

  const handleNext = () => {
    setMonth(next(month, 'month'));
  };

  return (
    <>
      {monthPickerVisible && (
        <View className="absolute z-[100] bg-white">
          <MonthPicker value={month} onChange={handleMonthChange} />
        </View>
      )}
      <BaseDatePicker
        value={value}
        onChange={onChange}
        onPrev={handlePrev}
        onNext={handleNext}
        header={<Header />}
      >
        <View
          className="flex-row flex-wrap gap-2 p-1"
          style={{
            opacity: monthPickerVisible ? 0 : 1,
          }}
        >
          {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
            <View
              key={day}
              className="items-center justify-center p-2"
              style={{
                width: `${100 / 7 - 2}%`,
              }}
            >
              <Text>{day}</Text>
            </View>
          ))}
          {candidates.map((date, index) => (
            <DatePickerItem
              key={date.toISOString()}
              value={date}
              active={
                date.getFullYear() === value.getFullYear() &&
                date.getMonth() === value.getMonth() &&
                date.getDate() === value.getDate()
              }
              isCurrent={isCurrent(date, 'day')}
              onPick={() => {
                onChange(date);
              }}
              disabled={index < paddingStart || index >= paddingStart + days}
              style={{
                width: `${100 / 7 - 2}%`,
                paddingVertical: 8,
              }}
            >
              <Text>{displayShort(date, 'day')}</Text>
            </DatePickerItem>
          ))}
        </View>
      </BaseDatePicker>
    </>
  );
};

const WeekPicker = ({ value, onChange }: DatePickerBaseProps) => {
  const [month, setMonth] = useState(floor(value, 'month'));

  const [monthPickerVisible, setMonthPickerVisible] = useState(false);

  const Header = () => {
    return (
      <TouchableOpacity onPress={() => setMonthPickerVisible(true)}>
        <Text className="text-lg">{display(month, 'month')}</Text>
      </TouchableOpacity>
    );
  };

  const handleMonthChange = (date: Date) => {
    setMonth(date);
    setMonthPickerVisible(false);
  };

  const days = getDaysInMonth(month.getFullYear(), month.getMonth());
  const firstWeekday =
    (getFirstDayOfMonth(month.getFullYear(), month.getMonth()) + 6) % 7;

  const paddingStart = firstWeekday;
  const paddingEnd = 7 - (((days + paddingStart - 1) % 7) + 1);

  const weeks = (days + paddingStart + paddingEnd) / 7;

  const candidates = Array.from(
    { length: weeks },
    (_, i) =>
      new Date(month.getFullYear(), month.getMonth(), 7 * i - paddingStart + 1),
  );

  const handlePrev = () => {
    setMonth(prev(month, 'month'));
  };

  const handleNext = () => {
    setMonth(next(month, 'month'));
  };

  return (
    <>
      {monthPickerVisible && (
        <View className="absolute z-[100] bg-white">
          <MonthPicker value={month} onChange={handleMonthChange} />
        </View>
      )}
      <BaseDatePicker
        value={value}
        onChange={onChange}
        onPrev={handlePrev}
        onNext={handleNext}
        header={<Header />}
      >
        <View
          className="flex-row gap-1"
          style={{
            opacity: monthPickerVisible ? 0 : 1,
          }}
        >
          <View className="justify-end gap-2 pb-1">
            {/* kth week */}
            {candidates.map((date, index) => (
              <View
                key={index}
                className="w-8 items-center justify-center"
                style={{
                  paddingVertical: 2,
                  marginVertical: 2,
                }}
              >
                <Text>{kthWeek(date) + 1}</Text>
              </View>
            ))}
          </View>
          <View className="flex-1 flex-col">
            <View
              className="flex-row gap-2 p-1"
              style={{
                opacity: monthPickerVisible ? 0 : 1,
              }}
            >
              {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
                <View
                  key={day}
                  className="items-center justify-center p-2"
                  style={{
                    width: `${100 / 7 - 2}%`,
                  }}
                >
                  <Text>{day}</Text>
                </View>
              ))}
            </View>
            {candidates.map((date, index) => (
              <DatePickerItem
                key={date.toISOString()}
                value={date}
                active={
                  floor(date, 'week').getTime() ===
                  floor(value, 'week').getTime()
                }
                isCurrent={isCurrent(date, 'week')}
                onPick={() => {
                  onChange(date);
                }}
                className="flex-row gap-2 p-1 px-0"
              >
                {Array.from({ length: 7 }, (_, i) => (
                  <View
                    key={i}
                    style={{
                      width: `${100 / 7 - 2}%`,
                      paddingVertical: 2,
                      marginVertical: 2,
                      opacity:
                        index * 7 + i < paddingStart ||
                        index * 7 + i >= paddingStart + days
                          ? 0.5
                          : 1,
                    }}
                    className="items-center justify-center "
                  >
                    <Text>
                      {displayShort(
                        new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate() + i,
                        ),
                        'day',
                      )}
                    </Text>
                  </View>
                ))}
              </DatePickerItem>
            ))}
          </View>
        </View>
      </BaseDatePicker>
    </>
  );
};

interface DatePickerProps extends DatePickerBaseProps {
  picker: 'year' | 'month' | 'week' | 'day';
}

export const DatePicker = ({ picker, value, onChange }: DatePickerProps) => {
  const chevronRotate = useSharedValue(0);
  const chevronAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${chevronRotate.value}deg` }],
    };
  });

  const { trigger, clear, visible } = useContext(DropdownContext);

  const anchorRef = useRef<View>(null);
  const anchorLayoutRef = useRef<LayoutRectangle | null>(null);
  const onLayout = () => {
    // eslint-disable-next-line max-params
    anchorRef.current?.measure((x, y, width, height) => {
      anchorLayoutRef.current = { width, height, x, y };
    });
  };

  const handleChange = (newValue: Date) => {
    onChange(newValue);
    chevronRotate.value = withTiming(0, {
      duration: 200,
    });
    clear();
  };

  const handlePress = () => {
    const layout = anchorLayoutRef.current ?? {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    switch (picker) {
      case 'year':
        trigger([<YearPicker value={value} onChange={handleChange} />], layout);
        break;
      case 'month':
        trigger(
          [<MonthPicker value={value} onChange={handleChange} />],
          layout,
        );
        break;
      case 'day':
        trigger([<DayPicker value={value} onChange={handleChange} />], layout);
        break;
      case 'week':
        trigger([<WeekPicker value={value} onChange={handleChange} />], layout);
        break;
      default:
        break;
    }
    chevronRotate.value = withTiming(180, {
      duration: 200,
    });
  };

  useEffect(() => {
    if (!visible) {
      chevronRotate.value = withTiming(0, {
        duration: 200,
      });
    }
  }, [chevronRotate, picker, visible]);

  return (
    <>
      <View
        ref={anchorRef}
        onLayout={onLayout}
        className="absolute h-[40px] w-full"
      ></View>
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row items-center gap-1"
      >
        <Text className="text-xl font-medium">{display(value, picker)}</Text>
        <Animated.View
          style={[
            {
              transformOrigin: 'center',
              marginLeft: 4,
            },
            chevronAnimatedStyle,
          ]}
        >
          <Ionicons name="chevron-down" size={24} color="#666" />
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};

/**
 * Get the first day of specified interval
 *
 * @param value
 * @param interval
 * @returns
 */
function floor(value: Date, interval: IntervalType): Date {
  switch (interval) {
    case 'year':
      return new Date(value.getFullYear(), 0, 1);
    case 'month':
      return new Date(value.getFullYear(), value.getMonth(), 1);
    case 'week':
      return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate() - ((value.getDay() + 6) % 7),
      );
    case 'day':
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    case 'decade':
      return new Date(value.getFullYear() - (value.getFullYear() % 10), 0, 1);
    case 'century':
      return new Date(value.getFullYear() - (value.getFullYear() % 100), 0, 1);
  }
}

function prev(value: Date, interval: IntervalType): Date {
  switch (interval) {
    case 'year':
      return new Date(value.getFullYear() - 1, 0, 1);
    case 'month':
      return new Date(value.getFullYear(), value.getMonth() - 1, 1);
    case 'week':
      return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate() - 7,
      );
    case 'day':
      return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate() - 1,
      );
    case 'decade':
      return new Date(value.getFullYear() - 10, 0, 1);
    case 'century':
      return new Date(value.getFullYear() - 100, 0, 1);
  }
}

function next(value: Date, interval: IntervalType): Date {
  switch (interval) {
    case 'year':
      return new Date(value.getFullYear() + 1, 0, 1);
    case 'month':
      return new Date(value.getFullYear(), value.getMonth() + 1, 1);
    case 'week':
      return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate() + 7,
      );
    case 'day':
      return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate() + 1,
      );
    case 'decade':
      return new Date(value.getFullYear() + 10, 0, 1);
    case 'century':
      return new Date(value.getFullYear() + 100, 0, 1);
  }
}

function isCurrent(value: Date, interval: IntervalType): boolean {
  const current = new Date();
  return (
    floor(current, interval).getTime() === floor(value, interval).getTime()
  );
}

function display(value: Date, interval: IntervalType): string {
  value = floor(value, interval);
  switch (interval) {
    case 'year':
      return `${value.getFullYear()}年`;
    case 'month':
      return `${value.getFullYear()}年${value.getMonth() + 1}月`;
    case 'week':
      return `${value.getFullYear()}年第${kthWeek(value) + 1}周`;
    case 'day':
      return `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`;
    case 'decade':
      return `${value.getFullYear()}年-${value.getFullYear() + 9}年`;
    case 'century':
      return `${value.getFullYear()}年-${value.getFullYear() + 99}年`;
  }
}

function displayShort(value: Date, interval: IntervalType): string {
  value = floor(value, interval);
  switch (interval) {
    case 'year':
      return `${value.getFullYear()}年`;
    case 'month':
      return `${value.getMonth() + 1}月`;
    case 'week':
      return `第${kthWeek(value) + 1}周`;
    case 'day':
      return `${value.getDate()}`;
    case 'decade':
      return `${value.getFullYear()}-${value.getFullYear() + 9}`;
    case 'century':
      return `${value.getFullYear()}-${value.getFullYear() + 99}`;
  }
}

// https://www.alonehero.com/2024/12/26/%E4%B8%80%E5%B9%B4%E4%B8%AD%E7%9A%84%E7%AC%AC%E4%B8%80%E5%91%A8%E8%AF%A5%E5%A6%82%E4%BD%95%E8%AE%A1%E7%AE%97%EF%BC%9F/
function kthWeek(value: Date): number {
  const dayNum = value.getDay() || 7;
  const thursday = new Date(value);
  thursday.setDate(value.getDate() + 4 - dayNum);

  const yearStart = new Date(thursday.getFullYear(), 0, 1);

  const days =
    Math.floor((thursday.getTime() - yearStart.getTime()) / 86400000) + 1;

  return Math.ceil(days / 7) - 1;
}
