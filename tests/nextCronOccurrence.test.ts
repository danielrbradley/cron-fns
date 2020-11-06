import { nextCronOccurrence } from "../nextCronOccurrence";

test("nextCronOccurrence", () => {
  const from = new Date("2020-01-01T00:00:00");
  const schedule = "30 12 15 06 *";
  const expected = new Date("2020-06-15T12:30:00");
  expect(nextCronOccurrence(schedule, from)).toEqual(expected);
});

test("nextCronOccurrence without from", () => {
  const schedule = "30 12 15 06 *";
  expect(nextCronOccurrence(schedule)).not.toBeUndefined();
});
