// TODO:
// - [ ] renderPretty
// - [ ] squashTrace
// - [ ] squashTraceWith
// - [ ] stripFailures
// - [ ] stripSomeDefects
export const CauseSym = Symbol.for("@effect/core/io/Cause");
export type CauseSym = typeof CauseSym;

export const _E = Symbol.for("@effect/core/io/Cause/E");
export type _E = typeof _E;

/**
 * @tsplus type ets/Cause
 */
export interface Cause<E> extends Equals {
  readonly [CauseSym]: CauseSym;
  readonly [_E]: () => E;
}

/**
 * @tsplus type ets/Cause/Ops
 */
export interface CauseOps {
  $: CauseAspects;
}
export const Cause: CauseOps = {
  $: {}
};

/**
 * @tsplus type ets/Cause/Aspects
 */
export interface CauseAspects {}

/**
 * @tsplus unify ets/Cause
 */
export function unify<X extends Cause<any>>(
  self: X
): Cause<[X] extends [Cause<infer CX>] ? CX : never> {
  return self;
}

export type RealCause<E> =
  | Empty
  | Fail<E>
  | Die
  | Interrupt
  | Stackless<E>
  | Then<E>
  | Both<E>;

/**
 * @tsplus macro remove
 */
export function realCause<E>(cause: Cause<E>): asserts cause is RealCause<E> {
  //
}

/**
 * @tsplus fluent ets/Cause isEmptyType
 */
export function isEmptyType<E>(cause: Cause<E>): cause is Empty {
  realCause(cause);
  return cause._tag === "Empty";
}

/**
 * @tsplus fluent ets/Cause isDieType
 */
export function isDieType<E>(cause: Cause<E>): cause is Die {
  realCause(cause);
  return cause._tag === "Die";
}

/**
 * @tsplus fluent ets/Cause isFailType
 */
export function isFailType<E>(cause: Cause<E>): cause is Fail<E> {
  realCause(cause);
  return cause._tag === "Fail";
}

/**
 * @tsplus fluent ets/Cause isInterruptType
 */
export function isInterruptType<E>(cause: Cause<E>): cause is Interrupt {
  realCause(cause);
  return cause._tag === "Interrupt";
}

/**
 * @tsplus fluent ets/Cause isStacklessType
 */
export function isStacklessType<E>(cause: Cause<E>): cause is Stackless<E> {
  realCause(cause);
  return cause._tag === "Stackless";
}

/**
 * @tsplus fluent ets/Cause isThenType
 */
export function isThenType<E>(cause: Cause<E>): cause is Then<E> {
  realCause(cause);
  return cause._tag === "Then";
}

/**
 * @tsplus fluent ets/Cause isBothType
 */
export function isBothType<E>(cause: Cause<E>): cause is Both<E> {
  realCause(cause);
  return cause._tag === "Both";
}

export class Empty implements Cause<never>, Equals {
  readonly _tag = "Empty";

  readonly [CauseSym]: CauseSym = CauseSym;
  readonly [_E]!: () => never;

  [Hash.sym](): number {
    return _emptyHash;
  }

  [Equals.sym](that: unknown): boolean {
    if (isCause(that)) {
      realCause(that);
      switch (that._tag) {
        case "Empty": {
          return true;
        }
        case "Both":
        case "Then": {
          return this == that.left && this == that.right;
        }
        case "Stackless": {
          return this == that.cause;
        }
      }
    }
    return false;
  }
}

export interface Fail<E> extends Cause<E> {}
export class Fail<E> implements Cause<E>, Equals {
  readonly _tag = "Fail";

  readonly [CauseSym]: CauseSym = CauseSym;
  readonly [_E]!: () => E;

  constructor(readonly value: E, readonly trace: Trace) {}

  [Hash.sym](): number {
    return Hash.combine(Hash.string(this._tag), Hash.unknown(this.value));
  }

  [Equals.sym](that: unknown): boolean {
    if (isCause(that)) {
      realCause(that);
      switch (that._tag) {
        case "Fail": {
          return Equals.equals(this.value, that.value);
        }
        case "Both":
        case "Then": {
          return sym(zero)(this, that);
        }
        case "Stackless": {
          return this == that.cause;
        }
      }
    }
    return false;
  }
}

export class Die implements Cause<never>, Equals {
  readonly _tag = "Die";

  readonly [CauseSym]: CauseSym = CauseSym;
  readonly [_E]!: () => never;

  constructor(readonly value: unknown, readonly trace: Trace) {}

  [Hash.sym](): number {
    return Hash.combine(Hash.string(this._tag), Hash.unknown(this.value));
  }

  [Equals.sym](that: unknown): boolean {
    if (isCause(that)) {
      realCause(that);
      switch (that._tag) {
        case "Die": {
          return Equals.equals(this.value, that.value);
        }
        case "Both":
        case "Then": {
          return sym(zero)(this, that);
        }
        case "Stackless": {
          return this == that.cause;
        }
      }
    }
    return false;
  }
}

export class Interrupt implements Cause<never>, Equals {
  readonly _tag = "Interrupt";

  readonly [CauseSym]: CauseSym = CauseSym;
  readonly [_E]!: () => never;

  constructor(readonly fiberId: FiberId, readonly trace: Trace) {}

  [Hash.sym](): number {
    return Hash.combine(Hash.string(this._tag), Hash.unknown(this.fiberId));
  }

  [Equals.sym](that: unknown): boolean {
    if (isCause(that)) {
      realCause(that);
      switch (that._tag) {
        case "Interrupt": {
          return this.fiberId == that.fiberId;
        }
        case "Both":
        case "Then": {
          return sym(zero)(this, that);
        }
        case "Stackless": {
          return this == that.cause;
        }
      }
    }
    return false;
  }
}

export class Stackless<E> implements Cause<E>, Equals {
  readonly _tag = "Stackless";

  readonly [CauseSym]: CauseSym = CauseSym;
  readonly [_E]!: () => E;

  constructor(readonly cause: Cause<E>, readonly stackless: boolean) {}

  [Hash.sym](): number {
    return this.cause[Hash.sym]();
  }

  [Equals.sym](that: unknown): boolean {
    if (isCause(that)) {
      realCause(that);
      return that._tag === "Stackless" ?
        this.cause == that.cause :
        this.cause == that;
    }
    return false;
  }
}

export class Then<E> implements Cause<E>, Equals {
  readonly _tag = "Then";

  readonly [CauseSym]: CauseSym = CauseSym;
  readonly [_E]!: () => E;

  constructor(readonly left: Cause<E>, readonly right: Cause<E>) {}

  [Hash.sym](): number {
    return hashCode(this);
  }

  [Equals.sym](that: unknown): boolean {
    if (isCause(that)) {
      return this.eq(that) ||
        sym(associativeThen)(that, this) ||
        sym(distributiveThen)(this, that) ||
        sym(zero)(this, that);
    }
    return false;
  }

  private eq(that: Cause<unknown>): boolean {
    return isThenType(that) &&
      this.left == that.left &&
      this.right == that.right;
  }
}

export class Both<E> implements Cause<E>, Equals {
  readonly _tag = "Both";

  readonly [CauseSym]: CauseSym = CauseSym;
  readonly [_E]!: () => E;

  constructor(readonly left: Cause<E>, readonly right: Cause<E>) {}

  [Hash.sym](): number {
    return hashCode(this);
  }

  [Equals.sym](that: unknown): boolean {
    if (isCause(that)) {
      return this.eq(that) ||
        sym(associativeBoth)(this, that) ||
        sym(distributiveBoth)(this, that) ||
        commutativeBoth(this, that) ||
        sym(zero)(this, that);
    }
    return false;
  }

  private eq(that: Cause<unknown>): boolean {
    return isBothType(that) &&
      this.left == that.left &&
      this.right == that.right;
  }
}

/**
 * @tsplus static ets/Cause/Ops empty
 */
export const empty: Cause<never> = new Empty();

/**
 * @tsplus static ets/Cause/Ops die
 */
export function die(defect: unknown, trace: Trace = Trace.none): Cause<never> {
  return new Die(defect, trace);
}

/**
 * @tsplus static ets/Cause/Ops fail
 */
export function fail<E>(error: E, trace: Trace = Trace.none): Cause<E> {
  return new Fail(error, trace);
}

/**
 * @tsplus static ets/Cause/Ops interrupt
 */
export function interrupt(fiberId: FiberId, trace: Trace = Trace.none): Cause<never> {
  return new Interrupt(fiberId, trace);
}

/**
 * @tsplus static ets/Cause/Ops stack
 */
export function stack<E>(cause: Cause<E>): Cause<E> {
  return new Stackless(cause, false);
}

/**
 * @tsplus static ets/Cause/Ops stackless
 */
export function stackless<E>(cause: Cause<E>): Cause<E> {
  return new Stackless(cause, true);
}

/**
 * @tsplus operator ets/Cause +
 * @tsplus static ets/Cause/Ops then
 */
export function combineSeq<E1, E2>(left: Cause<E1>, right: Cause<E2>): Cause<E1 | E2> {
  return isEmpty(left) ? right : isEmpty(right) ? left : new Then<E1 | E2>(left, right);
}

/**
 * @tsplus operator ets/Cause &
 * @tsplus static ets/Cause/Ops both
 */
export function combinePar<E1, E2>(left: Cause<E1>, right: Cause<E2>): Cause<E1 | E2> {
  return new Both<E1 | E2>(left, right);
}

/**
 * Determines if the provided value is a `Cause`.
 *
 * @tsplus fluent ets/Cause isCause
 */
export function isCause(self: unknown): self is Cause<unknown> {
  return typeof self === "object" && self != null && CauseSym in self;
}

/**
 * Determines if the `Cause` is empty.
 *
 * @tsplus fluent ets/Cause isEmpty
 */
export function isEmpty<E>(cause: Cause<E>): boolean {
  if (isEmptyType(cause) || (isStacklessType(cause) && isEmptyType(cause.cause))) {
    return true;
  }
  let causes: Stack<Cause<E>> | undefined = undefined;
  realCause(cause);
  let current: RealCause<E> | undefined = cause;
  while (current) {
    switch (current._tag) {
      case "Die":
        return false;
      case "Fail":
        return false;
      case "Interrupt":
        return false;
      case "Then": {
        causes = new Stack(current.right, causes);
        realCause(current.left);
        current = current.left;
        break;
      }
      case "Both": {
        causes = new Stack(current.right, causes);
        realCause(current.left);
        current = current.left;
        break;
      }
      case "Stackless": {
        realCause(current.cause);
        current = current.cause;
        break;
      }
      default: {
        current = undefined;
      }
    }
    if (!current && causes) {
      realCause(causes.value);
      current = causes.value;
      causes = causes.previous;
    }
  }
  return true;
}

const _emptyHash = Hash.optimize(Hash.random());

/**
 * Takes one step in evaluating a cause, returning a set of causes that fail
 * in parallel and a list of causes that fail sequentially after those causes.
 */
function step<A>(self: Cause<A>): Tuple<[HashSet<Cause<A>>, List<Cause<A>>]> {
  return stepLoop(self, List.empty(), HashSet.empty(), List.empty());
}

/**
 * @tsplus tailRec
 */
function stepLoop<E>(
  cause: Cause<E>,
  stack: List<Cause<E>>,
  parallel: HashSet<Cause<E>>,
  sequential: List<Cause<E>>
): Tuple<[HashSet<Cause<E>>, List<Cause<E>>]> {
  realCause(cause);
  switch (cause._tag) {
    case "Empty": {
      if (stack.isNil()) {
        return Tuple(parallel, sequential);
      }
      return stepLoop(stack.head, stack.tail, parallel, sequential);
    }
    case "Then": {
      const left = cause.left;
      const right = cause.right;
      realCause(left);
      switch (left._tag) {
        case "Empty": {
          return stepLoop(right, stack, parallel, sequential);
        }
        case "Then": {
          return stepLoop(
            new Then(left.left, new Then(left.right, right)),
            stack,
            parallel,
            sequential
          );
        }
        case "Both": {
          return stepLoop(
            new Both(new Then(left.left, right), new Then(left.right, right)),
            stack,
            parallel,
            sequential
          );
        }
        case "Stackless": {
          return stepLoop(new Then(left.cause, right), stack, parallel, sequential);
        }
        default: {
          return stepLoop(left, stack, parallel, sequential.prepend(right));
        }
      }
    }
    case "Both": {
      return stepLoop(cause.left, stack.prepend(cause.right), parallel, sequential);
    }
    case "Stackless": {
      return stepLoop(cause.cause, stack, parallel, sequential);
    }
    default: {
      if (stack.isNil()) {
        return Tuple(parallel.add(cause), sequential);
      }
      return stepLoop(stack.head, stack.tail, parallel.add(cause), sequential);
    }
  }
}

/**
 * Flattens a `Cause` to a sequence of sets of causes, where each set represents
 * causes that fail in parallel and sequential sets represent causes that fail
 * after each other.
 */
function flattenCause<E>(self: Cause<E>): List<HashSet<Cause<E>>> {
  return flattenCauseLoop(List(self), List.empty());
}

/**
 * @tsplus tailRec
 */
function flattenCauseLoop<E>(
  causes: List<Cause<E>>,
  flattened: List<HashSet<Cause<E>>>
): List<HashSet<Cause<E>>> {
  const { tuple: [parallel, sequential] } = causes.reduce(
    Tuple(HashSet.empty<Cause<E>>(), List.empty<Cause<E>>()),
    ({ tuple: [parallel, sequential] }, cause) => {
      const { tuple: [par, seq] } = step(cause);
      return Tuple(parallel.union(par), sequential.concat(seq));
    }
  );

  const updated = parallel.size > 0 ? flattened.prepend(parallel) : flattened;

  if (sequential.isNil()) {
    return updated.reverse();
  }

  return flattenCauseLoop(sequential, updated);
}

function hashCode<E>(self: Cause<E>): number {
  const flat = flattenCause(self);
  const size = flat.length();
  let head;
  if (size === 0) {
    return _emptyHash;
  } else if (size === 1 && (head = flat.unsafeHead()!) && head.size === 1) {
    return List.from(head).unsafeHead()![Hash.sym]();
  } else {
    return flat[Hash.sym]();
  }
}

function sym<E>(f: (c1: Cause<E>, c2: Cause<E>) => boolean) {
  return (c1: Cause<E>, c2: Cause<E>): boolean => f(c1, c2) || f(c2, c1);
}

function zero<E>(c1: Cause<E>, c2: Cause<E>): boolean {
  if (isThenType(c1) && isEmptyType(c1.right)) {
    return c1.left == c2;
  }
  if (isThenType(c1) && isEmptyType(c1.left)) {
    return c1.right == c2;
  }
  if (isBothType(c1) && isEmptyType(c1.right)) {
    return c1.left == c2;
  }
  if (isBothType(c1) && isEmptyType(c1.left)) {
    return c1.right == c2;
  }
  return false;
}

function associativeThen<E>(self: Cause<E>, that: Cause<E>): boolean {
  if (isThenType(self) && isThenType(self.left) && isThenType(that) && isThenType(that.right)) {
    const al = self.left.left;
    const bl = self.left.right;
    const cl = self.right;
    const ar = that.left;
    const br = that.right.left;
    const cr = that.right.right;
    return al == ar && bl == br && cl == cr;
  }
  return false;
}

function distributiveThen<E>(self: Cause<E>, that: Cause<E>): boolean {
  if (isThenType(self) && isBothType(self.right) && isBothType(that)) {
    const al = self.left;
    const bl = self.right.left;
    const cl = self.right.right;
    const ar = that.left;
    const br = that.right;
    return combineSeq(al, bl) == ar && combineSeq(al, cl) == br;
  }
  if (isThenType(self) && isBothType(self.left) && isBothType(that)) {
    const al = self.left.left;
    const bl = self.left.right;
    const cl = self.right;
    const ar = that.left;
    const br = that.right;
    return combineSeq(al, cl) == ar && combineSeq(bl, cl) == br;
  }
  return false;
}

function associativeBoth<E>(self: Cause<E>, that: Cause<E>): boolean {
  if (isBothType(self) && isBothType(self.left) && isBothType(that) && isBothType(that.right)) {
    const al = self.left;
    const bl = self.left.right;
    const cl = self.right;
    const ar = that.left;
    const br = that.right.left;
    const cr = that.right.right;
    return al == ar && bl == br && cl == cr;
  }
  return false;
}

function distributiveBoth<E>(self: Cause<E>, that: Cause<E>): boolean {
  if (isBothType(self) && isThenType(that) && isBothType(that.right)) {
    const al = self.left;
    const bl = self.right;
    const ar = that.left;
    const br = that.right.left;
    const cr = that.right.right;
    return al == combineSeq(ar, br) && bl == combineSeq(ar, cr);
  }
  if (isBothType(self) && isThenType(that) && isBothType(that.left)) {
    const al = self.left;
    const bl = self.right;
    const ar = that.left.left;
    const br = that.left.right;
    const cr = that.right;
    return al == combineSeq(ar, cr) && bl == combineSeq(br, cr);
  }
  return false;
}

function commutativeBoth<E>(self: Cause<E>, that: Cause<E>): boolean {
  return isBothType(self)
    && isBothType(that)
    && self.left == that.left
    && self.right == that.right;
}
