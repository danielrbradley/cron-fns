import { parse, Schedule } from "./parse";
import { next } from "./next";

/**
 * Instance of a cron schedule - avoids re-parsing the string for each time you want to execute the schedule.
 * @param schedule Cron schedule string e.g. `0,30 9-17 * * MON-FRI`
 * @throws If the schedule string is not valid cron syntax.
 */
export class Cron {
  private readonly schedule: Schedule;
  constructor(schedule: string) {
    this.schedule = parse(schedule);
  }
  /**
   * Fetch the next time in the cron schedule
   * @param from Option start point after which to find the next matching date.
   * @returns The next date in the sequence or undefined if there are no more dates in the sequence.
   */
  next(from?: Date) {
    return next(this.schedule, from ?? new Date());
  }
}
