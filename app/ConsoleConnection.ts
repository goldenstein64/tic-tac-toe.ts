import type { Message, Connection } from "../lib/data/Messages";

export default class ConsoleConnection implements Connection {
  constructor(readonly format: (message: Message) => string) {}

  async prompt(message: Message): Promise<string> {
    return prompt(this.format(message))!;
  }

  print(message: Message): Promise<void> {
    console.write(this.format(message), "\n");
    return Promise.resolve();
  }
}
