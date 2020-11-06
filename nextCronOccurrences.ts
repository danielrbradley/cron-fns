import { parse } from "./parse";
import { next } from "./next";

export function* nextCronOccurrences(
  schedule: string,
  from?: Date
): Generator<Date> {
  const parsed = parse(schedule);
  let current = from;
  do {
    current = next(parsed, current ?? new Date());
    if (current !== undefined) {
      yield current;
    }
  } while (current !== undefined);
}
