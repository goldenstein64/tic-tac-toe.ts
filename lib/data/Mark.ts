export type Mark = "X" | "O";

export const marks = Object.freeze({
  other(mark: Mark): Mark {
    return mark === "X" ? "O" : "X";
  },
});
