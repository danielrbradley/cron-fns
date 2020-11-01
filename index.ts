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

function parseCron(input: string): Schedule {
  throw new Error("Not implemented"); // TODO
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
  let [year, noMoreYears, yearChanged] = findNext(
    current.getFullYear(),
    schedule.year
  );
  if (noMoreYears) return false;
  if (yearChanged) {
    current.setFullYear(year, 0, 1);
    return true;
  }

  let [month, carryYear, monthChanged] = findNext(
    current.getMonth(),
    schedule.month
  );
  if (carryYear) {
    current.setFullYear(current.getFullYear() + 1, month, 1);
    return true;
  }
  if (monthChanged) {
    current.setMonth(month, 1);
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
    typeof schedule === "string" ? parseCron(schedule) : schedule;
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
