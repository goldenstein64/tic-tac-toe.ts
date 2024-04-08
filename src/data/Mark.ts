export enum Mark {
  X,
  O,
}

export const marks = Object.freeze({
  toString(mark: Mark): string {
    if (mark === Mark.X) {
      return "X";
    } else if (mark === Mark.O) {
      return "O";
    } else {
      throw new TypeError(`Unknown Mark value '${mark}'`);
    }
  },

  other(mark: Mark): Mark {
    return mark === Mark.X ? Mark.O : Mark.X;
  },
});
