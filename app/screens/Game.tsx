import React, { Component } from 'react';
import {View, Text, TouchableHighlight, Image} from "react-native";
import {appStyles, appColors} from "../config/styles";
import {GameProps, GameMode} from "../config/types";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../store/reducers/appReducer';
import { move, replay, setGameId } from '../store/actions/gameActions';
import { connect } from 'react-redux'
import { Status, Mark, Point } from '../store/types/gameTypes';
import { StyleSheet} from 'react-native';
import * as bot from "../service/autoPlayBot";
import * as gameService from "./../service/gameService";
import { LinearGradient } from 'expo-linear-gradient';
import { MyAwesomeButton, ButtonTypes, SizeTypes } from '../component/MyAwesomeButtons';

const mapState = (state: RootState) => ({
  isFinished: state.gameReducer.game.status==Status.FINISHED,
  appUser: state.gameReducer.appUser,
  mode: state.gameReducer.mode,
  game: state.gameReducer.game,
  gameId: state.gameReducer.gameId,
  startedBy: state.gameReducer.game.startedBy,
  turn: state.gameReducer.game.turn,
  myMark: state.gameReducer.game.myMark,
  winner: state.gameReducer.game.winner,
  playerNameX: state.gameReducer.game.players.X?.displayName || state.gameReducer.game.players.X?.name,
  playerNameO: state.gameReducer.game.players.O?.displayName || state.gameReducer.game.players.O?.name,
  playerX: state.gameReducer.game.players.X,
  playerO: state.gameReducer.game.players.O,
  winCountX: state.gameReducer.game.winCount.X,
  winCountO: state.gameReducer.game.winCount.O,
  level: state.gameReducer.botLevel
})

const mapDispatch = {
  move,
  setGameId,
  replay
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & GameProps

function Game (props: Props) {

  const [count, setCount] = React.useState(0);

  React.useEffect(()=> {
    console.log("Component is re-rendering");
    return () => {
      console.log("Component is unmounting");
      if (props.gameId) {
        gameService.unsubscribe(props.gameId);
        props.setGameId(undefined);
      }
    }
  },[]);

  const playComputer = (props: Props) => {
    let point = bot.playComputer(props.game.board, props.level)
    if (point) {
      // console.log("Playing the computer move at [%d, %d]", point.row, point.col);
      props.move(point);
    }
  }

  const displayMsg = () => {
    let msg = "";
    if (props.isFinished) {
      if (props.winner) {
        if (props.winner == props.myMark) {
          msg = "Congratulations !!"
        } else {
          msg = "Sorry !!"
        }
      } else {
        msg = "Its a Draw"
      }
    } else {
      if (props.turn == props.myMark) {
        msg = "Your Turn"
      } else {
        msg = "Waiting..."
      }
    }
    return msg;
  }

  const handleSelected = (point: Point) => {
    if (props.mode == GameMode.NETWORK) {
      if (props.gameId && props.myMark && props.appUser) {
        gameService.moveByPlayer(props.gameId, 
          {
            mark: props.myMark, 
            player: props.appUser, 
            point: point
          }).then((r) => {
            console.log("All good", r);
          }).catch((e) => {
            console.log("Something went wrong with the move", e);
          });
      }
    } else {
      let nextCount = count;
      props.move(point);
      nextCount++;
      if (props.mode == GameMode.OFFLINE) {
        if (nextCount<9) {
          playComputer(props);
          nextCount++;
        }
      }
      setCount(nextCount);
    }
    // console.log("called handled with %d %d, count set to %d", point.row, point.col, nextCount);
  }

  const replayGame = () => {
    if (props.mode==GameMode.OFFLINE) {
      let startedBy = props.startedBy;
      props.replay();
      setCount(0);
        if (startedBy == Mark.X) {
        //Last time it was X who started the game, so this time, it is computer
        playComputer(props);
        setCount(1);
      }
    } else {
      //Network mode, submit replay request to server.
      if (props.gameId && props.appUser) {
        gameService.replayBoard(props.gameId, props.appUser);
      }
    }
  }

  const isDisabled = (point: Point) => {
    return props.isFinished || props.myMark != props.turn || (props.game.board[point.row][point.col]) ? true:false;
  }

  const currentMark = (point: Point) => {
    return props.game.board[point.row][point.col];
  }

  return (
    <View style={appStyles.container}>
      <LinearGradient style={appStyles.backgroundGradient} colors={appColors.gradient}>
        <View style={styles.headerContainer}>
          <View style={styles.playerContainer}>
            <Image source={require('./../assets/img/robot-1.png')} style={styles.imagePlayer}></Image>
            <Text style={styles.playerText}>{props.playerNameX}</Text>
            <X></X>
            <Text style={styles.playerText}>Won: {props.winCountX}</Text>
          </View>
          <View style={styles.playerContainer}>
            <Image source={require('./../assets/img/robot-1.png')} style={styles.imagePlayer}></Image>
            <Text style={styles.playerText}>{props.playerNameO}</Text>
            <O></O>
            <Text style={styles.playerText}>Won: {props.winCountO}</Text>
          </View>
        </View>
        <View style={styles.msgView}>
          <Text style={styles.msgText}>{displayMsg()}</Text>
        </View>
        <View style={{flex: 3, alignItems: 'center'}}>
          <View style={styles.board}>
            <View style={styles.boardRow}>
              <Square row={0} col={0} onSelect={handleSelected} mark={currentMark} disabled={isDisabled}></Square>
              <Square row={0} col={1} onSelect={handleSelected} mark={currentMark} disabled={isDisabled}></Square>
              <Square row={0} col={2} onSelect={handleSelected} mark={currentMark} disabled={isDisabled}></Square>
            </View>
            <View style={styles.boardRow}>
              <Square row={1} col={0} onSelect={handleSelected} mark={currentMark} disabled={isDisabled}></Square>
              <Square row={1} col={1} onSelect={handleSelected} mark={currentMark} disabled={isDisabled}></Square>
              <Square row={1} col={2} onSelect={handleSelected} mark={currentMark} disabled={isDisabled}></Square>
            </View>
            <View style={styles.boardRow}>
              <Square row={2} col={0} onSelect={handleSelected} mark={currentMark} disabled={isDisabled}></Square>
              <Square row={2} col={1} onSelect={handleSelected} mark={currentMark} disabled={isDisabled}></Square>
              <Square row={2} col={2} onSelect={handleSelected} mark={currentMark} disabled={isDisabled}></Square>
            </View>
          </View>
        </View>
        <View style={{flex:1, alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
          {props.isFinished ? 
          <MyAwesomeButton onPress={() => replayGame()} size={SizeTypes.medium} type={ButtonTypes.facebook}>
            REPLAY
          </MyAwesomeButton>
          : null}
        </View>
      </LinearGradient>
    </View>
  );
}

declare type SquareProp = {
  row: number,
  col: number,
  mark: (point: Point) => Mark | undefined,
  disabled: (point: Point) => boolean
  onSelect: (point: Point) => void
};

export function Square(squareProps: SquareProp) {
  let point:Point= {row: squareProps.row, col: squareProps.col};

  function selected() {
    squareProps.onSelect(point);
  }

  function disabled():boolean {
    return squareProps.disabled(point);
  }

  return (
    <TouchableHighlight style={styles.square} disabled={disabled()}
     onPress={selected}>
      <View style={{padding: 10, flex: 1}}>
        {squareProps.mark(point)==Mark.X ? <X /> : null}
        {squareProps.mark(point)==Mark.O ? <O /> : null}
      </View>
    </TouchableHighlight>
  );
};

function X() {
  return <View style={styles.cropped}>
          <Image
            style={styles.imageX}
            source={require("../assets/img/xo.png")} />
        </View>;
}

function O() {
  return <View style={styles.cropped}>
          <Image
            style={styles.imageO}
            source={require("../assets/img/xo.png")} />
        </View>;
}

const GameContainer = connect(mapState, mapDispatch)(Game)

export default GameContainer;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
    alignItems: 'stretch'
  },
  headerContainer: {
    flex: 2, 
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'center'
  },
  playerContainer: {
    backgroundColor: 'rgb(171,179,58)',
    alignItems: 'center',
    // justifyContent: 'space-around',
    // alignContent: 'space-around',
    padding: 10,
    margin: 10,
    // borderColor: 'transparent',
    // borderColor: 'rgb(140,26,17)',
    borderColor: 'rgb(142,84,108)',
    borderWidth: 2,
    borderRadius: 10
  },
  cropped: {
    overflow: 'hidden',
    flex: 1,
    aspectRatio: 1,
  },
  imageX: {
    height: "100%",
    width: "200%",
  },
  imageO: {
    height: "100%",
    width: "200%",
    marginLeft: "-100%",
  },
  msgView: {
    flex: 0.5,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center'
  },
  msgText: {
    fontWeight: "bold",
    fontSize: 20,
    color: appColors.defaultTextColor,
  },
  imagePlayer: {
    width: 60,
    height: 60,
    backgroundColor: 'pink',
    borderRadius: 30,
    resizeMode: 'contain',
  },
  playerText: {
    fontSize: 15
  },
  boardRow: {
    alignItems: 'stretch', 
    alignContent: 'center',
    flexDirection: 'row',
    flex: 1
  },
  board: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'stretch',
    // backgroundColor: 'rgb(78,50,30)',
    backgroundColor: 'rgb(171,159,58)',
    // backgroundColor: 'rgb(142,84,108)',
    // backgroundColor: 'rgb(140,26,17)',
    borderRadius: 15,
    aspectRatio: 1,
    flex:1,
    margin: 10,
    padding: 4
  },
  square: {
    // backgroundColor: 'rgb(244,195,83)',
    // backgroundColor: 'rgb(78,50,30)',
    // backgroundColor: 'rgb(105,48,160)',
    // backgroundColor: 'rgb(142,84,108)',
    // backgroundColor: 'rgb(171,179,48)',
    // backgroundColor: 'rgb(140,26,17)',
    // backgroundColor: 'rgb(243,165,139)',
    backgroundColor: 'rgb(142,84,108)',
    borderRadius: 15,
    margin: 4,
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
    aspectRatio: 1
  },
  buttonText: {
    fontSize: 20,
    color: 'white'
  }
});