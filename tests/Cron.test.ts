import { Cron } from "../Cron";

test("Cron", () => {
  const from = new Date("2020-01-01T00:00:00");
  const schedule = "30 12 15 06 *";
  const expected = new Date("2020-06-15T12:30:00");
  expect(new Cron(schedule).next(from)).toEqual(expected);
});

test("Cron without from", () => {
  const schedule = "30 12 15 06 *";
  expect(new Cron(schedule).next()).not.toBeUndefined();
});
