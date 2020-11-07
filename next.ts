/**
 * @packageDocumentation
 * @ignore
 */

import { Field, Schedule } from "./parse";

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
    schedule[Field.hour]
  );
  if (hourChange) {
    current.setHours(
      hour,
      findNext(0, schedule[Field.minute])[0],
      findNext(0, schedule[Field.second])[0]
    );
    return carryDay;
  }

  let [minute, carryHour, minuteChange] = findNext(
    current.getMinutes(),
    schedule[Field.minute]
  );
  if (minuteChange) {
    if (carryHour) {
      let [hour, carryDay] = findNext(
        current.getHours() + 1,
        schedule[Field.hour]
      );
      current.setHours(hour, minute, findNext(0, schedule[Field.second])[0]);
      return carryDay;
    } else {
      current.setMinutes(minute, findNext(0, schedule[Field.second])[0]);
      return false;
    }
  }

  const [second, carryMinute, secondChange] = findNext(
    current.getSeconds(),
    schedule[Field.second]
  );
  if (!carryMinute) {
    if (secondChange) {
      current.setSeconds(second);
    }
    return false;
  }

  [minute, carryHour] = findNext(
    current.getMinutes() + 1,
    schedule[Field.minute]
  );
  if (!carryHour) {
    current.setMinutes(minute, second);
    return false;
  }

  [hour, carryDay] = findNext(current.getHours() + 1, schedule[Field.hour]);
  current.setHours(hour, minute, second);
  return carryDay;
}

function isDateValid(current: Date, schedule: Schedule): boolean {
  const year = schedule[Field.year];
  const month = schedule[Field.month];
  const dayOfMonth = schedule[Field.dayOfMonth];
  const dayOfWeek = schedule[Field.dayOfWeek];
  return (
    (!year || year.indexOf(current.getFullYear()) > -1) &&
    (!month || month.indexOf(current.getMonth()) > -1) &&
    (!dayOfMonth || dayOfMonth.indexOf(current.getDate()) > -1) &&
    (!dayOfWeek || dayOfWeek.indexOf(current.getDay()) > -1)
  );
}

/** @returns Boolean indicating if we've found a next possible day */
function moveToNextPossibleDate(current: Date, schedule: Schedule): boolean {
  // Increment date
  current.setDate(current.getDate() + 1);

  let [year, noMoreYears, yearChanged] = findNext(
    current.getFullYear(),
    schedule[Field.year]
  );
  if (noMoreYears) return false;
  if (yearChanged) {
    current.setFullYear(
      year,
      findNext(0, schedule[Field.month])[0],
      findNext(1, schedule[Field.dayOfMonth])[0]
    );
    return true;
  }

  let [month, carryYear, monthChanged] = findNext(
    current.getMonth(),
    schedule[Field.month]
  );
  if (carryYear) {
    current.setFullYear(
      current.getFullYear() + 1,
      month,
      findNext(1, schedule[Field.dayOfMonth])[0]
    );
    return true;
  }
  if (monthChanged) {
    current.setMonth(month, findNext(1, schedule[Field.dayOfMonth])[0]);
    return true;
  }

  const [date, carryMonth, dateChanged] = findNext(
    current.getDate(),
    schedule[Field.dayOfMonth]
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

/**
 * Internal function for finding the next date from a parsed schedule.
 *
 * Avoid depending on this method directly as it might change without notice.
 * @internal
 */
export const next = (schedule: Schedule, from: Date): Date | undefined => {
  const date = new Date(from.getTime());
  switch (moveToNextValidDate(date, schedule)) {
    case -1:
      return undefined;
    case 0:
      date.setSeconds(date.getSeconds() + 1, 0);
      break;
    case 1:
      date.setHours(0, 0, 0, 0);
      break;
  }

  const carryDay = moveToNextValidTime(date, schedule);

  if (!carryDay) {
    return date;
  }

  date.setDate(date.getDate() + 1);
  if (moveToNextValidDate(date, schedule) === -1) {
    return undefined;
  }
  return date;
};
