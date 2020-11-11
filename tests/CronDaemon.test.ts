import { CronDaemon } from "../CronDaemon";

const waitFor = (ms: number) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });

test("triggering", async () => {
  const callback = jest.fn();
  const daemon = new CronDaemon("* * * * * * *", callback);
  expect(daemon.state()).toEqual("running");
  expect(callback).not.toHaveBeenCalled();
  await waitFor(1000);
  expect(callback).toHaveBeenCalledTimes(1);
});

test("schedule without next date", async () => {
  const callback = jest.fn();
  const daemon = new CronDaemon("* * * * * * 1980", callback);
  expect(daemon.next()).toBeUndefined();
  await waitFor(1000);
  expect(callback).not.toHaveBeenCalled();
});

test("calling start multiple times", async () => {
  const callback = jest.fn();
  const daemon = new CronDaemon("* * * * * * *", callback);
  daemon.start();
  daemon.start();
  expect(daemon.state()).toEqual("running");
  expect(callback).not.toHaveBeenCalled();
  await waitFor(1000);
  expect(callback).toHaveBeenCalledTimes(1);
});

test("stopping", async () => {
  const callback = jest.fn();
  const daemon = new CronDaemon("* * * * * * *", callback);
  daemon.stop();
  expect(daemon.state()).toEqual("stopped");
  await waitFor(1000);
  expect(callback).not.toHaveBeenCalled();
});

test("doesn't break when next trigger is a long way away", async () => {
  const callback = jest.fn();
  const daemon = new CronDaemon("* * * * * * 2099", callback);
  expect(daemon.state()).toEqual("running");
  await waitFor(50);
  expect(callback).not.toHaveBeenCalled();
});

test("can call stop multiple times", async () => {
  const callback = jest.fn();
  const daemon = new CronDaemon("* * * * * * *", callback);
  daemon.stop();
  daemon.stop();
  expect(daemon.state()).toEqual("stopped");
  expect(callback).not.toHaveBeenCalled();
});

test("custom date function", async () => {
  const callback = jest.fn();
  const daemon = new CronDaemon((now) => {
    const next = new Date(now);
    next.setTime(now.getTime() + 10);
    return next;
  }, callback);
  await waitFor(20);
  expect(callback).toHaveBeenCalled();
});

test("Invalid schedule type causes an error", () => {
  try {
    new CronDaemon({} as any, jest.fn());
    throw new Error("Should have failed validation");
  } catch (error) {
    expect(error.message).toEqual("Invalid schedule type");
  }
});
