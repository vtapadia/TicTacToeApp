import React, { Component } from 'react';
import {View, Text, TouchableHighlight} from "react-native";
import {styles} from "../config/styles";
import {GameProps, GameMode} from "../config/types";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../store/reducers/appReducer';
import { move, addPlayer, reset } from '../store/actions/gameActions';
import { connect } from 'react-redux'
import { Status, Mark, Point } from '../store/types/gameTypes';

const mapState = (state: RootState) => ({
  isFinished: state.gameReducer.game.status==Status.FINISHED,
  game: state.gameReducer.game,
  turn: state.gameReducer.game.turn,
  winner: state.gameReducer.game.winner
})

const mapDispatch = {
  move,
  addPlayer,
  reset
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & GameProps

declare type BoardProp = {
  props: Props
}
declare type BoardState = {
  count: number
}

class Board extends Component<BoardProp, BoardState> {
  constructor(props:BoardProp) {
    super(props);
    this.state = {count: 0};
    this.handleSelected = this.handleSelected.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.playComputer = this.playComputer.bind(this);
  }

  playComputer(props: Props) {
    //Find a random number between 0 and 8
    let random = Math.floor(Math.random() * 9);
    let row:number = Math.floor(random/3);
    let col:number = random%3;
    if (props.game.board[row][col]) {
      this.playComputer(props);
    } else {
      console.log("Playing the computer move at [%d, %d]", row, col);
      props.move({row:row, col:col});
    }
  }

  handleSelected(point: Point) {
    let nextCount = this.state.count;
    this.props.props.move(point);
    nextCount++;
    if (this.props.props.route.params?.mode == GameMode.OFFLINE) {
      if (nextCount<9) {
        this.playComputer(this.props.props);
        nextCount++;
      }
    }
    this.setState({ count: nextCount});
    console.log("called handled with %d %d, count set to %d", point.row, point.col, nextCount);
  }

  resetGame(props: Props) {
    let playerO = props.game.players.O;
    let playerX = props.game.players.X;
    props.reset();
    this.setState({ count: 0});
    if (playerO) {props.addPlayer(playerO)};
    if (playerX) {props.addPlayer(playerX)};
    if (props.route.params?.mode==GameMode.OFFLINE) {
      if (props.game.turn != props.game.myMark) {
        this.playComputer(props);
        this.setState({ count: 1});
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text>{this.props.props.game.message}</Text>
        </View>
        <View style={{flex: 3, flexDirection: 'row'}}>
          <View style={{flex: 1}}></View>
          <View style={{flex: 3, alignItems: 'stretch'}}>
            <View style={styles.board}>
              <View style={styles.boardRow}>
                <Square row={0} col={0} props={this.props.props} onSelect={this.handleSelected}></Square>
                <Square row={0} col={1} props={this.props.props} onSelect={this.handleSelected}></Square>
                <Square row={0} col={2} props={this.props.props} onSelect={this.handleSelected}></Square>
              </View>
              <View style={styles.boardRow}>
                <Square row={1} col={0} props={this.props.props} onSelect={this.handleSelected}></Square>
                <Square row={1} col={1} props={this.props.props} onSelect={this.handleSelected}></Square>
                <Square row={1} col={2} props={this.props.props} onSelect={this.handleSelected}></Square>
              </View>
              <View style={styles.boardRow}>
                <Square row={2} col={0} props={this.props.props} onSelect={this.handleSelected}></Square>
                <Square row={2} col={1} props={this.props.props} onSelect={this.handleSelected}></Square>
                <Square row={2} col={2} props={this.props.props} onSelect={this.handleSelected}></Square>
              </View>
            </View>
          </View>
          <View style={{flex: 1}}></View>
        </View>
        <View style={{flex: 1}}>
          {this.props.props.isFinished ? <Icon.Button
              name="replay"
              backgroundColor="#3b5998"
              size={30}
              onPress={() => this.resetGame(this.props.props)}>
            <Text>RESET</Text>
          </Icon.Button> : null}
        </View>
      </View>
    );
  };
}

declare type SquareProp = {
  row: number,
  col: number,
  props: Props,
  onSelect: (point: Point) => void
};

export function Square(squareProps: SquareProp) {

  function selected() {
    let point:Point= {row: squareProps.row, col: squareProps.col};
    squareProps.onSelect(point);
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

function Game(props: Props) {
  return (
    <View style={styles.container}>
      <Board props={props}></Board>
    </View>
  );
}

const GameContainer = connect(mapState, mapDispatch)(Game)

export default GameContainer;
