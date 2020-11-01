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
