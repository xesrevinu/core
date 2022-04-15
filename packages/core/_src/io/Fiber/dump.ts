import type { FiberStatus } from "@effect/core/io/Fiber/status";

/**
 * @tsplus type ets/Fiber/Dump
 */
export interface FiberDump {
  readonly fiberId: FiberId.Runtime;
  readonly status: FiberStatus;
  readonly trace: Trace;
}

/**
 * @tsplus type ets/Fiber/Dump/Ops
 */
export interface FiberDumpOps {}
export const FiberDump: FiberDumpOps = {};
