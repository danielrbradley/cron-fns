import MockDate from "mockdate";
import { CronDaemon } from "../CronDaemon";

let daemon: CronDaemon | undefined;

beforeAll(() => {
  MockDate.set(Date.now());
});
afterEach(() => {
  if (daemon) {
    daemon.stop();
    daemon = undefined;
  }
});
afterAll(() => {
  MockDate.reset();
});

test("triggering", async () => {
  const callback = jest.fn();
  daemon = new CronDaemon("* * * * * * *", callback);

  expect(daemon.state()).toEqual("running");
  expect(callback).not.toHaveBeenCalled();

  MockDate.set(Date.now() + 1000);
  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledTimes(1);
});

test("schedule without next date", async () => {
  const callback = jest.fn();
  daemon = new CronDaemon("* * * * * * 1980", callback);

  expect(daemon.next()).toBeUndefined();

  MockDate.set(Date.now() + 1000);
  jest.advanceTimersByTime(1000);

  expect(callback).not.toHaveBeenCalled();
});

test("calling start multiple times", async () => {
  const callback = jest.fn();
  daemon = new CronDaemon("* * * * * * *", callback);

  daemon.start();
  daemon.start();

  expect(daemon.state()).toEqual("running");
  expect(callback).not.toHaveBeenCalled();

  MockDate.set(Date.now() + 1000);
  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledTimes(1);
});

test("stopping", async () => {
  const callback = jest.fn();
  daemon = new CronDaemon("* * * * * * *", callback);

  daemon.stop();

  expect(daemon.state()).toEqual("stopped");

  MockDate.set(Date.now() + 1000);
  jest.advanceTimersByTime(1000);

  expect(callback).not.toHaveBeenCalled();
});

test("doesn't break when next trigger is a long way away", async () => {
  const callback = jest.fn();
  daemon = new CronDaemon("* * * * * * 2099", callback);

  expect(daemon.state()).toEqual("running");

  MockDate.set(Date.now() + 50);
  jest.advanceTimersByTime(50);

  expect(callback).not.toHaveBeenCalled();
});

test("can call stop multiple times", async () => {
  const callback = jest.fn();
  daemon = new CronDaemon("* * * * * * *", callback);

  daemon.stop();
  daemon.stop();

  expect(daemon.state()).toEqual("stopped");
  expect(callback).not.toHaveBeenCalled();
});

test("custom date function", async () => {
  const callback = jest.fn();
  daemon = new CronDaemon((now) => {
    const next = new Date(now);
    next.setTime(now.getTime() + 10);
    return next;
  }, callback);

  MockDate.set(Date.now() + 50);
  jest.advanceTimersByTime(20);

  expect(callback).toHaveBeenCalled();
});

test("Invalid schedule type causes an error", () => {
  const callback = jest.fn();
  try {
    daemon = new CronDaemon({} as any, callback);
    throw new Error("Should have failed validation");
  } catch (error) {
    expect(error.message).toEqual("Invalid schedule type");
    expect(callback).not.toHaveBeenCalled();
  }
});

test("Very long delay", () => {
  const maxDelay = Math.pow(2, 32 - 1) - 1;
  const requestedDelay = maxDelay * 1.5;
  const start = Date.now();
  MockDate.set(start);

  const callback = jest.fn();
  daemon = new CronDaemon(
    (now) => new Date(now.getTime() + requestedDelay),
    callback
  );

  jest.runOnlyPendingTimers();
  MockDate.set(start + maxDelay);

  expect(callback).not.toHaveBeenCalled();

  MockDate.set(start + requestedDelay);
  jest.runOnlyPendingTimers();

  expect(callback).toHaveBeenCalledTimes(1);
});
