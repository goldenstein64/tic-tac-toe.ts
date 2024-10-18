import { type Player } from ".";
import type Board from "../data/Board";
import { type Mark } from "../data/Mark";

import { randomInt } from "crypto";

import { range } from "../util";
import { BOARD_SIZE } from "../data/Board";

export default class EasyComputer implements Player {
  async getMove(board: Board, mark: Mark): Promise<number> {
    let all = range(BOARD_SIZE);
    let choices = all.filter((i) => board.canMark(i));
    return choices[randomInt(choices.length)];
  }
}
