import type { Message, Connection } from "../lib/data/Messages";

export default class ConsoleConnection implements Connection {
  constructor(readonly format: (message: Message) => string) {}

  async prompt(message: Message): Promise<string> {
    const input = prompt(this.format(message));
    if (!input) throw new TypeError("EOF encountered!");
    return input;
  }

  async print(message: Message): Promise<void> {
    console.write(this.format(message), "\n");
  }
}
