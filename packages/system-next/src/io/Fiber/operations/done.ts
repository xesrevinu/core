import * as Chunk from "../../../collection/immutable/Chunk/core"
import { Option } from "../../../data/Option"
import { Effect } from "../../Effect"
import type { Exit } from "../../Exit"
import * as FiberId from "../../FiberId"
import type { Fiber } from "../definition"
import { makeSynthetic } from "./makeSynthetic"

/**
 * A fiber that is done with the specified `Exit` value.
 */
export function done<E, A>(exit: Exit<E, A>): Fiber<E, A> {
  return makeSynthetic({
    id: FiberId.none,
    await: Effect.succeedNow(exit),
    children: Effect.succeedNow(Chunk.empty()),
    inheritRefs: Effect.unit,
    poll: Effect.succeedNow(Option.some(exit)),
    getRef: (ref) => Effect.succeed(() => ref.initial),
    interruptAs: () => Effect.succeedNow(exit)
  })
}
