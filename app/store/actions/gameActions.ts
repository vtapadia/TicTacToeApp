import {MOVE, PLAYER_JOIN, GameActionTypes, RESET, Point, Mark, APP_USER, AppUserAction, SelectDifficultyAction, SELECT_DIFFICULTY, REPLAY} from "../types/gameTypes";
import { Player, DifficultyLevel } from "../../config/types";

export function addAppUser(player: Player):AppUserAction {
  return {
    type: APP_USER,
    appUser: player
  };
}

export function setDifficultyLevel(level: DifficultyLevel):SelectDifficultyAction {
  return {
    type: SELECT_DIFFICULTY,
    level: level
  };
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