/**
 * @tsplus type effect/core/io/Tracing/Span
 * @tsplus companion effect/core/io/Tracing/Span.Ops
 */
export class Span {
  name: string
  attributes: Span.Attributes
  startTimeMillis: number
  endTimeMillis?: number
  status: Span.Status
  parent?: Span

  constructor(
    name: string,
    attributes: Span.Attributes = [],
    startTimeMillis: number = new Date().getTime()
  ) {
    this.name = name
    this.attributes = attributes
    this.startTimeMillis = startTimeMillis
    this.status = Unset
    this.parent = undefined
  }

  setAttribute(key: string, value: string | number | boolean): Span {
    this.attributes.push({ key, value })
    return this
  }

  setAttributes(attributes: Span.Attributes): Span {
    for (const attribute of attributes) {
      this.attributes.push(attribute)
    }
    return this
  }

  setStatus(status: Span.Status): Span {
    this.status = status
    return this
  }

  setParent(parent: Span): Span {
    this.parent = parent
    return this
  }

  end(endTimeMillis: number): Span {
    this.endTimeMillis = endTimeMillis
    return this
  }
}

/**
 * @tsplus type effect/core/io/Tracing/Span.Status.Ops
 */
export interface SpanStatusOps {}
/**
 * @tsplus static effect/core/io/Tracing/Span.Ops Status
 */
export const SpanStatusOps: SpanStatusOps = {}

export declare namespace Span {
  export type Attributes = Array<Attribute>

  export interface Attribute {
    readonly key: string
    readonly value: string | number | boolean
  }

  export type Status = Status.Unset | Status.Success | Status.Failure

  export namespace Status {
    export interface Unset {
      readonly _tag: "Unset"
    }

    export interface Success {
      readonly _tag: "Success"
    }

    export interface Failure {
      readonly _tag: "Failure"
    }
  }
}

/**
 * @tsplus static effect/core/io/Tracing/Span.Status.Ops Unset
 */
export const Unset: Span.Status = {
  _tag: "Unset"
}

/**
 * @tsplus static effect/core/io/Tracing/Span.Status.Ops Success
 */
export const Success: Span.Status = {
  _tag: "Success"
}

/**
 * @tsplus static effect/core/io/Tracing/Span.Status.Ops Failure
 */
export const Failure: Span.Status = {
  _tag: "Failure"
}
