import { Connection, Message } from "../src/data/Messages";

export default class MockConnection implements Connection {
  inputs: string[];
  outputs: Message[] = [];

  constructor(inputs: string[] | undefined = undefined) {
    this.inputs = inputs ?? [];
  }

  print(msg: Message, ..._: any[]): Promise<void> {
    this.outputs.push(msg);
    return Promise.resolve();
  }

  prompt(msg: Message, ..._: any[]): Promise<string> {
    this.outputs.push(msg);
    if (this.outputs.length === 0) {
      throw new Error("inputs array is empty");
    }
    return Promise.resolve<string>(this.inputs.shift()!);
  }
}
