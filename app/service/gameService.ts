import { Player } from "../config/types";
import * as backend from "./backendService";
import { Mark } from "../store/types/gameTypes";
import { random } from "../util/appUtils";

const serverBase:string    = "https://vtapadia-tic-tac-toe.herokuapp.com";
const webSocketBase:string = "wss://vtapadia-tic-tac-toe.herokuapp.com";

let ws:WebSocket;
let clientId:number = random(10);

backend.setServerBase(serverBase);

export function setServerBase(url: string) {
  backend.setServerBase(serverBase);
}

export async function createGame(player: Player):Promise<string> {
  try {
    let response = await backend.post<GameResponse>("/api/game", {userName: player.name});
    let gameResponse = response.parsedBody;
    if (gameResponse) {
      return Promise.resolve(gameResponse.gameId);
    }
  } catch (error) {
    console.error("Failed to connect %s", error);
  }
  return Promise.reject("Fail to create a Game. Please try again");
}

function configureWS(gameId:string) {
  
  ws = new WebSocket(webSocketBase + "/game/" + gameId);

  ws.onopen =() => {
    ws.send(JSON.stringify({type:"hello", id: clientId, version: '2', subs: ['/game/'+gameId]}));
    console.log("Web Socket connection created");
  }
  ws.onmessage = (msg)=> {
    var data = JSON.parse(msg.data);
    switch(data.type) {
      case "ping": 
        console.log("Received ping, sending it back");
        ws.send(JSON.stringify({type: "ping", id: clientId}));
        break;
      case "message":
        console.log("Message received from server:", msg);
        break;
      case "pub":
        console.log("Published message from server:", msg);
        var msgFromServer = JSON.parse(data.message);
        handleMessageFromServer(msgFromServer);
        break;
      default:
        console.log("Something else received", msg);
    }
  }
  ws.onerror =(e) => {
    console.log("Error:", e);
  }
  ws.onclose = (e) => {
    console.log("Closing connection ",e);
  }
}

function handleMessageFromServer(msg:any) {

}

export async function closeGame(gameId:string) {
  if (ws) {
    ws.send(JSON.stringify({type: "unsub", id: clientId, path: "/game/" + gameId}));
    ws.close();
  }
}

export async function joinBoard(gameId:string, player: Player): Promise<Mark> {
  try {
    let response = await backend.post<JoinBoardResponse>(
      "/api/game/"+gameId+"/player",
      player
    );
    if (response.parsedBody) {
      console.log("User registered with " + response.parsedBody.mark);
      return Promise.resolve(response.parsedBody.mark);
    }
  } catch (error) {
    console.error("Failed to connect %s", error);
  }
  return Promise.reject(undefined);
}

interface GameResponse {
  gameId: string
}

interface JoinBoardResponse {
  mark: Mark
}
