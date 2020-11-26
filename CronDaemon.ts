import { parse, Schedule } from "./parse";
import { next } from "./next";

// When delay is larger than `(2^31) - 1)` the delay will be set to 1.
const MAX_DELAY = 2147483647;

/**
 * Calculate the next time to execute the job.
 */
export type CustomSchedule = (now: Date) => Date | undefined;

/**
 * Execute a cron schedule. The Daemon is initialized in the "started" state.
 * @param schedule Cron schedule string e.g. `0,30 9-17 * * MON-FRI` or custom function to calculate the next date.
 * @param callback Function to be invoked on the schedule.
 * @throws If the schedule string is not valid cron syntax.
 */
export class CronDaemon {
  private readonly schedule: Schedule | CustomSchedule;
  private readonly callback: (date: Date) => void;
  private timeout?: ReturnType<typeof setTimeout>;
  constructor(
    schedule: string | CustomSchedule,
    callback: (triggered: Date) => void
  ) {
    switch (typeof schedule) {
      case "string":
        this.schedule = parse(schedule);
        break;
      case "function":
        this.schedule = schedule;
        break;
      default:
        throw new Error("Invalid schedule type");
    }
    this.callback = callback;
    this.start();
  }

  /** Start running the schedule */
  start() {
    if (this.timeout) {
      return;
    }
    const nextTime = this.next();
    if (!nextTime) {
      return;
    }

    const diff = nextTime.getTime() - Date.now();
    const delay = diff > MAX_DELAY ? MAX_DELAY : diff;
    this.timeout = setTimeout(() => {
      // Might still need to wait longer
      if (new Date() >= nextTime) {
        this.callback(nextTime);
      }

      // Restart
      delete this.timeout;
      this.start();
    }, delay);
  }

  /**
   * Get the next occurance in the schedule.
   * @returns The next instant when the daemon will execute the callback or undefined if the schedule has no more possible instances. */
  next(): Date | undefined {
    return typeof this.schedule === "function"
      ? this.schedule(new Date())
      : next(this.schedule, new Date());
  }

  /**
   * Current state of the daemon.
   * @returns `running` or `stopped`
   */
  state(): "running" | "stopped" {
    return this.timeout ? "running" : "stopped";
  }

  /** Stops the daemon running the schedule */
  stop() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      delete this.timeout;
    }
  }
}
