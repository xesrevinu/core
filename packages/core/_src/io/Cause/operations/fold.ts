import { realCause } from "@effect/core/io/Cause/definition";

/**
 * Folds over the cases of this cause with the specified functions.
 *
 * @tsplus fluent ets/Cause fold
 */
export function fold_<E, Z>(
  self: Cause<E>,
  onEmptyCause: LazyArg<Z>,
  onFailCause: (e: E, trace: Trace) => Z,
  onDieCause: (e: unknown, trace: Trace) => Z,
  onInterruptCause: (fiberId: FiberId, trace: Trace) => Z,
  onThenCause: (x: Z, y: Z) => Z,
  onBothCause: (x: Z, y: Z) => Z,
  onStacklessCause: (z: Z, stackless: boolean) => Z
): Z {
  return foldLoop(
    List(self),
    List.empty(),
    onEmptyCause,
    onFailCause,
    onDieCause,
    onInterruptCause,
    onThenCause,
    onBothCause,
    onStacklessCause
  ).unsafeHead()!;
}

/**
 * Folds over the cases of this cause with the specified functions.
 *
 * @tsplus static ets/Cause/Aspects fold
 */
export const fold = Pipeable(fold_);

type CauseCase = BothCase | ThenCase | StacklessCase;

interface BothCase {
  readonly _tag: "BothCase";
}

interface ThenCase {
  readonly _tag: "ThenCase";
}

interface StacklessCase {
  readonly _tag: "StacklessCase";
  readonly stackless: boolean;
}

const BothCase: CauseCase = {
  _tag: "BothCase"
};

const ThenCase: CauseCase = {
  _tag: "ThenCase"
};

function StacklessCase(stackless: boolean): StacklessCase {
  return {
    _tag: "StacklessCase",
    stackless
  };
}

/**
 * @tsplus tailRec
 */
function foldLoop<E, Z>(
  input: List<Cause<E>>,
  output: List<Either<CauseCase, Z>>,
  onEmptyCase: LazyArg<Z>,
  onFailCase: (e: E, trace: Trace) => Z,
  onDieCase: (e: unknown, trace: Trace) => Z,
  onInterruptCase: (fiberId: FiberId, trace: Trace) => Z,
  onThenCase: (x: Z, y: Z) => Z,
  onBothCase: (x: Z, y: Z) => Z,
  onStacklessCase: (z: Z, stackless: boolean) => Z
): List<Z> {
  if (input.isCons()) {
    const head = input.head;
    const tail = input.tail;
    realCause(head);
    switch (head._tag) {
      case "Empty": {
        return foldLoop(
          tail,
          output.prepend(Either.right(onEmptyCase())),
          onEmptyCase,
          onFailCase,
          onDieCase,
          onInterruptCase,
          onThenCase,
          onBothCase,
          onStacklessCase
        );
      }
      case "Fail": {
        return foldLoop(
          tail,
          output.prepend(Either.right(onFailCase(head.value, head.trace))),
          onEmptyCase,
          onFailCase,
          onDieCase,
          onInterruptCase,
          onThenCase,
          onBothCase,
          onStacklessCase
        );
      }
      case "Die": {
        return foldLoop(
          tail,
          output.prepend(Either.right(onDieCase(head.value, head.trace))),
          onEmptyCase,
          onFailCase,
          onDieCase,
          onInterruptCase,
          onThenCase,
          onBothCase,
          onStacklessCase
        );
      }
      case "Interrupt": {
        return foldLoop(
          tail,
          output.prepend(Either.right(onInterruptCase(head.fiberId, head.trace))),
          onEmptyCase,
          onFailCase,
          onDieCase,
          onInterruptCase,
          onThenCase,
          onBothCase,
          onStacklessCase
        );
      }
      case "Both": {
        return foldLoop(
          tail.prepend(head.right).prepend(head.left),
          output.prepend(Either.left(BothCase)),
          onEmptyCase,
          onFailCase,
          onDieCase,
          onInterruptCase,
          onThenCase,
          onBothCase,
          onStacklessCase
        );
      }
      case "Then": {
        return foldLoop(
          tail.prepend(head.right).prepend(head.left),
          output.prepend(Either.left(ThenCase)),
          onEmptyCase,
          onFailCase,
          onDieCase,
          onInterruptCase,
          onThenCase,
          onBothCase,
          onStacklessCase
        );
      }
      case "Stackless": {
        return foldLoop(
          tail.prepend(head.cause),
          output.prepend(Either.left(StacklessCase(head.stackless))),
          onEmptyCase,
          onFailCase,
          onDieCase,
          onInterruptCase,
          onThenCase,
          onBothCase,
          onStacklessCase
        );
      }
    }
  }
  return output.reduce(List.empty<Z>(), (acc, either) => {
    switch (either._tag) {
      case "Right": {
        return acc.prepend(either.right);
      }
      case "Left": {
        const causeCase = either.left;
        switch (causeCase._tag) {
          case "BothCase": {
            const left = acc.unsafeHead()!;
            const right = acc.unsafeTail()!.unsafeHead()!;
            const causes = acc.unsafeTail()!.unsafeTail()!;
            return causes.prepend(onBothCase(left, right));
          }
          case "ThenCase": {
            const left = acc.unsafeHead()!;
            const right = acc.unsafeTail()!.unsafeHead()!;
            const causes = acc.unsafeTail()!.unsafeTail()!;
            return causes.prepend(onThenCase(left, right));
          }
          case "StacklessCase": {
            const stackless = causeCase.stackless;
            const cause = acc.unsafeHead()!;
            const causes = acc.unsafeTail()!;
            return causes.prepend(onStacklessCase(cause, stackless));
          }
        }
      }
    }
  });
}
