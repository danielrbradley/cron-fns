import { parse } from "./parse";
import { next } from "./next";

/**
 * Generate a sequence of the next times for the given cron schedule
 * @param schedule Cron schedule string e.g. `0,30 9-17 * * MON-FRI`
 * @param from Option start point after which to find the next matching dates.
 * @returns A generator of subsequent dates.
 * @throws If the schedule string is not valid cron syntax.
 */
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
