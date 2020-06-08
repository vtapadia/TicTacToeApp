import { Player } from "../config/types";
import * as backend from "./backendService";

const serverBase:string = "https://vtapadia-tic-tac-toe.herokuapp.com";

backend.setServerBase(serverBase);

export function setServerBase(url: string) {
  backend.setServerBase(serverBase);
}

export async function createGame(player: Player):Promise<string> {
  try {
    let response = await backend.post<GameResponse>("/api/game", {userName: player.name});
    // let response = await fetch("https://vtapadia-tic-tac-toe.herokuapp.com/api/game");
    let gameResponse = response.parsedBody;
    if (gameResponse) {
      return Promise.resolve(gameResponse?.gameId);
    }
  } catch (error) {
    console.error("Failed to connect %s", error);
  }
  return Promise.reject("Fail to create a Game. Please try again");
}

interface GameResponse {
  gameId: string
}
