export interface Span {
  readonly name: string
  readonly attributes: ReadonlyArray<SpanAttribute>
  readonly parent?: Span
  readonly status: SpanStatus
  readonly startTimeMillis: number
  readonly endTimeMillis?: number
}

export class EffectSpan implements Span {
  name: string
  attributes: Array<SpanAttribute>
  parent?: EffectSpan
  status: SpanStatus
  startTimeMillis: number
  endTimeMillis?: number

  constructor(name: string, startTimeMillis: number, attributes: Array<SpanAttribute> = [], parent?: EffectSpan) {
    this.name = name
    this.attributes = attributes
    this.parent = parent
    this.status = { _tag: "Unset" }
    this.startTimeMillis = startTimeMillis
    this.endTimeMillis = undefined
  }
}

export interface SpanAttribute {
  readonly key: string
  readonly value: string | number | boolean
}

export type SpanStatus = Unset | Success | Failure

export interface Unset {
  readonly _tag: "Unset"
}

export interface Success {
  readonly _tag: "Success"
}

export interface Failure {
  readonly _tag: "Error"
}

export type $SpanType<T extends Tracer> = ReturnType<NonNullable<T[_SpanType]>>
export declare const _SpanType: unique symbol
export type _SpanType = typeof _SpanType

/**
 * Tracer provides an interface for creating {@link Span}s.
 *
 * @tsplus type effect/core/io/Tracer
 */
export interface Tracer {
  readonly [_SpanType]?: (_: never) => Span

  readonly startSpan: (
    name: string,
    startTimeMillis?: number,
    attributes?: Array<SpanAttribute>,
    parent?: $SpanType<this>
  ) => $SpanType<this>
  readonly addAttribute: (span: $SpanType<this>, key: string, value: string) => $SpanType<this>
  readonly setStatus: (span: $SpanType<this>, status: SpanStatus) => $SpanType<this>
  readonly endSpan: (span: $SpanType<this>, exit: Exit<unknown, unknown>, endTimeMillis?: number) => $SpanType<this>
}

export abstract class BaseTracer<SpanType extends Span = Span> implements Tracer {
  readonly [_SpanType]?: (_: never) => SpanType
  // @ts-expect-error
  abstract startSpan(
    name: string,
    startTimeMillis?: number,
    attributes?: Array<SpanAttribute>,
    parent?: SpanType
  ): SpanType
  // @ts-expect-error
  abstract addAttribute(span: SpanType, key: string, value: string): SpanType
  // @ts-expect-error
  abstract setStatus(span: SpanType, status: SpanStatus): SpanType
  // @ts-expect-error
  abstract endSpan(span: SpanType, exit: Exit<unknown, unknown>, endTimeMillis?: number): SpanType
}

/**
 * @tsplus type effect/core/io/Tracer.Ops
 */
export interface TracerOps {
  readonly $: TracerAspects
  readonly Tag: Service.Tag<Tracer>
}
export const Tracer: TracerOps = {
  $: {},
  Tag: Service.Tag<Tracer>()
}

/**
 * @tsplus type effect/core/io/Tracer.Aspects
 */
export interface TracerAspects {}

export class EffectTracer extends BaseTracer<EffectSpan> {
  startSpan(
    name: string,
    startTimeMillis: number = new Date().getTime(),
    attributes: Array<SpanAttribute> = [],
    parent?: EffectSpan
  ): EffectSpan {
    return new EffectSpan(name, startTimeMillis, attributes, parent)
  }

  addAttribute(span: EffectSpan, key: string, value: string): EffectSpan {
    span.attributes.push({ key, value })
    return span
  }

  setStatus(span: EffectSpan, status: SpanStatus): EffectSpan {
    span.status = status
    return span
  }

  endSpan(span: EffectSpan, exit: Exit<unknown, unknown>, endTimeMillis: number = new Date().getTime()): EffectSpan {
    span.endTimeMillis = endTimeMillis
    if (exit.isFailure()) {
      this.addAttribute(span, "error.type", "Fiber Failure")
      this.addAttribute(span, "error.message", "An effect resulted in an error")
      // TODO(Mike/Max): implement after cause rendering
      this.addAttribute(span, "error.stack", "")
      this.setStatus(span, { _tag: "Error" })
    } else {
      this.setStatus(span, { _tag: "Success" })
    }
    console.log(span)
    return span
  }
}
