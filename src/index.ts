import Application from "./Application";
import { Board } from "./data/Board";
import { ConsoleConnection } from "./messages/ConsoleConnection";

let consoleConnection = new ConsoleConnection();

let app = new Application(consoleConnection);

let winner = await app.playGame(new Board(), await app.choosePlayers());

app.displayWinner(winner);
