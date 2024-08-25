import type { Message } from "./data/Messages";

import { describe, it, expect } from "bun:test";

import MockConnection from "../test/MockConnection";
import Application from "./Application";
import { HardComputer } from "./player/HardComputer";
import { MediumComputer } from "./player/MediumComputer";
import { EasyComputer } from "./player/EasyComputer";
import { Human } from "./player/Human";

describe("Application", () => {
  describe("choosePlayerOnce", () => {
    it("returns computer on CH", async () => {
      let mockConn = new MockConnection(["C", "H"]);
      let app = new Application(mockConn);
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        "app/msg/promptPlayer",
        "app/msg/promptComputer",
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(HardComputer);
    });

    it("returns computer on CM", async () => {
      let mockConn = new MockConnection(["C", "M"]);
      let app = new Application(mockConn);
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        "app/msg/promptPlayer",
        "app/msg/promptComputer",
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(MediumComputer);
    });

    it("returns computer on CE", async () => {
      let mockConn = new MockConnection(["C", "E"]);
      let app = new Application(mockConn);
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        "app/msg/promptPlayer",
        "app/msg/promptComputer",
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(EasyComputer);
    });

    it("returns human on H", async () => {
      let mockConn = new MockConnection(["H"]);
      let app = new Application(mockConn);
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        "app/msg/promptPlayer",
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(Human);
    });
  });
});
