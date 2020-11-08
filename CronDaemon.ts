import { parse, Schedule } from "./parse";
import { next } from "./next";

// When delay is larger than 2147483647 or less than 1, the delay will be set to 1.
const MAX_DELAY = Math.pow(2, 32 - 1) - 1;

/**
 * Execute a cron schedule. The Daemon is initialized in the "started" state.
 * @param schedule Cron schedule string e.g. `0,30 9-17 * * MON-FRI`
 * @param callback Function to be invoked on the schedule.
 * @throws If the schedule string is not valid cron syntax.
 */
export class CronDaemon {
  private readonly schedule: Schedule;
  private readonly callback: (date: Date) => void;
  private timeout?: ReturnType<typeof setTimeout>;
  constructor(schedule: string, callback: (triggered: Date) => void) {
    this.schedule = parse(schedule);
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
    return next(this.schedule, new Date());
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
