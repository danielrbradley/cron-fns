/** @name Schedule
 *  @description Any field which is not defined or empty is assumed to be unconstrained.
 */
type Schedule = {
  second?: number[];
  minute?: number[];
  hour?: number[];
  dayOfMonth?: number[];
  month?: number[];
  dayOfWeek?: number[];
  year?: number[];
};

enum Field {
  second = 0,
  minute = 1,
  hour = 2,
  dayOfMonth = 3,
  month = 4,
  dayOfWeek = 5,
  year = 6,
}

type FieldConfig = {
  name: string;
  min: number;
  max: number;
  adjustment: number;
  names: Record<string, number>;
};

const monthMap = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

const dayOfWeekMap = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

const fieldsConfig: FieldConfig[] = [
  { name: "Second", min: 0, max: 59, adjustment: 0, names: {} },
  { name: "Minute", min: 0, max: 59, adjustment: 0, names: {} },
  { name: "Hour", min: 0, max: 23, adjustment: 0, names: {} },
  { name: "Day of month", min: 1, max: 31, adjustment: 0, names: {} },
  { name: "Month", min: 1, max: 12, adjustment: -1, names: monthMap },
  { name: "Day of week", min: 0, max: 6, adjustment: 0, names: dayOfWeekMap },
  { name: "Year", min: 1970, max: 3000, adjustment: 0, names: {} },
];

function parseField(input: string, field: Field): number[] | undefined {
  if (input === "*") return undefined;
  const config = fieldsConfig[field];
  function parseValue(value: string) {
    if (value in config.names) {
      return config.names[value];
    }
    const asNumber = Number.parseInt(value, 10);
    if (Number.isNaN(asNumber)) {
      throw new Error(`${config.name} invalid value: ${value}`);
    }
    if (asNumber < config.min || asNumber > config.max) {
      throw new Error(
        `${config.name} is out of bounds (${config.min}-${config.max}): ${value}`
      );
    }
    return asNumber + config.adjustment;
  }
  const asRange = /^(.+)\-(.+)$/g.exec(input);
  if (asRange) {
    const start = parseValue(asRange[1]);
    const end = parseValue(asRange[2]);
    if (start > end) {
      throw new Error(
        `${config.name} invalid range: start cannot be after end`
      );
    }
    const range = new Array(end - start + 1);
    for (let index = 0; index < range.length; index++) {
      range[index] = start + index;
    }
    return range;
  }

  return input.split(",").map(parseValue);
}

export function parse(input: string): Schedule {
  const fields = input.split(" ");
  if (fields.length > 7) throw new Error("Too many fields");
  if (fields.length < 5) throw new Error("Too few fields");
  const hasYear = fields.length >= 6;
  const hasSeconds = fields.length === 7;
  if (!hasSeconds) fields.unshift("0");
  if (!hasYear) fields.push("*");
  const parsedFields = fields.map(parseField);
  const parsed: any = {
    second: parsedFields[0],
    minute: parsedFields[1],
    hour: parsedFields[2],
    dayOfMonth: parsedFields[3],
    month: parsedFields[4],
    dayOfWeek: parsedFields[5],
    year: parsedFields[6],
  };
  for (const field of Object.keys(parsed)) {
    if (!parsed[field]) {
      delete parsed[field];
    }
  }
  return parsed;
}

function findNext(
  current: number,
  schedule: undefined | number[]
): [val: number, carry: boolean, changed: boolean] {
  if (!schedule || schedule.length === 0) {
    return [current, false, false];
  }
  for (const n of schedule) {
    if (n >= current) {
      return [n, false, n !== current];
    }
  }
  return [schedule[0], true, true];
}

/** @returns Boolean indicating if we've moved to a new day */
function moveToNextValidTime(current: Date, schedule: Schedule): boolean {
  let [hour, carryDay, hourChange] = findNext(
    current.getHours(),
    schedule.hour
  );
  if (hourChange) {
    current.setHours(
      hour,
      findNext(0, schedule.minute)[0],
      findNext(0, schedule.second)[0]
    );
    return carryDay;
  }

  let [minute, carryHour, minuteChange] = findNext(
    current.getMinutes(),
    schedule.minute
  );
  if (minuteChange) {
    if (carryHour) {
      let [hour, carryDay] = findNext(current.getHours() + 1, schedule.hour);
      current.setHours(hour, minute, findNext(0, schedule.second)[0]);
      return carryDay;
    } else {
      current.setMinutes(minute, findNext(0, schedule.second)[0]);
      return false;
    }
  }

  const [second, carryMinute, secondChange] = findNext(
    current.getSeconds(),
    schedule.second
  );
  if (!carryMinute) {
    if (secondChange) {
      current.setSeconds(second);
    }
    return false;
  }

  [minute, carryHour] = findNext(current.getMinutes() + 1, schedule.minute);
  if (!carryHour) {
    current.setMinutes(minute, second);
    return false;
  }

  [hour, carryDay] = findNext(current.getHours() + 1, schedule.hour);
  current.setHours(hour, minute, second);
  return carryDay;
}

function isDateValid(current: Date, schedule: Schedule): boolean {
  return (
    (!schedule.year || schedule.year.indexOf(current.getFullYear()) > -1) &&
    (!schedule.month || schedule.month.indexOf(current.getMonth()) > -1) &&
    (!schedule.dayOfMonth ||
      schedule.dayOfMonth.indexOf(current.getDate()) > -1) &&
    (!schedule.dayOfWeek || schedule.dayOfWeek.indexOf(current.getDay()) > -1)
  );
}

/** @returns Boolean indicating if we've found a next possible day */
function moveToNextPossibleDate(current: Date, schedule: Schedule): boolean {
  // Increment date
  current.setDate(current.getDate() + 1);

  let [year, noMoreYears, yearChanged] = findNext(
    current.getFullYear(),
    schedule.year
  );
  if (noMoreYears) return false;
  if (yearChanged) {
    current.setFullYear(
      year,
      findNext(0, schedule.month)[0],
      findNext(1, schedule.dayOfMonth)[0]
    );
    return true;
  }

  let [month, carryYear, monthChanged] = findNext(
    current.getMonth(),
    schedule.month
  );
  if (carryYear) {
    current.setFullYear(
      current.getFullYear() + 1,
      month,
      findNext(1, schedule.dayOfMonth)[0]
    );
    return true;
  }
  if (monthChanged) {
    current.setMonth(month, findNext(1, schedule.dayOfMonth)[0]);
    return true;
  }

  const [date, carryMonth, dateChanged] = findNext(
    current.getDate(),
    schedule.dayOfMonth
  );
  if (carryMonth) {
    current.setMonth(current.getMonth() + 1, date);
    return true;
  }
  if (dateChanged) {
    current.setDate(date);
    return true;
  }

  return true;
}

/** @returns 0 if unchanged, 1 if changed, -1 if unavailable */
function moveToNextValidDate(current: Date, schedule: Schedule): 0 | 1 | -1 {
  let isValid = isDateValid(current, schedule);
  if (isValid) return 0;

  do {
    if (!moveToNextPossibleDate(current, schedule)) {
      return -1;
    }
  } while (!isDateValid(current, schedule));

  return 1;
}

export const next = (
  schedule: Schedule | string,
  from: Date
): Date | undefined => {
  const parsedSchedule =
    typeof schedule === "string" ? parse(schedule) : schedule;
  const date = new Date(from.getTime());
  switch (moveToNextValidDate(date, parsedSchedule)) {
    case -1:
      return undefined;
    case 0:
      date.setSeconds(date.getSeconds() + 1, 0);
      break;
    case 1:
      date.setHours(0, 0, 0, 0);
      break;
  }

  const carryDay = moveToNextValidTime(date, parsedSchedule);

  if (!carryDay) {
    return date;
  }

  date.setDate(date.getDate() + 1);
  if (moveToNextValidDate(date, parsedSchedule) === -1) {
    return undefined;
  }
  return date;
};
