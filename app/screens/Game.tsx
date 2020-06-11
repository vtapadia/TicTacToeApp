import React, { Component } from 'react';
import {View, Text, TouchableHighlight, Image} from "react-native";
import {GameProps, GameMode} from "../config/types";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../store/reducers/appReducer';
import { move, replay } from '../store/actions/gameActions';
import { connect } from 'react-redux'
import { Status, Mark, Point } from '../store/types/gameTypes';
import { StyleSheet} from 'react-native';
import * as bot from "../service/autoPlayBot";

const mapState = (state: RootState) => ({
  isFinished: state.gameReducer.game.status==Status.FINISHED,
  mode: state.gameReducer.mode,
  game: state.gameReducer.game,
  turn: state.gameReducer.game.turn,
  winner: state.gameReducer.game.winner,
  level: state.gameReducer.botLevel
})

const mapDispatch = {
  move,
  replay
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & GameProps

declare type GameState = {
  count: number
}

class Game extends Component<Props, GameState> {
  constructor(props:Props) {
    super(props);
    this.state = {count: 0};
    this.handleSelected = this.handleSelected.bind(this);
    this.replayGame = this.replayGame.bind(this);
    this.playComputer = this.playComputer.bind(this);
  }

  playComputer(props: Props) {
    let point = bot.playComputer(props.game.board, props.level)
    if (point) {
      console.log("Playing the computer move at [%d, %d]", point.row, point.col);
      props.move(point);
    }
  }

  handleSelected(point: Point) {
    let nextCount = this.state.count;
    this.props.move(point);
    nextCount++;
    if (this.props.mode == GameMode.OFFLINE) {
      if (nextCount<9) {
        this.playComputer(this.props);
        nextCount++;
      }
    }
    this.setState({ count: nextCount});
    console.log("called handled with %d %d, count set to %d", point.row, point.col, nextCount);
  }

  replayGame(props: Props) {
    props.replay();
    this.setState({ count: 0});
    if (props.mode==GameMode.OFFLINE) {
      if (props.game.turn != props.game.myMark) {
        this.playComputer(props);
        this.setState({ count: 1});
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.playerContainer}>
            <Image source={require('./../assets/img/robot-1.png')} style={styles.imagePlayer}></Image>
            <Text style={styles.playerText}>{this.props.game.players.X?.name}</Text>
            <X></X>
            <Text style={styles.playerText}>Won: {this.props.game.winCount.X}</Text>
          </View>
          <View style={styles.playerContainer}>
            <Image source={require('./../assets/img/robot-1.png')} style={styles.imagePlayer}></Image>
            <Text style={styles.playerText}>{this.props.game.players.O?.name}</Text>
            <O></O>
            <Text style={styles.playerText}>Won: {this.props.game.winCount.O}</Text>
          </View>
          {/* <Text>{this.props.game.message}</Text> */}
        </View>
        <View style={{flex: 3, flexDirection: 'row'}}>
          <View style={{flex: 1}}></View>
          <View style={{flex: 3, alignItems: 'stretch'}}>
            <View style={styles.board}>
              <View style={styles.boardRow}>
                <Square row={0} col={0} props={this.props} onSelect={this.handleSelected}></Square>
                <Square row={0} col={1} props={this.props} onSelect={this.handleSelected}></Square>
                <Square row={0} col={2} props={this.props} onSelect={this.handleSelected}></Square>
              </View>
              <View style={styles.boardRow}>
                <Square row={1} col={0} props={this.props} onSelect={this.handleSelected}></Square>
                <Square row={1} col={1} props={this.props} onSelect={this.handleSelected}></Square>
                <Square row={1} col={2} props={this.props} onSelect={this.handleSelected}></Square>
              </View>
              <View style={styles.boardRow}>
                <Square row={2} col={0} props={this.props} onSelect={this.handleSelected}></Square>
                <Square row={2} col={1} props={this.props} onSelect={this.handleSelected}></Square>
                <Square row={2} col={2} props={this.props} onSelect={this.handleSelected}></Square>
              </View>
            </View>
          </View>
          <View style={{flex: 1}}></View>
        </View>
        <View style={{flex:1, alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
          {this.props.isFinished ? <Icon.Button
              name="replay"
              backgroundColor="#3b5998"
              size={30}
              onPress={() => this.replayGame(this.props)}>
            <Text style={styles.buttonText}> REPLAY </Text>
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
        {squareProps.props.game.board[squareProps.row][squareProps.col]==Mark.X ? <X /> : null}
        {squareProps.props.game.board[squareProps.row][squareProps.col]==Mark.O ? <O /> : null}
      </Text>
    </TouchableHighlight>
  );
};

function X() {
  return <Icon name="close" size={50} color="yellow"></Icon>;
}
function O() {
  return <Icon name="circle-outline" size={50} color="magenta"></Icon>;
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
    backgroundColor: 'skyblue',
    alignItems: 'center',
    // justifyContent: 'space-around',
    // alignContent: 'space-around',
    padding: 10,
    borderColor: 'royalblue',
    borderWidth: 2,
    borderRadius: 10
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
    flexDirection: 'row'
  },
  board: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'skyblue',
    borderRadius: 15,
    padding: 4
  },
  square: {
    backgroundColor: 'royalblue',
    borderRadius: 15,
    margin: 4,
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
    width: 100,
    height: 100
  },
  buttonText: {
    fontSize: 20,
    color: 'white'
  }
});