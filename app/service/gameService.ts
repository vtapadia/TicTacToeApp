import { Player } from "../config/types";
import * as backend from "./backendService";
import { Mark, Status, Point } from "../store/types/gameTypes";
import { random } from "../util/appUtils";
import { processColor } from "react-native";
import { useStore } from 'react-redux'
import { StoreType } from "../store/store";
import { addPlayer, move } from "../store/actions/gameActions";


let serverBase:string    = "https://vtapadia-tic-tac-toe.herokuapp.com";
let webSocketBase:string = "wss://vtapadia-tic-tac-toe.herokuapp.com";

if (__DEV__) {
  serverBase=  "http://localhost:3000";
  webSocketBase = "ws://localhost:3000";
}

let appUser:Player;
let ws:WebSocket;
let clientId:number = random(10);

backend.setServerBase(serverBase);

export function setServerBase(url: string) {
  backend.setServerBase(serverBase);
}

export async function createGame(player: Player):Promise<string> {
  appUser = player;
  let message = "Unknown Error. Please try again";
  try {
    let response = await backend.post<CreateGameResponse>("/api/game", {userName: player.name});
    let gameResponse = response.parsedBody;
    if (gameResponse) {
      console.log("Game created %s", gameResponse.gameId);
      return Promise.resolve(gameResponse.gameId);
    }
  } catch (error) {
    console.log("Failed to connect: ", error);
    message = "Error:" + error.message + ". Please try in some time.";
  }
  return Promise.reject(message);
}

export async function getGame(gameId:string):Promise<GameResponse> {
  try {
    let response = await backend.get<GameResponse>("/api/game/" + gameId);
    let gameResponse = response.parsedBody;
    if (gameResponse) {
      Promise.resolve(gameResponse);
    }
  } catch (error) {
    console.log("Failed to connect: ", error);
  }
  return Promise.reject("Failed to find the message");
}

export async function subscribe(gameId:string) {
  
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
        handleMessageFromServer(gameId, data.message);
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

function handleMessageFromServer(gameId:string, msg:PublishMessage) {
  // console.log("Message :::: ", msg);
  switch (msg.type) {
    case PubMsgType.PLAYER_JOIN:
      if (msg.game.status == Status.READY) {
        getGame(gameId).then((gr) => {
          let store:StoreType = useStore();
          let appUser = store.getState().gameReducer.appUser;
          
          if (gr.status == Status.READY && gr.players.X && gr.players.O) {
            let xPl:Player = gr.players.X;
            let oPl:Player = gr.players.O;

            if (gr.players.X?.name == appUser?.name) {
              store.dispatch(addPlayer({
                ...xPl,
                self: true
              }, Mark.X));
              store.dispatch(addPlayer({
                ...oPl,
                self: false
              }, Mark.O));
            } else {
              store.dispatch(addPlayer({
                ...xPl,
                self: false
              }, Mark.X));
              store.dispatch(addPlayer({
                ...oPl,
                self: true
              }, Mark.O));
            }
          }
        })
      }
      break;
    case PubMsgType.MOVE:
      if (msg.game.point) {
        let store:StoreType = useStore();
        store.dispatch(move(msg.game.point))
      }
  }
}

export async function unsubscribe(gameId:string) {
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
    console.log(response);
    if (response.parsedBody) {
      console.log("User registered with " + response.parsedBody.mark);
      return Promise.resolve(response.parsedBody.mark);
    }
  } catch (error) {
    console.error("Failed to connect %s", error);
  }
  return Promise.reject(undefined);
}

interface CreateGameResponse {
  gameId: string
}

interface JoinBoardResponse {
  mark: Mark
}

interface GameResponse {
  status: Status,
  turn: Mark,
  players: { [key in Mark]: Player | undefined},
}

declare type PublishMessage = {
  type: PubMsgType
  msg?: string
  game: {
    status: Status
    turn: Mark
    point?: Point
  }
}

enum PubMsgType {
  PLAYER_JOIN="PLAYER_JOIN",
  MOVE="MOVE"
}