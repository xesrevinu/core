/**
 * @tsplus type ets/Fiber/Renderer/Ops
 */
export interface FiberRendererOps {}
export const FiberRenderer: FiberRendererOps = {};

/**
 * @tsplus static ets/Fiber/Renderer/Ops prettyPrint
 */
export function prettyPrint(dump: Fiber.Dump): Effect.UIO<string> {
  return Effect.succeed(unsafePrettyPrint(dump, Date.now()));
}

function unsafePrettyPrint(dump: Fiber.Dump, now: number): string {
  const { days, hours, milliseconds, minutes, seconds } = parseMs(
    now - dump.fiberId.startTimeSeconds * 1000
  );
  const name = `"${dump.fiberId.threadName()}"`;
  const lifeMsg = (days === 0 ? "" : `${days}d`) +
    (days === 0 && hours === 0 ? "" : `${hours}h`) +
    (days === 0 && hours === 0 && minutes === 0 ? "" : `${minutes}m`) +
    (days === 0 && hours === 0 && minutes === 0 && seconds === 0 ? "" : `${seconds}s`) +
    `${milliseconds}ms`;
  const waitMsg = dump.status._tag === "Suspended" ?
    dump.status.blockingOn !== FiberId.none ?
      "waiting on " :
      `#${Array.from(dump.status.blockingOn.ids()).join(", ")}` :
    "";
  const statMsg = renderStatus(dump.status);
  return [
    `${name} (${lifeMsg}) ${waitMsg}`,
    `   Status: ${statMsg}`
    // TODO(Mike/Max): implementation
    // Cause.fail(Cause.empty, dump.trace).prettyPrint()
  ].join("\n");
}

function renderStatus(status: Fiber.Status): string {
  switch (status._tag) {
    case "Done": {
      return "Done";
    }
    case "Running": {
      return `Running(${status.interrupting ? "interrupting" : ""})`;
    }
    case "Suspended": {
      const interruptible = status.interruptible ? "interruptible" : "uninterruptible";
      const asyncs = `${status.asyncs} asyncs`;
      const trace = status.asyncTrace.stringify();
      return `Suspended(${interruptible}, ${asyncs}, ${trace})`;
    }
  }
}

// Forked from https://github.com/sindresorhus/parse-ms/blob/4da2ffbdba02c6e288c08236695bdece0adca173/index.js
// MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
function parseMs(milliseconds: number) {
  const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

  return {
    days: roundTowardsZero(milliseconds / 86400000),
    hours: roundTowardsZero(milliseconds / 3600000) % 24,
    minutes: roundTowardsZero(milliseconds / 60000) % 60,
    seconds: roundTowardsZero(milliseconds / 1000) % 60,
    milliseconds: roundTowardsZero(milliseconds) % 1000,
    microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
    nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000
  };
}
