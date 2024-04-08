import { Board } from "./data/Board";
import { Mark, marks } from "./data/Mark";
import { Connection, Message } from "./messages/Messages";
import Human from "./player/Human";

export interface Player {
  getMove(board: Board, mark: Mark): Promise<number>;
}

export default class Application {
  #connection: Connection;

  constructor(connection: Connection) {
    this.#connection = connection;
  }

  async choosePlayer(mark: Mark): Promise<Player | undefined> {
    let playerInput = await this.#connection.prompt(
      Message.MSG_PROMPT_PLAYER,
      mark
    );
    switch (playerInput) {
      case "H":
        return new Human(this.#connection);
      case "C":
        let computerInput = await this.#connection.prompt(
          Message.MSG_PROMPT_COMPUTER,
          mark
        );
        switch (computerInput) {
          case "E":
            return;
          case "M":
            return;
          case "H":
            return;
          default:
            this.#connection.print(Message.ERR_COMPUTER_INVALID, computerInput);
            return undefined;
        }
      default:
        this.#connection.print(Message.ERR_PLAYER_INVALID, playerInput);
        return undefined;
    }
  }

  async choosePlayers(): Promise<Map<Mark, Player>> {
    let mark = Mark.X;
    let result = new Map<Mark, Player>();
    for (let i = 0; i < 2; i++) {
      let chosenPlayer: Player | undefined;
      do {
        chosenPlayer = await this.choosePlayer(mark);
      } while (chosenPlayer === undefined);
      result.set(mark, chosenPlayer);
      mark = marks.other(mark);
    }
    return result;
  }

  async playGame(
    board: Board,
    players: Map<Mark, Player>
  ): Promise<Mark | undefined> {
    let currentMark = Mark.X;
    while (!board.full()) {
      let player = players.get(currentMark)!;
      let move = await player.getMove(board, currentMark);
      board.setMark(move, currentMark);
      currentMark = marks.other(currentMark);
    }
    currentMark = marks.other(currentMark);
    return board.won(currentMark) ? currentMark : undefined;
  }

  displayWinner(winner: Mark | undefined): void {
    if (winner !== undefined) {
      this.#connection.print(Message.MSG_PLAYER_WON, winner);
    } else {
      this.#connection.print(Message.MSG_TIED);
    }
  }
}
