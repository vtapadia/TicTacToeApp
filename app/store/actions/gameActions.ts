import {MOVE, PLAYER_JOIN, GameActionTypes, RESET, Point, Mark, APP_USER, AppUserAction, SelectDifficultyAction, SELECT_DIFFICULTY, REPLAY, SetGameModeAction, SET_GAMEMODE, OFFLINE_RESET, Status, GameStateAction, GAME_STATE, SET_GAMEID, SetGameIDAction} from "../types/gameTypes";
import { Player, DifficultyLevel, GameMode } from "../../config/types";

export function addAppUser(player: Player):AppUserAction {
  return {
    type: APP_USER,
    appUser: player
  };
}

export function removeAppUser():AppUserAction {
  return {
    type: APP_USER
  };
}

export function setDifficultyLevel(level: DifficultyLevel):SelectDifficultyAction {
  return {
    type: SELECT_DIFFICULTY,
    level: level
  };
}

export function setGameMode(mode: GameMode):SetGameModeAction {
  return {
    type: SET_GAMEMODE,
    mode: mode
  };
}

export function setGameState(status: Status):GameStateAction {
  return {
    type: GAME_STATE,
    status: status
  };
}

export function setGameId(gameId: string):SetGameIDAction {
  return {
    type: SET_GAMEID,
    id: gameId
  }
}

export function unsetGameId():SetGameIDAction {
  return {
    type: SET_GAMEID,
    id: undefined
  }
}

export function addPlayer(player:Player, piece: Mark):GameActionTypes {
  return {
    type: PLAYER_JOIN,
    player: player,
    piece: piece
  };
}

export function move(point: Point):GameActionTypes {
  return {
    type: MOVE,
    move: point
  };
}

export function replay():GameActionTypes {
  return {
    type: REPLAY
  };
}

export function reset():GameActionTypes {
  return {
    type: RESET
  };
}

export function offlineReset():GameActionTypes {
  return {
    type: OFFLINE_RESET
  };
}