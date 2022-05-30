import { ITraced } from "@effect/core/io/Effect/definition/primitives"
import type { SpanAttribute } from "@effect/core/io/Tracer/definition"

/**
 * @tsplus fluent ets/Effect withSpan
 */
export function withSpan_<R, E, A>(
  self: Effect<R, E, A>,
  name: string,
  attributes: Array<SpanAttribute> = [],
  __tsplusTrace?: string
): Effect<R, E, A> {
  return new ITraced(self, name, attributes, __tsplusTrace)
}

/**
 * @tsplus static ets/Effect/Aspects withSpan
 */
export const withSpan = Pipeable(withSpan_)
