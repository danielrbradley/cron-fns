import { next } from "../next";

const u = undefined;

test("no constraints", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-01T00:00:01");
  expect(next([u, u, u, u, u, u, u], input)).toEqual(expected);
});

test("seconds", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-01T00:00:03");
  expect(next([[3], u, u, u, u, u, u], input)).toEqual(expected);
});

test("minutes", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-01T00:02:00");
  expect(next([u, [2], u, u, u, u, u], input)).toEqual(expected);
});

test("minutes and seconds", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-01T00:02:03");
  expect(next([[3], [2], u, u, u, u, u], input)).toEqual(expected);
});

test("hours", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-01T04:00:00");
  expect(next([u, u, [4], u, u, u, u], input)).toEqual(expected);
});

test("day of week", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-07T00:00:00");
  expect(next([u, u, u, u, u, [2], u], input)).toEqual(expected);
});

test("day of month", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-01-02T00:00:00");
  expect(next([u, u, u, [2], u, u, u], input)).toEqual(expected);
});

test("day of month and week", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-02-03T00:00:00");
  expect(next([u, u, u, [3], u, [1], u], input)).toEqual(expected);
});

test("month", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-02-01T00:00:00");
  expect(next([u, u, u, u, [1], u, u], input)).toEqual(expected);
});

test("year", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2021-01-01T00:00:00");
  expect(next([u, u, u, u, u, u, [2021]], input)).toEqual(expected);
});

test("all", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2021-02-03T04:05:06");
  expect(next([[6], [5], [4], [3], [1], u, [2021]], input)).toEqual(expected);
});

test("all except year", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-02-03T04:05:06");
  expect(next([[6], [5], [4], [3], [1], u, u], input)).toEqual(expected);
});

test("roll minute", () => {
  const input = new Date("2020-01-01T00:00:30");
  const expected = new Date("2020-01-01T00:01:06");
  expect(next([[6], u, u, u, u, u, u], input)).toEqual(expected);
});

test("roll hour", () => {
  const input = new Date("2020-01-01T00:30:00");
  const expected = new Date("2020-01-01T01:05:00");
  expect(next([u, [5], u, u, u, u, u], input)).toEqual(expected);
});

test("roll day", () => {
  const input = new Date("2020-01-01T12:00:00");
  const expected = new Date("2020-01-02T04:00:00");
  expect(next([u, u, [4], u, u, u, u], input)).toEqual(expected);
});

test("roll month", () => {
  const input = new Date("2020-01-15T00:00:00");
  const expected = new Date("2020-02-03T00:00:00");
  expect(next([u, u, u, [3], u, u, u], input)).toEqual(expected);
});

test("roll year", () => {
  const input = new Date("2020-06-01T00:00:00");
  const expected = new Date("2021-02-01T00:00:00");
  expect(next([u, u, u, u, [1], u, u], input)).toEqual(expected);
});

test("roll all", () => {
  const input = new Date("2020-12-31T23:59:30");
  const expected = new Date("2021-01-01T00:00:05");
  expect(next([[5], u, u, u, u, u, u], input)).toEqual(expected);
});

test("changing DST when iterating", () => {
  const input = new Date("2020-01-01T00:00:00");
  const expected = new Date("2020-09-02T00:00:00");
  expect(next([u, u, u, [2], u, [3], u], input)).toEqual(expected);
});

test("out of years", () => {
  const input = new Date("2020-06-01T00:00:00");
  expect(next([[0], [0], [0], [1], [0], u, [2020]], input)).toBeUndefined();
});

test("next step is out of years", () => {
  const input = new Date("2020-01-01T00:00:00");
  expect(next([[0], [0], [0], [1], [0], u, [2020]], input)).toBeUndefined();
});
