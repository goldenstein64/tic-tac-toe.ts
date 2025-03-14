import type { Connection } from "./data/Messages";
import type { Mark } from "./data/Mark";
import type { Player } from "./player";

import Board from "./data/Board";

import EasyComputer from "./player/EasyComputer";
import MediumComputer from "./player/MediumComputer";
import HardComputer from "./player/HardComputer";
import Human from "./player/Human";

export default class Application {
  #connection: Connection;
  board: Board;

  constructor(connection: Connection, pattern?: string) {
    this.#connection = connection;
    this.board = pattern ? Board.fromPattern(pattern) : new Board();
  }

  toString() {
    return this.board.toString();
  }

  async #chooseComputerOnce(mark: Mark): Promise<Player | undefined> {
    let input = await this.#connection.prompt({
      id: "app/msg/promptComputer",
      mark,
    });
    switch (input) {
      case "E":
        return new EasyComputer();
      case "M":
        return new MediumComputer();
      case "H":
        return new HardComputer();
      default:
        await this.#connection.print({ id: "app/err/computerInvalid", input });
        return undefined;
    }
  }

  async choosePlayerOnce(mark: Mark): Promise<Player | undefined> {
    let input = await this.#connection.prompt({
      id: "app/msg/promptPlayer",
      mark,
    });
    switch (input) {
      case "H":
        return new Human(this.#connection);
      case "C":
        return await this.#chooseComputerOnce(mark);
      default:
        await this.#connection.print({ id: "app/err/playerInvalid", input });
        return undefined;
    }
  }

  async choosePlayer(mark: Mark): Promise<Player> {
    let player: Player | undefined = undefined;
    do {
      player = await this.choosePlayerOnce(mark);
    } while (player === undefined);
    return player;
  }

  async choosePlayers(): Promise<Player[]> {
    return [await this.choosePlayer("X"), await this.choosePlayer("O")];
  }

  async playTurn(
    player: Player,
    mark: Mark
  ): Promise<{ winner: Mark | null } | undefined> {
    const move = await player.getMove(this.board, mark);
    this.board.setMark(move, mark);
    await this.#connection.print({
      id: "app/msg/board",
      board: this.board.toString(),
    });
    return this.board.ended(mark);
  }

  async playGame(players: Player[]): Promise<Mark | null> {
    let i = -1;
    await this.#connection.print({
      id: "app/msg/board",
      board: this.board.toString(),
    });
    while (true) {
      i = (i + 1) % players.length;
      const mark = i === 0 ? "X" : "O";
      const player = players[i];
      const endResult = await this.playTurn(player, mark);
      if (endResult) return endResult.winner;
    }
  }

  async displayWinner(winner: Mark | null): Promise<void> {
    if (winner) {
      await this.#connection.print({ id: "app/msg/playerWon", mark: winner });
    } else {
      await this.#connection.print({ id: "app/msg/tied" });
    }
  }
}
