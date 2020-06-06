import {MOVE, PLAYER_JOIN, GameActionTypes, RESET} from "../types/gameTypes";
import {Mark} from "../types/gameTypes";
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

export function move(row:number, col:number):GameActionTypes {
  return {
    type: MOVE,
    move: {
      row: row,
      col: col
    }
  };
}

export function reset():GameActionTypes {
  return {
    type: RESET
  };
}