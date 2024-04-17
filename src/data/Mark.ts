export type Mark = "X" | "O";

export const marks = Object.freeze({
  toString(mark: Mark): string {
    if (mark === "X") {
      return "X";
    } else if (mark === "O") {
      return "O";
    } else {
      throw new TypeError(`Unknown Mark value '${mark}'`);
    }
  },

  other(mark: Mark): Mark {
    return mark === "X" ? "O" : "X";
  },
});
