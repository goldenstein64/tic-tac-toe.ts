import { describe, it, expect } from "@jest/globals";

import MockConnection from "../test/MockConnection";
import Application from "./Application";
import { Mark } from "./data/Mark";
import { Connection, Message } from "./messages/Messages";
import { HardComputer } from "./player/HardComputer";
import { MediumComputer } from "./player/MediumComputer";
import { EasyComputer } from "./player/EasyComputer";
import { Human } from "./player/Human";

describe("Application", () => {
  describe("choosePlayerOnce", () => {
    let mockConn: MockConnection;
    let app: Application;
    beforeEach(() => {
      mockConn = new MockConnection();
      app = new Application(mockConn);
    });

    it("returns computer on CH", async () => {
      mockConn.inputs = ["C", "H"];
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        "app/msg/promptPlayer",
        "app/msg/promptComputer",
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(HardComputer);
    });

    it("returns computer on CM", async () => {
      mockConn.inputs = ["C", "M"];
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        "app/msg/promptPlayer",
        "app/msg/promptComputer",
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(MediumComputer);
    });

    it("returns computer on CE", async () => {
      mockConn.inputs = ["C", "E"];
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        "app/msg/promptPlayer",
        "app/msg/promptComputer",
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(EasyComputer);
    });

    it("returns human on H", async () => {
      mockConn.inputs = ["H"];
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        "app/msg/promptPlayer",
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(Human);
    });
  });
});
