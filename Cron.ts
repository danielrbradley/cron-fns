import { parse, Schedule } from "./parse";
import { next } from "./next";

/** Instance of a cron schedule - avoids re-parsing the string for each time you want to execute the schedule. */
export class Cron {
  private readonly schedule: Schedule;
  constructor(schedule: string) {
    this.schedule = parse(schedule);
  }
  next(from?: Date) {
    return next(this.schedule, from ?? new Date());
  }
}
