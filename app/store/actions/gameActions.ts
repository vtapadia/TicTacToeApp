import {MOVE, PLAYER_JOIN, GameActionTypes, RESET, Point, Mark} from "../types/gameTypes";
import { Player } from "../../config/types";

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

export function reset():GameActionTypes {
  return {
    type: RESET
  };
}