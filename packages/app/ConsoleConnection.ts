import type { Message, Connection } from "@goldenstein64/tic-tac-toe";

export class EOFError extends Error {
  constructor(message: string = "EOF encountered!", options?: ErrorOptions) {
    super(message, options);

    this.name = "EOFError";
  }
}

export default class ConsoleConnection implements Connection {
  constructor(readonly format: (message: Message) => string) {}

  async prompt(message: Message): Promise<string> {
    const input = prompt(this.format(message));
    if (!input) throw new EOFError();
    return input;
  }

  async print(message: Message): Promise<void> {
    console.write(this.format(message), "\n");
  }
}
