import { describe, it, expect } from "@jest/globals";
import { marks } from "./Mark";

describe("marks", () => {
  describe("other", () => {
    it("works", () => {
      expect(marks.other("X")).toBe("O");
      expect(marks.other("O")).toBe("X");
    });
  });
});
