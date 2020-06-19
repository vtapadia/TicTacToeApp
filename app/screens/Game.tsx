import React, { Component } from 'react';
import {View, Text, TouchableHighlight, Image} from "react-native";
import {GameProps, GameMode} from "../config/types";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../store/reducers/appReducer';
import { move, replay, setGameId } from '../store/actions/gameActions';
import { connect } from 'react-redux'
import { Status, Mark, Point } from '../store/types/gameTypes';
import { StyleSheet} from 'react-native';
import * as bot from "../service/autoPlayBot";
import * as gameService from "./../service/gameService";

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

declare type GameState = {
  count: number
}

class Game extends Component<Props, GameState> {
  constructor(props:Props) {
    super(props);
    // console.log("Game state at start", props.game);
    this.state = {count: 0};
    this.handleSelected = this.handleSelected.bind(this);
    this.replayGame = this.replayGame.bind(this);
    this.playComputer = this.playComputer.bind(this);
  }

  componentWillUnmount() {
    console.log("Component is unmounting");
    if (this.props.gameId) {
      gameService.unsubscribe(this.props.gameId);
      this.props.setGameId(undefined);
    }
  }

  playComputer(props: Props) {
    let point = bot.playComputer(props.game.board, props.level)
    if (point) {
      // console.log("Playing the computer move at [%d, %d]", point.row, point.col);
      props.move(point);
    }
  }

  handleSelected(props: Props, point: Point) {
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
      let nextCount = this.state.count;
      props.move(point);
      nextCount++;
      if (props.mode == GameMode.OFFLINE) {
        if (nextCount<9) {
          this.playComputer(props);
          nextCount++;
        }
      }
      this.setState({ count: nextCount});
    }
    // console.log("called handled with %d %d, count set to %d", point.row, point.col, nextCount);
  }

  replayGame(props: Props) {
    if (props.mode==GameMode.OFFLINE) {
      let startedBy = props.startedBy;
      props.replay();
      this.setState({ count: 0});
        if (startedBy == Mark.X) {
        //Last time it was X who started the game, so this time, it is computer
        this.playComputer(props);
        this.setState({ count: 1});
      }
    } else {
      //Network mode, submit replay request to server.
      if (props.gameId && props.appUser) {
        gameService.replayBoard(props.gameId, props.appUser);
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.playerContainer}>
            <Image source={require('./../assets/img/robot-1.png')} style={styles.imagePlayer}></Image>
            <Text style={styles.playerText}>{this.props.playerNameX}</Text>
            <X></X>
            <Text style={styles.playerText}>Won: {this.props.winCountX}</Text>
          </View>
          <View style={styles.playerContainer}>
            <Image source={require('./../assets/img/robot-1.png')} style={styles.imagePlayer}></Image>
            <Text style={styles.playerText}>{this.props.playerNameO}</Text>
            <O></O>
            <Text style={styles.playerText}>Won: {this.props.winCountO}</Text>
          </View>
          {/* <Text>{this.props.game.message}</Text> */}
        </View>
        <View style={{flex: 3, alignItems: 'center'}}>
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
  onSelect: (props: Props, point: Point) => void
};

export function Square(squareProps: SquareProp) {

  function selected() {
    let point:Point= {row: squareProps.row, col: squareProps.col};
    squareProps.onSelect(squareProps.props, point);
  }

  function disabled() {
    return squareProps.props.isFinished || squareProps.props.myMark != squareProps.props.turn || (squareProps.props.game.board[squareProps.row][squareProps.col])?true:false;
  }

  return (
    <TouchableHighlight style={styles.square} disabled={disabled()}
     onPress={selected}>
      <View style={{padding: 10, flex: 1}}>
        {squareProps.props.game.board[squareProps.row][squareProps.col]==Mark.X ? <X /> : null}
        {squareProps.props.game.board[squareProps.row][squareProps.col]==Mark.O ? <O /> : null}
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
    backgroundColor: 'skyblue',
    alignItems: 'center',
    // justifyContent: 'space-around',
    // alignContent: 'space-around',
    padding: 10,
    margin: 10,
    borderColor: 'royalblue',
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
    backgroundColor: 'skyblue',
    borderRadius: 15,
    aspectRatio: 1,
    flex:1,
    margin: 10,
    padding: 4
  },
  square: {
    backgroundColor: 'royalblue',
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