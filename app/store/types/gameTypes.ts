import { Player } from "../../config/types";

export const PLAYER_JOIN = "PLAYER_JOIN";
export const MOVE = "MOVE";
export const RESET = "RESET";

export enum Mark {
  X="X",
  O="O"
}

export enum Status {
  INITIAL,
  READY,
  FINISHED
}

export interface Point {
  row: number,
  col: number  
}

export interface GameState {
  game: {
    status: Status,
    message: string,
    turn: Mark,
    myMark: Mark | undefined,
    board: Mark[][],
    players: { [key in Mark]: Player | undefined},
    winner: Mark | undefined
  }
}

export interface PlayerJoinAction {
  type: typeof PLAYER_JOIN
  player: Player
}

export interface MoveAction {
  type: typeof MOVE
  move: Point
}

export interface ResetAction {
  type: typeof RESET
}

export type GameActionTypes = PlayerJoinAction | MoveAction | ResetAction;
