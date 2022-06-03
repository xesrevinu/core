/**
 * Awaits on all fibers to be completed, successfully or not.
 *
 * @tsplus static ets/Fiber/Ops awaitAll
 */
export function awaitAll<E, A>(
  fibers: Collection<Fiber<E, A>>,
  __tsplusTrace?: string
): Effect.UIO<void> {
  return Fiber.collectAll(fibers).await().asUnit()
}
