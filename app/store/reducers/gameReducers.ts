import { Status, GameState, GameActionTypes, PlayerJoinAction, PLAYER_JOIN, MOVE, Mark, MoveAction, RESET } from '../types/gameTypes'

const initialState:GameState = {
  game: {
    status: Status.INITIAL,
    turn: Mark.X,
    myMark: undefined,
    message: "Welcome to a Game of TicTacToe",
    board: [...Array(3)].map(x=>Array(3).fill(undefined)),
    players: {
      [Mark.X]: undefined, 
      [Mark.O]: undefined
    },
    winner: undefined
  }
}

export function gameReducer(state = initialState, action: GameActionTypes):GameState {
  switch(action.type) {
    case PLAYER_JOIN:
      if (state.game.status == Status.INITIAL) {
        //Only add players when the game is not ready or finished.
        let playerJoinAction = action as PlayerJoinAction;
        let newState = {...state};

        let playerMark = (state.game.players.X) ? Mark.O : Mark.X;
  
        let game = newState.game;
        game.players[playerMark] = playerJoinAction.player;
  
        if (playerJoinAction.player.self) {
          newState.game.myMark = playerMark;
        }

        let newStatus = (game.players.O && game.players.X) ? Status.READY : newState.game.status;
        game.status = newStatus;
        
        if (newStatus == Status.READY) {
          if (game.players[game.turn]?.self) {
            game.message = "Your Turn.."
          } else {
            game.message = "Wait for other player turn";
          }
        }
        return newState;
      } else {
        return state;
      }
    case MOVE:
      let moveAction = action as MoveAction;
      if (state.game.status == Status.READY) {
        let newState = {...state};
        let {row, col} = moveAction.move;
        let game = newState.game;
        game.board[row][col] = state.game.turn;
        game.turn = (state.game.turn==Mark.X) ? Mark.O : Mark.X;
        game.winner = possibleWinner(newState);
        if (game.winner) {
          game.status = Status.FINISHED;
          game.message = "We have a winner !!"
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
    case RESET:
      let nState = {
        ...initialState
      };
      nState.game.status = Status.INITIAL;
      nState.game.players.O = undefined;
      nState.game.players.X = undefined;
      nState.game.board = [...Array(3)].map(x=>Array(3).fill(undefined));
      nState.game.turn = Mark.X
      nState.game.winner = undefined;
      console.log(nState);
      return nState;
    default:
      return state;
  }
}

function possibleWinner(state:GameState):Mark | undefined {
  for (let i=0; i < 3; i++) {
    if (state.game.board[i][0] == state.game.board[i][1] && 
      state.game.board[i][1] == state.game.board[i][2] &&
      state.game.board[i][0]) {
        return state.game.board[i][0];
      }
      if (state.game.board[0][i] == state.game.board[1][i] && 
        state.game.board[1][i] == state.game.board[2][i] &&
        state.game.board[0][i]) {
          return state.game.board[0][i];
      }
  }
  if (state.game.board[0][0] == state.game.board[1][1] && 
    state.game.board[1][1] == state.game.board[2][2] &&
    state.game.board[0][0]) {
      return state.game.board[0][0];
  }
  if (state.game.board[2][0] == state.game.board[1][1] && 
    state.game.board[1][1] == state.game.board[0][2] &&
    state.game.board[2][0]) {
      return state.game.board[2][0];
  }
  return undefined;
}