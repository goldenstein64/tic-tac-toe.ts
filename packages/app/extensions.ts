declare global {
  interface IteratorObject<T, TReturn, TNext> {
    intersperse<U>(sep: U): IteratorObject<T | U, TReturn, TNext>;
    chunk(count: number): IteratorObject<T[], TReturn, TNext>;
  }
}

Iterator.prototype.intersperse = function* intersperse<U, T, TReturn, TNext>(
  this: IteratorObject<T, TReturn, TNext>,
  sep: U
) {
  let nextArg: TNext;
  const next: IteratorResult<T, TReturn> = this.next();
  if (next.done) {
    return next.value;
  } else {
    nextArg = yield next.value;
  }

  while (true) {
    const { done, value } = this.next(nextArg as TNext);
    if (done) {
      return value;
    } else {
      yield sep;
      nextArg = yield value;
    }
  }
};

function* iterMap<U, T, TReturn, TNext>(
  iter: IteratorObject<T, TReturn, TNext>,
  over: (value: T, index: number) => U
): IteratorObject<U, TReturn, TNext> {
  let next = iter.next();
  let i = 0;
  while (!next.done) {
    let nextArg = yield over(next.value, i++);
    next = iter.next(nextArg);
  }
  return next.value;
}

Iterator.prototype.chunk = function* chunk<T, TReturn, TNext>(
  this: IteratorObject<T, TReturn, TNext>,
  count: number
): IteratorObject<T[], TReturn, TNext> {
  if (count === 1) return yield* iterMap(this, (value) => [value]);

  let nextArg: TNext;
  const next: IteratorResult<T, TReturn> = this.next();
  if (next.done) {
    return next.value;
  }

  let thisNext = [next.value];
  while (thisNext.length < count) {
    const { done, value } = this.next();
    if (done) {
      yield thisNext;
      return value;
    } else {
      thisNext.push(value);
    }
  }

  nextArg = yield thisNext;
  thisNext = [];

  while (true) {
    while (thisNext.length < count) {
      const { done, value } = this.next(nextArg);
      if (done) {
        if (thisNext.length > 0) yield thisNext;
        return value;
      } else {
        thisNext.push(value);
      }
    }
    nextArg = yield thisNext;
    thisNext = [];
  }
};

export {};
