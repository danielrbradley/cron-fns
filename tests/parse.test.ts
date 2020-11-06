import { parse } from "../index";

const u = undefined;
const schedule = (...schedule: ReturnType<typeof parse>) => schedule;

test("5 wildcards", () => {
  expect(parse("* * * * *")).toEqual(schedule([0], u, u, u, u, u, u));
});

test("6 wildcards", () => {
  expect(parse("* * * * * *")).toEqual(schedule([0], u, u, u, u, u, u));
});

test("7 wildcards", () => {
  expect(parse("* * * * * * *")).toEqual(schedule(u, u, u, u, u, u, u));
});

test("midnight", () => {
  expect(parse("0 0 * * * *")).toEqual(schedule([0], [0], [0], u, u, u, u));
});

test("afternoon hours", () => {
  expect(parse("0 12-23 * * * *")).toEqual(
    schedule(
      [0],
      [0],
      [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      u,
      u,
      u,
      u
    )
  );
});

test("specific days", () => {
  expect(parse("0 0 1,4,10,31 * * *")).toEqual(
    schedule([0], [0], [0], [1, 4, 10, 31], u, u, u)
  );
});

test("month adjustment", () => {
  expect(parse("* * * 1,2,3 * *")).toEqual(
    schedule([0], u, u, u, [0, 1, 2], u, u)
  );
});

test("named days", () => {
  expect(parse("* * * * MON,WED *")).toEqual(
    schedule([0], u, u, u, u, [1, 3], u)
  );
});

test("named month range", () => {
  expect(parse("* * * JAN-MAR * *")).toEqual(
    schedule([0], u, u, u, [0, 1, 2], u, u)
  );
});

test("named month range", () => {
  expect(parse("* * * JAN-MAR * *")).toEqual([[0], u, u, u, [0, 1, 2], u, u]);
});

test("second upper bound", () => {
  try {
    parse("60 * * * * * *");
  } catch (error) {
    expect(error.message).toBe("Second is out of bounds (0-59): 60");
  }
});

test("second lower bound", () => {
  try {
    parse("-1 * * * * * *");
  } catch (error) {
    expect(error.message).toBe("Second is out of bounds (0-59): -1");
  }
});

test("minute upper bound", () => {
  try {
    parse("60 * * * * *");
  } catch (error) {
    expect(error.message).toBe("Minute is out of bounds (0-59): 60");
  }
});

test("minute lower bound", () => {
  try {
    parse("-1 * * * * *");
  } catch (error) {
    expect(error.message).toBe("Minute is out of bounds (0-59): -1");
  }
});

test("hour upper bound", () => {
  try {
    parse("* 24 * * * *");
  } catch (error) {
    expect(error.message).toBe("Hour is out of bounds (0-23): 24");
  }
});

test("hour lower bound", () => {
  try {
    parse("* -1 * * * *");
  } catch (error) {
    expect(error.message).toBe("Hour is out of bounds (0-23): -1");
  }
});

test("day of month lower bound", () => {
  try {
    parse("* * 0 * *");
  } catch (error) {
    expect(error.message).toBe("Day of month is out of bounds (1-31): 0");
  }
});

test("day of month upper bound", () => {
  try {
    parse("* * 32 * *");
  } catch (error) {
    expect(error.message).toBe("Day of month is out of bounds (1-31): 32");
  }
});

test("month lower bound", () => {
  try {
    parse("* * * 0 *");
  } catch (error) {
    expect(error.message).toBe("Month is out of bounds (1-12): 0");
  }
});

test("month upper bound", () => {
  try {
    parse("* * * 13 *");
  } catch (error) {
    expect(error.message).toBe("Month is out of bounds (1-12): 13");
  }
});

test("day of week lower bound", () => {
  try {
    parse("* * * * -1");
  } catch (error) {
    expect(error.message).toBe("Day of week is out of bounds (0-6): -1");
  }
});

test("day of week upper bound", () => {
  try {
    parse("* * * * 7");
  } catch (error) {
    expect(error.message).toBe("Day of week is out of bounds (0-6): 7");
  }
});

test("year lower bound", () => {
  try {
    parse("* * * * * 1969");
  } catch (error) {
    expect(error.message).toBe("Year is out of bounds (1970-3000): 1969");
  }
});

test("year upper bound", () => {
  try {
    parse("* * * * * 3001");
  } catch (error) {
    expect(error.message).toBe("Year is out of bounds (1970-3000): 3001");
  }
});
