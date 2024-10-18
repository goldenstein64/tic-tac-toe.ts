import type { Mark } from "./Mark";

export const BOARD_SIZE: number = 9;

export const WIN_PATTERNS = Object.freeze([
  Object.freeze([0, 1, 2]),
  Object.freeze([3, 4, 5]),
  Object.freeze([6, 7, 8]),
  Object.freeze([0, 3, 6]),
  Object.freeze([1, 4, 7]),
  Object.freeze([2, 5, 8]),
  Object.freeze([0, 4, 8]),
  Object.freeze([2, 4, 6]),
]);

export default class Board {
  readonly data: (Mark | undefined)[];

  static fromPattern(pattern: string): Board {
    let result = new Board();
    for (let i = 0; i < BOARD_SIZE; i++) {
      let char = pattern.charAt(i);
      switch (char) {
        case "X":
        case "O":
          result.data[i] = char;
          break;
        default:
          result.data[i] = undefined;
      }
    }
    return result;
  }

  constructor(data?: (Mark | undefined)[]) {
    this.data = data ?? Array(BOARD_SIZE).fill(undefined);
  }

  clone(): Board {
    let result = new Board();
    for (let i = 0; i < BOARD_SIZE; i++) {
      result.data[i] = this.data[i];
    }
    return result;
  }

  setMark(pos: number, mark: Mark | undefined): void {
    if (pos < 0 || pos >= BOARD_SIZE) {
      throw new TypeError("position is out of range");
    } else if (this.data[pos] !== undefined) {
      throw new TypeError("this position is already marked!");
    } else {
      this.data[pos] = mark;
    }
  }

  isMarkedWith(pos: number, mark: Mark | undefined): boolean {
    return pos >= 0 && pos < BOARD_SIZE && this.data[pos] === mark;
  }

  canMark(pos: number): boolean {
    return this.isMarkedWith(pos, undefined);
  }

  won(mark: Mark): boolean {
    return WIN_PATTERNS.some((pattern) =>
      pattern.map((i) => this.data[i]).every((m) => m === mark)
    );
  }

  empty(): boolean {
    return this.data.every((m) => m === undefined);
  }

  full(): boolean {
    return this.data.every((m) => m !== undefined);
  }

  toString(): string {
    let data = this.data.map((m, i) =>
      m === undefined ? (i + 1).toString() : m
    );
    return ` ${data[0]} | ${data[1]} | ${data[2]}
-----------
 ${data[3]} | ${data[4]} | ${data[5]}
-----------
 ${data[6]} | ${data[7]} | ${data[8]}`;
  }
}
