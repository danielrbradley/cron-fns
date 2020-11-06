import { nextCronOccurrences } from "../nextCronOccurrences";

test("nextCronOccurrences", () => {
  const from = new Date("2020-01-01T00:00:00");
  const schedule = "30 12 15 01,06 * 2020-2021";
  const expected = [
    new Date("2020-01-15T12:30:00"),
    new Date("2020-06-15T12:30:00"),
    new Date("2021-01-15T12:30:00"),
    new Date("2021-06-15T12:30:00"),
  ];
  expect(Array.from(nextCronOccurrences(schedule, from))).toEqual(expected);
});

test("nextCronOccurrences without from", () => {
  const schedule = "30 12 15 01,06 *";
  const generator = nextCronOccurrences(schedule);
  const next = generator.next();
  expect(next.value).not.toBeUndefined();
  expect(next.done).toBe(false);
});
