import { parse } from "./parse";
import { next } from "./next";

export function nextCronOccurrence(
  schedule: string,
  from?: Date
): Date | undefined {
  return next(parse(schedule), from ?? new Date());
}
