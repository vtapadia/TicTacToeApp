import { Status, GameState, GameActionTypes, PlayerJoinAction, PLAYER_JOIN, MOVE, Mark, MoveAction, RESET, Point, APP_USER, AppUserAction, SELECT_DIFFICULTY, SelectDifficultyAction, REPLAY, SET_GAMEMODE, SetGameModeAction, OFFLINE_RESET, GAME_STATE, GameStateAction, SET_GAMEID, SetGameIDAction } from '../types/gameTypes'

const initialState:GameState = {
  appUser: undefined,
  botLevel: undefined,
  mode: undefined,
  gameId: undefined,
  game: {
    status: Status.INITIAL,
    startedBy: Mark.X,
    turn: Mark.X,
    myMark: undefined,
    message: "Welcome to a Game of TicTacToe",
    board: [...Array(3)].map(x=>Array(3).fill(undefined)),
    players: {
      [Mark.X]: undefined, 
      [Mark.O]: undefined
    },
    winner: undefined,
    winCount: {
      [Mark.X]: 0,
      [Mark.O]: 0
    }
  }
}

export function gameReducer(state = initialState, action: GameActionTypes):GameState {
  switch(action.type) {
    case APP_USER:
      let appUserAction = action as AppUserAction;
      {
        let newState = {...state};
        newState.appUser = appUserAction.appUser;
        return newState;
      }
    case SELECT_DIFFICULTY:
      let selectDifficultyAction = action as SelectDifficultyAction;
      {
        let newState = {...state};
        newState.botLevel = selectDifficultyAction.level;
        return newState;
      }
    case SET_GAMEMODE:
      let gameModeAction = action as SetGameModeAction;
      {
        let newState = {...state};
        newState.mode = gameModeAction.mode;
        return newState;
      }
      case SET_GAMEID:
        let gameIdAction = action as SetGameIDAction;
        {
          let newState = {...state};
          newState.gameId = gameIdAction.id;
          return newState;
        }
      case PLAYER_JOIN:
      //Only add players when the game is not ready or finished.
      console.log("Player Join Action triggered");
      let playerJoinAction = action as PlayerJoinAction;
      let newState = {...state};

      let playerMark = playerJoinAction.piece;

      let game = newState.game;
      game.players[playerMark] = playerJoinAction.player;

      if (playerJoinAction.player.self) {
        newState.game.myMark = playerMark;
      }

      game.winCount.O = 0;
      game.winCount.X = 0;
        
      return newState;
    case MOVE:
      let moveAction = action as MoveAction;
      console.log("Move Action triggered");
      if (state.game.status == Status.READY) {
        let newState = {...state};
        let {row, col} = moveAction.move;
        let game = newState.game;
        game.board[row][col] = state.game.turn;
        game.turn = toggle(state.game.turn);
        let [finished, winner] = hasEnded(newState.game.board);

        if (finished) {
          game.status = Status.FINISHED;
          if (winner) {
            game.winner = winner;
            if (winner == game.myMark) {
              game.message = "Congratulations !!!";
              game.winCount[game.myMark]++;
            } else {
              game.message = "You Lost... Better luck next time."
              if (game.myMark) {
                let oppositionMark = toggle(game.myMark);
                game.winCount[oppositionMark]++;
              }
            }
          } else {
            game.message = "It's a DRAW"
          }
        } else {
          if (game.myMark == game.turn) {
            game.message = "Your Turn.."
          } else {
            game.message = "Wait for other player turn";
          }
        }
        return newState;
      } else {
        console.log("Game is in state %s", state.game.status);
        return state;
      }
    case GAME_STATE:
      let gameStateAction = action as GameStateAction;
      {
        let nState = {
          ...state
        };
        nState.game.status = gameStateAction.status;
        return nState;
      }
    case REPLAY:
      {
        console.log("Replay Action triggered");
        let nState = {
          ...state
        };
        nState.game.status = Status.READY;
        nState.game.board = [...Array(3)].map(x=>Array(3).fill(undefined));
        nState.game.startedBy = toggle(nState.game.startedBy);
        nState.game.turn = nState.game.startedBy;
        nState.game.winner = undefined;
        return nState;
      }
    case OFFLINE_RESET:
      console.log("Offline Reset Action triggered");
      let nState = {
        ...state
      };
      nState.game.status = Status.INITIAL;
      nState.game.board = [...Array(3)].map(x=>Array(3).fill(undefined));
      nState.game.startedBy = Mark.X;
      nState.game.turn = nState.game.startedBy;
      nState.game.winner = undefined;
      nState.game.winCount.O = 0;
      nState.game.winCount.X = 0;
      return nState;
    case RESET:
      {
        console.log("Reset Action triggered");
        let nState = {
          ...initialState
        };
        nState.game.status = Status.INITIAL;
        nState.game.board = [...Array(3)].map(x=>Array(3).fill(undefined));
        nState.appUser = state.appUser;
        return nState;
      }
      default:
        return state;
  }
}

function toggle(mark: Mark):Mark {
  return (mark == Mark.X) ? Mark.O : Mark.X;
}

function hasEnded(board: Mark[][]):[boolean, Mark | undefined] {
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

function getEmptyPlaces(board: Mark[][]):Point[] {
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