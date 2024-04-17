import { Board } from "./data/Board";
import { Mark, marks } from "./data/Mark";
import { Connection } from "./data/Messages";
import { EasyComputer } from "./player/EasyComputer";
import { HardComputer } from "./player/HardComputer";
import { Human } from "./player/Human";
import { MediumComputer } from "./player/MediumComputer";

export interface Player {
  getMove(board: Board, mark: Mark): Promise<number>;
}

export default class Application {
  #connection: Connection;

  constructor(connection: Connection) {
    this.#connection = connection;
  }

  async #chooseComputerOnce(mark: Mark): Promise<Player | undefined> {
    let computerInput = await this.#connection.prompt(
      "app/msg/promptComputer",
      mark
    );
    switch (computerInput) {
      case "E":
        return new EasyComputer();
      case "M":
        return new MediumComputer();
      case "H":
        return new HardComputer();
      default:
        this.#connection.print("app/err/computerInvalid", computerInput);
        return undefined;
    }
  }

  async choosePlayerOnce(mark: Mark): Promise<Player | undefined> {
    let playerInput = await this.#connection.prompt(
      "app/msg/promptPlayer",
      mark
    );
    switch (playerInput) {
      case "H":
        return new Human(this.#connection);
      case "C":
        return this.#chooseComputerOnce(mark);
      default:
        this.#connection.print("app/err/playerInvalid", playerInput);
        return undefined;
    }
  }

  async choosePlayer(mark: Mark): Promise<Player> {
    let player: Player | undefined = undefined;
    while (player === undefined) player = await this.choosePlayerOnce(mark);
    return player;
  }

  async choosePlayers(): Promise<Player[]> {
    return [await this.choosePlayer("X"), await this.choosePlayer("O")];
  }

  async playGame(board: Board, players: Player[]): Promise<Mark | undefined> {
    let currentIndex = 0;
    let currentMark: Mark = "X";
    while (!board.full()) {
      let player = players[currentIndex];
      let move = await player.getMove(board, currentMark);
      board.setMark(move, currentMark);
      if (board.won(currentMark)) return currentMark;
      currentIndex = (currentIndex % players.length) + 1;
      currentMark = marks.other(currentMark);
    }
    currentMark = marks.other(currentMark);
    return board.won(currentMark) ? currentMark : undefined;
  }

  displayWinner(winner: Mark | undefined): void {
    if (winner !== undefined) {
      this.#connection.print("app/msg/playerWon", winner);
    } else {
      this.#connection.print("app/msg/tied");
    }
  }
}
