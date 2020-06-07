import {MOVE, PLAYER_JOIN, GameActionTypes, RESET, Point} from "../types/gameTypes";
import { Player } from "../../config/types";

export function addPlayerWithDetail(name:string, self:boolean):GameActionTypes {
  return addPlayer({
    name: name,
    self: self
  });
}

export function addPlayer(player:Player):GameActionTypes {
  return {
    type: PLAYER_JOIN,
    player: player
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