import "./extensions";
import Application from "@goldenstein64/tic-tac-toe";
import ConsoleConnection from "./ConsoleConnection";

const connection = new ConsoleConnection();

const app = new Application(connection);

const players = await app.choosePlayers();
const winner = await app.playGame(players);
await app.displayWinner(winner);
