import { next } from "./index";

test("no constraints", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-01T00:00:01");
  expect(next({}, input)).toEqual(expected);
});

test("seconds", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-01T00:00:03");
  expect(next({ second: [3] }, input)).toEqual(expected);
});

test("minutes", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-01T00:02:00");
  expect(next({ minute: [2] }, input)).toEqual(expected);
});

test("minutes and seconds", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-01T00:02:03");
  expect(next({ minute: [2], second: [3] }, input)).toEqual(expected);
});

test("hours", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-01T04:00:00");
  expect(next({ hour: [4] }, input)).toEqual(expected);
});

test("day of month", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-02T00:00:00");
  expect(
    next(
      {
        dayOfMonth: [2],
      },
      input
    )
  ).toEqual(expected);
});

test("month", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-02-01T00:00:00");
  expect(
    next(
      {
        month: [1],
      },
      input
    )
  ).toEqual(expected);
});

test("year", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2021-01-01T00:00:00");
  expect(
    next(
      {
        year: [2021],
      },
      input
    )
  ).toEqual(expected);
});

test("all", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2021-02-03T04:05:06");
  expect(
    next(
      {
        year: [2021],
        month: [1],
        dayOfMonth: [3],
        hour: [4],
        minute: [5],
        second: [6],
      },
      input
    )
  ).toEqual(expected);
});

test("all except year", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-02-03T04:05:06");
  expect(
    next(
      {
        month: [1],
        dayOfMonth: [3],
        hour: [4],
        minute: [5],
        second: [6],
      },
      input
    )
  ).toEqual(expected);
});
