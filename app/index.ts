import Application from "../lib/Application";
import { Board } from "../lib/data/Board";
import { ConsoleConnection } from "./ConsoleConnection";

let consoleConnection = new ConsoleConnection();

let app = new Application(consoleConnection);

let winner = await app.playGame(new Board(), await app.choosePlayers());

app.displayWinner(winner);
