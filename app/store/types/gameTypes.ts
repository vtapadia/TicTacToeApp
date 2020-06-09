import { Player, DifficultyLevel } from "../../config/types";

export const PLAYER_JOIN = "PLAYER_JOIN";
export const MOVE = "MOVE";
export const RESET = "RESET";
export const REPLAY = "REPLAY";
export const APP_USER = "APP_USER";
export const SELECT_DIFFICULTY = "SELECT_DIFFICULTY";

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
  appUser: Player | undefined,
  game: {
    status: Status,
    message: string,
    board: Mark[][],
    players: { [key in Mark]: Player | undefined},
    startedBy: Mark,
    turn: Mark,
    myMark: Mark | undefined,
    level: DifficultyLevel | undefined,
    winner: Mark | undefined,
    winCount: { [key in Mark]: number}
  }
}

export interface PlayerJoinAction {
  type: typeof PLAYER_JOIN
  player: Player
  piece: Mark
}

export interface MoveAction {
  type: typeof MOVE
  move: Point
}

export interface ResetAction {
  type: typeof RESET
}
export interface ReplayAction {
  type: typeof REPLAY
}

export interface AppUserAction {
  type: typeof APP_USER
  appUser: Player
}

export interface SelectDifficultyAction {
  type: typeof SELECT_DIFFICULTY
  level: DifficultyLevel
}

export type GameActionTypes = AppUserAction | SelectDifficultyAction | PlayerJoinAction | MoveAction | ResetAction | ReplayAction;
