import { realCause } from "@effect/core/io/Cause/definition";

/**
 * Finds something and extracts some details from it.
 *
 * @tsplus fluent ets/Cause find
 */
export function find_<E, Z>(
  self: Cause<E>,
  f: (cause: Cause<E>) => Option<Z>
): Option<Z> {
  return findLoop(self, f, List.empty());
}

/**
 * Finds something and extracts some details from it.
 *
 * @tsplus static ets/Cause/Aspects find
 */
export const find = Pipeable(find_);

function findLoop<E, Z>(
  self: Cause<E>,
  f: (cause: Cause<E>) => Option<Z>,
  stack: List<Cause<E>>
): Option<Z> {
  const result = f(self);
  if (result.isSome()) {
    return result;
  }
  realCause(self);
  switch (self._tag) {
    case "Both":
    case "Then": {
      return findLoop(self.left, f, stack.prepend(self.right));
    }
    case "Stackless": {
      return findLoop(self.cause, f, stack);
    }
    default: {
      if (stack.isNil()) {
        return Option.none;
      }
      return findLoop(stack.head, f, stack.tail);
    }
  }
}
