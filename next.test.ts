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

test("day of week", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-07T00:00:00");
  const schedule = {
    dayOfWeek: [2],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("day of month", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-02T00:00:00");
  const schedule = {
    dayOfMonth: [2],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("day of month and week", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-02-03T00:00:00");
  const schedule = {
    dayOfMonth: [3],
    dayOfWeek: [1],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("month", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-02-01T00:00:00");
  const schedule = {
    month: [1],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("year", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2021-01-01T00:00:00");
  const schedule = {
    year: [2021],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("all", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2021-02-03T04:05:06");
  const schedule = {
    year: [2021],
    month: [1],
    dayOfMonth: [3],
    hour: [4],
    minute: [5],
    second: [6],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("all except year", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-02-03T04:05:06");
  const schedule = {
    month: [1],
    dayOfMonth: [3],
    hour: [4],
    minute: [5],
    second: [6],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("roll minute", () => {
  const input = new Date("2020-01-01T00:00:30");
  const expected = new Date("2020-01-01T00:01:06");
  const schedule = {
    second: [6],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("roll hour", () => {
  const input = new Date("2020-01-01T00:30:00");
  const expected = new Date("2020-01-01T01:05:00");
  const schedule = {
    minute: [5],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("roll day", () => {
  const input = new Date("2020-01-01T12:00:00");
  const expected = new Date("2020-01-02T04:00:00");
  const schedule = {
    hour: [4],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("roll month", () => {
  const input = new Date("2020-01-15T00:00:00");
  const expected = new Date("2020-02-03T00:00:00");
  const schedule = {
    dayOfMonth: [3],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("roll year", () => {
  const input = new Date("2020-06-01T00:00:00");
  const expected = new Date("2021-02-01T00:00:00");
  const schedule = {
    month: [1],
  };
  expect(next(schedule, input)).toEqual(expected);
});

test("roll all", () => {
  const input = new Date("2020-12-31T23:59:30");
  const expected = new Date("2021-01-01T00:00:05");
  const schedule = {
    second: [5],
  };
  expect(next(schedule, input)).toEqual(expected);
});
