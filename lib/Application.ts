import type { Connection } from "./data/Messages";
import type { Mark } from "./data/Mark";

import Board from "./data/Board";
import { marks } from "./data/Mark";

import EasyComputer from "./player/EasyComputer";
import MediumComputer from "./player/MediumComputer";
import HardComputer from "./player/HardComputer";
import Human from "./player/Human";

export interface Player {
  getMove(board: Board, mark: Mark): Promise<number>;
}

export default class Application {
  #connection: Connection;

  constructor(connection: Connection) {
    this.#connection = connection;
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

  async playGame(board: Board, players: Player[]): Promise<Mark | undefined> {
    let currentIndex = 0;
    let currentMark: Mark = "X";
await this.#connection.print({ id: "app/msg/board", board });
    while (!board.full()) {
      let player = players[currentIndex];
      let move = await player.getMove(board, currentMark);
      board.setMark(move, currentMark);
await this.#connection.print({ id: "app/msg/board", board });
      if (board.won(currentMark)) return currentMark;
      currentIndex = (currentIndex % players.length) + 1;
      currentMark = marks.other(currentMark);
    }
    currentMark = marks.other(currentMark);
    return board.won(currentMark) ? currentMark : undefined;
  }

async displayWinner(winner: Mark | undefined): Promise<void> {
    if (winner !== undefined) {
await this.#connection.print({ id: "app/msg/playerWon", mark: winner });
    } else {
await this.#connection.print({ id: "app/msg/tied" });
    }
  }
}
