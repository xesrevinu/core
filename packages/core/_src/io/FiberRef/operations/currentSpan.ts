/**
 * @tsplus static ets/FiberRef/Ops currentSpan
 */
export const currentSpan: LazyValue<FiberRef<Option<Span>, (a: Option<Span>) => Option<Span>>> = LazyValue.make(() =>
  FiberRef.unsafeMake<Option<Span>>(Option.none)
)
