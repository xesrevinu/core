import { realCause } from "@effect/core/io/Cause/definition";

/**
 * Folds over the cause to statefully compute a value.
 *
 * @tsplus fluent ets/Cause foldLeft
 */
export function foldLeft_<E, Z>(
  self: Cause<E>,
  initial: Z,
  f: (z: Z, cause: Cause<E>) => Option<Z>
): Z {
  return foldLeftLoop(initial, f, self, List.empty());
}

/**
 * Folds over the cause to statefully compute a value.
 *
 * @tsplus static ets/Cause/Aspects foldLeft
 */
export const foldLeft = Pipeable(foldLeft_);

/**
 * @tsplus tailRec
 */
function foldLeftLoop<Z, E>(
  z: Z,
  f: (z: Z, cause: Cause<E>) => Option<Z>,
  cause: Cause<E>,
  stack: List<Cause<E>>
): Z {
  const result = f(z, cause).getOrElse(z);
  realCause(cause);
  switch (cause._tag) {
    case "Both":
    case "Then": {
      return foldLeftLoop(result, f, cause.left, stack.prepend(cause.right));
    }
    case "Stackless": {
      return foldLeftLoop(result, f, cause.cause, stack);
    }
    default: {
      if (stack.isNil()) {
        return result;
      }
      return foldLeftLoop(result, f, stack.head, stack.tail);
    }
  }
}
