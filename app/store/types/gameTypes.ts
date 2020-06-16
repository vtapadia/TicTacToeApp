import { Player, DifficultyLevel, GameMode } from "../../config/types";

export const PLAYER_JOIN = "PLAYER_JOIN";
export const MOVE = "MOVE";
export const RESET = "RESET";
export const OFFLINE_RESET = "OFFLINE_RESET";
export const REPLAY = "REPLAY";
export const APP_USER = "APP_USER";
export const SELECT_DIFFICULTY = "SELECT_DIFFICULTY";
export const SET_GAMEMODE = "SET_GAMEMODE";
export const SET_GAMEID = "SET_GAMEID";
export const GAME_STATE = "GAME_STATE";

export enum Mark {
  X="X",
  O="O"
}

export enum Status {
  INITIAL="INITIAL",
  READY="READY",
  FINISHED="FINISHED"
}

export interface Point {
  row: number,
  col: number  
}

export interface GameState {
  appUser: Player | undefined,
  botLevel: DifficultyLevel | undefined,
  mode: GameMode | undefined,
  gameId?: string,
  game: {
    status: Status,
    message: string,
    board: Mark[][],
    players: { [key in Mark]: Player | undefined},
    startedBy: Mark,
    turn: Mark,
    myMark: Mark | undefined,
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
export interface OfflineResetAction {
  type: typeof OFFLINE_RESET
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

export interface SetGameModeAction {
  type: typeof SET_GAMEMODE
  mode: GameMode
}

export interface SetGameIDAction {
  type: typeof SET_GAMEID
  id?: string
}

export interface GameStateAction {
  type: typeof GAME_STATE
  status: Status
}

export type GameActionTypes = AppUserAction | SetGameModeAction | SetGameIDAction | SelectDifficultyAction | PlayerJoinAction | MoveAction | ResetAction | ReplayAction | OfflineResetAction | GameStateAction;
