import { Player } from "../config/types";
import * as backend from "./backendService";
import { Mark, Status, Point } from "../store/types/gameTypes";
import { random } from "../util/appUtils";
import { addPlayer, move, setGameState, replay } from "../store/actions/gameActions";


let serverBase:string    = "https://vtapadia-tic-tac-toe.herokuapp.com";
let webSocketBase:string = "wss://vtapadia-tic-tac-toe.herokuapp.com";

if (__DEV__) {
  serverBase=  "http://localhost:3000";
  webSocketBase = "ws://localhost:3000";
}

const storeDispatch = {
  addPlayer,
  move,
  setGameState,
  replay
}
type DispatchType = typeof storeDispatch

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
    if (response.status == 200 && response.parsedBody) {
      let gameResponse = response.parsedBody;
      console.log("Game created %s", gameResponse.gameId);
      return Promise.resolve(gameResponse.gameId);
    } else {
      console.log("Failed with following response: ", response);
      message = "Error: failed to create game.";
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
    if (response.status == 200 && gameResponse) {
      return Promise.resolve(gameResponse);
    } else {
      console.log("Failed to get the game with id %s, response: ", gameId);
    }
  } catch (error) {
    console.log("Failed to connect: ", error);
  }
  return Promise.reject("Failed to find the game");
}

export async function subscribe(gameId:string, dispatcher: Readonly<DispatchType>,
  callbackSuccess?: (() => void), callbackClose?: ((e:CloseEvent) => void)) {
  
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
      case "hello":
        console.log("Connection and initialization done.");
        if (callbackSuccess) {callbackSuccess();}
        break;
      case "message":
        console.log("Message received from server:", msg);
        break;
      case "pub":
        console.log("Published message from server:", msg);
        handleMessageFromServer(gameId, dispatcher, data.message as PublishMessage);
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
    if (callbackClose) {
      callbackClose(e);
    }
  }
}

function handleMessageFromServer(gameId:string, dispatcher: DispatchType, msg:PublishMessage) {
  console.log("Message :::: ", msg);
  switch (msg.type) {
    case PubMsgType.PLAYER_JOIN:
      if (msg.game.status == Status.READY) {
        getGame(gameId).then((gr) => {
          console.log("Game state ", gr);
          // let store:StoreType = useStore();
          // let appUser = store.getState().gameReducer.appUser;
          
          if (gr.status == Status.READY && gr.players.X && gr.players.O) {
            let xPl:Player = gr.players.X;
            let oPl:Player = gr.players.O;

            if (gr.players.X?.name == appUser?.name) {
              dispatcher.addPlayer({
                ...xPl,
                self: true
              }, Mark.X);
              dispatcher.addPlayer({
                ...oPl,
                self: false
              }, Mark.O);
            } else {
              dispatcher.addPlayer({
                ...xPl,
                self: false
              }, Mark.X);
              dispatcher.addPlayer({
                ...oPl,
                self: true
              }, Mark.O);
            }
            dispatcher.setGameState(Status.READY);
          }
        }).catch(e => {
          console.log("Unable to get the game status :", e);
        })
      }
      break;
    case PubMsgType.MOVE:
      if (msg.game.point) {
        dispatcher.move(msg.game.point);
        // let store:StoreType = useStore();
        // store.dispatch(move(msg.game.point))
      }
      break;
    case PubMsgType.REPLAY:
      dispatcher.replay();
      break;
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
    console.log("Joining game with player ", player);
    let response = await backend.post<JoinBoardResponse>(
      "/api/game/"+gameId+"/player",
      player
    );
    if (response.status == 200 && response.parsedBody) {
      console.log("User registered with ", response.parsedBody);
      return Promise.resolve(response.parsedBody.mark);
    } else {
      console.log("User joining failed with reason ", response.parsedBody);
      return Promise.reject("Response failed for user joining");
    }
  } catch (error) {
    console.error("Failed to connect %s", error);
  }
  return Promise.reject("Something else went wrong");
}

export async function replayBoard(gameId:string, player: Player): Promise<SimpleResponse> {
  try {
    console.log("Replaying the game with player ", player);
    let response = await backend.post<SimpleResponse>(
      "/api/game/"+gameId+"/replay",
      player
    );
    if (response.status == 200 && response.parsedBody) {
      if (response.parsedBody.code=="M0000") {
        console.log("Replay requested successfully ", response.parsedBody);
      }
      return Promise.resolve(response.parsedBody);
    } else {
      console.log("Replay failed with reason ", response.parsedBody);
      return Promise.reject("Response failed for replay action");
    }
  } catch (error) {
    console.error("Failed to connect %s", error);
  }
  return Promise.reject("Something else went wrong");
}

export async function moveByPlayer(gameId: string, moveInput: MoveInput): Promise<SimpleResponse> {
  try {
    let response = await backend.post<SimpleResponse>(
      "/api/game/"+gameId+"/move",
      moveInput
    );
    if (response.status == 200 && response.parsedBody) {
      console.log("Move success ", response.parsedBody);
      return Promise.resolve(response.parsedBody);
    } else {
      console.log("Move failed with reason ", response.parsedBody);
      return Promise.reject("Response failed for move");
    }
  } catch (error) {
    console.error("Failed to connect %s", error);
  }
  return Promise.reject("Failed");
}

interface MoveInput {
  mark: Mark
  point: Point
  player: Player
}
interface SimpleResponse {
  code: string
  msg: string
}

interface CreateGameResponse {
  gameId: string
}

interface JoinBoardResponse {
  mark: Mark
}

interface GameResponse {
  status: Status
  turn: Mark
  players: { [key in Mark]: Player | undefined}
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
  MOVE="MOVE",
  REPLAY="REPLAY"
}