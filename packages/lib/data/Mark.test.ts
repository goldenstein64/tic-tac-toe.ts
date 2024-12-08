import { describe, it, expect } from "bun:test";
import { marks } from "./Mark";

describe("marks", () => {
  describe("other", () => {
    it("works", () => {
      expect(marks.other("X")).toBe("O");
      expect(marks.other("O")).toBe("X");
    });
  });
});
