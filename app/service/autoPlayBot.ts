import { Mark, Point } from "../store/types/gameTypes";
import { DifficultyLevel } from "../config/types";

// let botLevel: DifficultyLevel = DifficultyLevel.EASY;

// export function setLevel(level: DifficultyLevel) {
//   botLevel = level;
// }

export function playComputer(board: Mark[][], level?: DifficultyLevel):Point|undefined {
  let botLevel = (level) ? level : DifficultyLevel.EASY;
  switch (botLevel) {
    case DifficultyLevel.EASY:
      return playEasy(board);
    case DifficultyLevel.MEDIUM:
      return playMedium(board);
    case DifficultyLevel.HARD:
      return playHard(board);
  }
}

function playEasy(board: Mark[][]):Point|undefined {
  let copy = board.map(a => a.slice(0));
  let emptyPlaces = getEmptyPlaces(copy);
  if (emptyPlaces.length >0) {
    let random = Math.floor(Math.random() * emptyPlaces.length);
    console.log("Playing an easy move");
    return emptyPlaces[random];
  }
  return undefined;
}

function playMedium(board: Mark[][]):Point|undefined {
  let copy = board.map(a => a.slice(0));
  console.log("Searching a Medium move");
  // console.log(copy);
  let emptyPlaces = getEmptyPlaces(copy);
  let chosen = undefined;
  emptyPlaces.forEach(p => {
    copy[p.row][p.col] = Mark.X
    let [finished, winner] = hasEnded(copy);
    // console.log("Medium " + finished + " " + winner);
    if (finished) {
      if (winner == Mark.X) {
        chosen = p;
      }
    }
    copy = board.map(a => a.slice(0));
  });
  return (chosen) ? chosen : playEasy(board);
}

function playHard(board: Mark[][]):Point|undefined {
  var copy = board.map(a => a.slice(0));
  let emptyPlaces = getEmptyPlaces(copy);
  console.log("Searching a Hard move");
  let chosen = undefined;
  emptyPlaces.forEach(p => {
    copy[p.row][p.col] = Mark.O
    let [finished, winner] = hasEnded(copy);
    if (finished) {
      if (winner == Mark.O) {
        chosen = p;
      }
    }
    copy = board.map(a => a.slice(0));
  });
  return (chosen) ? chosen : playMedium(board);
}


export function hasEnded(board: Mark[][]):[boolean, Mark | undefined] {
  for (let i=0; i < 3; i++) {
    if (board[i][0] == board[i][1] && 
      board[i][1] == board[i][2] &&
      board[i][0]) {
        return [true, board[i][0]];
      }
      if (board[0][i] == board[1][i] && 
        board[1][i] == board[2][i] &&
        board[0][i]) {
          return [true, board[0][i]];
      }
  }
  if (board[0][0] == board[1][1] && 
    board[1][1] == board[2][2] &&
    board[0][0]) {
      return [true,board[0][0]];
  }
  if (board[2][0] == board[1][1] && 
    board[1][1] == board[0][2] &&
    board[2][0]) {
      return [true, board[2][0]];
  }
  if (getEmptyPlaces(board).length == 0) {
    return [true, undefined];
  }
  return [false, undefined];
}

export function getEmptyPlaces(board: Mark[][]):Point[] {
  let empty:Point[] = Array.of();
  for (let i=0; i < 3; i++) {
    for (let j=0; j<3; j++) {
      if (board[i][j] == undefined) {
        empty.push({row: i, col: j});
      }
    }
  }
  return empty;
}