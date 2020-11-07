import { parse } from "./parse";
import { next } from "./next";

/**
 * Fetch the next time in the cron schedule
 * @param schedule Cron schedule string e.g. `0,30 9-17 * * MON-FRI`
 * @param from Option start point after which to find the next matching date.
 * @returns The next date in the sequence or undefined if there are no more dates in the sequence.
 * @throws If the schedule string is not valid cron syntax.
 */
export function nextCronOccurrence(
  schedule: string,
  from?: Date
): Date | undefined {
  return next(parse(schedule), from ?? new Date());
}
