import type { Cause } from "../../Cause"
import { Effect } from "../../Effect"
import { Managed } from "../definition"

/**
 * Returns an effect that models failure with the specified `Cause`.
 *
 * @ets static ets/ManagedOps failCauseNow
 */
export function failCauseNow<E>(
  cause: Cause<E>,
  __etsTrace?: string
): Managed<unknown, E, never> {
  return Managed.fromEffect(Effect.failCauseNow(cause))
}
