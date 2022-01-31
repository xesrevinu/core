import type { LazyArg } from "../../../data/Function"
import type { HasClock } from "../../Clock"
import { Effect } from "../definition"

/**
 * Returns an effect that will timeout this effect, returning either the
 * default value if the timeout elapses before the effect has produced a
 * value or returning the result of applying the function `f` to the
 * success value of the effect.
 *
 * If the timeout elapses without producing a value, the running effect will
 * be safely interrupted.
 *
 * @ets fluent ets/Effect timeoutTo
 */
export function timeoutTo_<R, E, A, B, B1>(
  self: Effect<R, E, A>,
  def: LazyArg<B1>,
  f: (a: A) => B,
  milliseconds: number,
  __etsTrace?: string
): Effect<R & HasClock, E, B | B1> {
  return self.map(f).raceFirst(
    Effect.sleep(milliseconds)
      .interruptible()
      .map(() => def())
  )
}

/**
 * Returns an effect that will timeout this effect, returning either the
 * default value if the timeout elapses before the effect has produced a
 * value or returning the result of applying the function `f` to the
 * success value of the effect.
 *
 * If the timeout elapses without producing a value, the running effect will
 * be safely interrupted.
 *
 * @ets_data_first timeoutTo_
 */
export function timeoutTo<A, B, B1>(
  def: LazyArg<B1>,
  f: (a: A) => B,
  milliseconds: number,
  __etsTrace?: string
) {
  return <R, E>(self: Effect<R, E, A>): Effect<R & HasClock, E, B | B1> =>
    timeoutTo_(self, def, f, milliseconds)
}
