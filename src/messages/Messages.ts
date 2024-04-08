export enum Message {
  // application messages
  MSG_BOARD,
  MSG_PLAYER_WON,
  MSG_TIED,
  MSG_PROMPT_PLAYER,
  MSG_PROMPT_COMPUTER,
  ERR_PLAYER_INVALID,
  ERR_COMPUTER_INVALID,

  // human messages
  MSG_PROMPT_MOVE,
  ERR_NAN,
  ERR_OUT_OF_RANGE,
  ERR_OCCUPIED,
}

export interface Connection {
  print(msg: Message, ...args: any[]): Promise<void>;
  prompt(msg: Message, ...args: any[]): Promise<string>;
}
