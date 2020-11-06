/** @name Schedule
 *  @description Any field which is undefined is assumed to be unconstrained.
 */
export type Schedule = [
  second: number[] | undefined,
  minute: number[] | undefined,
  hour: number[] | undefined,
  dayOfMonth: number[] | undefined,
  month: number[] | undefined,
  dayOfWeek: number[] | undefined,
  year: number[] | undefined
];

export enum Field {
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
  return fields.map(parseField) as Schedule;
}
