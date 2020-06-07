import React, { useState } from 'react';
import {View, Text, TouchableHighlight} from "react-native";
import {styles} from "../config/styles";
import {GameProps, GameMode} from "../config/types";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { GameState } from '../component/GameState';
import { RootState } from '../store/reducers/appReducer';
import { move, addPlayer, reset } from '../store/actions/gameActions';
import { connect } from 'react-redux'
import { Status, Mark } from '../store/types/gameTypes';

const mapState = (state: RootState) => ({
  isFinished: state.gameReducer.game.status==Status.FINISHED,
  game: state.gameReducer.game,
  turn: state.gameReducer.game.turn
})

const mapDispatch = {
  move,
  addPlayer,
  reset
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & GameProps

function Game(props: Props) {
  // const gameState = new GameState(props.route.params?.mode);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Text>{props.game.message}</Text>
      </View>
      <View style={{flex: 3, flexDirection: 'row'}}>
        <View style={{flex: 1}}></View>
        <View style={{flex: 3, alignItems: 'stretch'}}>
          <Board props={props}></Board>
        </View>
        <View style={{flex: 1}}></View>
      </View>
      <View style={{flex: 1}}>
        {props.isFinished ? <Icon.Button
            name="replay"
            backgroundColor="#3b5998"
            size={30}
            onPress={() => resetGame(props)}>
          <Text>RESET</Text>
        </Icon.Button> : null}
      </View>
    </View>
  );
}

const GameContainer = connect(mapState, mapDispatch)(Game)

export default GameContainer

declare type SquareProp = {
  row: number,
  col: number,
  props: Props
};

function resetGame(props: Props) {
  let playerO = props.game.players.O;
  let playerX = props.game.players.X;
  props.reset();
  if (playerO) {props.addPlayer(playerO)};
  if (playerX) {props.addPlayer(playerX)};
  if (props.route.params?.mode==GameMode.OFFLINE) {
    if (props.game.turn != props.game.myMark) {
      playComputer(props);
    }
  }
}

function playComputer(props: Props) {
  //Find a random number between 0 and 8
  let random = Math.floor(Math.random() * 9);
  let row:number = Math.floor(random/3);
  let col:number = random%3;
  if (props.game.board[row][col]) {
    playComputer(props);
  } else {
    console.log("Playing the computer move at [%d, %d]", row, col);
    props.move(row, col);
  }
}

export function Square(squareProps: SquareProp) {

  function selected() {
    if (squareProps.props.route.params) {
      squareProps.props.move(squareProps.row, squareProps.col);
      if (squareProps.props.route.params.mode == GameMode.OFFLINE) {
        //TODO: Nice if we can add delay.
        if (!squareProps.props.isFinished) {
          playComputer(squareProps.props);
        }
      }
    }
  }

  return (
    <TouchableHighlight style={styles.square} disabled={squareProps.props.isFinished || (squareProps.props.game.board[squareProps.row][squareProps.col])?true:false}
     onPress={selected}>
      <Text style={{textAlign: 'center'}}>
        {squareProps.props.game.board[squareProps.row][squareProps.col]==Mark.X ? <Icon name="close" size={50} ></Icon> : null}
        {squareProps.props.game.board[squareProps.row][squareProps.col]==Mark.O ? <Icon name="circle-outline" size={40}></Icon> : null}
      </Text>
    </TouchableHighlight>
  );
};

declare type BoardProp = {
  props: Props
};

export function Board(boardProps: BoardProp) {
  return (
    <View style={styles.board}>
      <View style={styles.boardRow}>
        <Square row={0} col={0} props={boardProps.props}></Square>
        <Square row={0} col={1} props={boardProps.props}></Square>
        <Square row={0} col={2} props={boardProps.props}></Square>
      </View>
      <View style={styles.boardRow}>
        <Square row={1} col={0} props={boardProps.props}></Square>
        <Square row={1} col={1} props={boardProps.props}></Square>
        <Square row={1} col={2} props={boardProps.props}></Square>
      </View>
      <View style={styles.boardRow}>
        <Square row={2} col={0} props={boardProps.props}></Square>
        <Square row={2} col={1} props={boardProps.props}></Square>
        <Square row={2} col={2} props={boardProps.props}></Square>
      </View>
    </View>
  );
}