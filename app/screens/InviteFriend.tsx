import React, { Component } from 'react';
import {View, Share, Text, TouchableHighlight, StyleSheet, ActivityIndicator} from "react-native";
import {appStyles} from "../config/styles";
import { RootState } from '../store/reducers/appReducer';
import { InviteFriendProps } from '../config/types';
import { setGameId, move, addPlayer, setGameState, replay} from '../store/actions/gameActions';
import { connect } from 'react-redux';
import { Status } from '../store/types/gameTypes';
import * as gameService from "./../service/gameService";
import { LinearGradient } from 'expo-linear-gradient';
import { MyAwesomeButton, ButtonTypes, SizeTypes } from '../component/MyAwesomeButtons';

const mapState = (state: RootState) => ({
  game: state.gameReducer.game,
  appUser: state.gameReducer.appUser,
  isReady: state.gameReducer.game.status == Status.READY,
  turn: state.gameReducer.game.turn,
  winner: state.gameReducer.game.winner
})

const mapDispatch = {
  setGameId,
  move,
  addPlayer,
  replay,
  setGameState
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & InviteFriendProps
type State = {
  gameId: string | undefined,
  progress: boolean
}

class InviteFriend extends Component<Props, State> {
  constructor(props:Props) {
    super(props);
    this.state = {gameId: undefined, progress: true};
  }

  componentDidMount() {
    if (this.props.appUser)
    gameService.createGame(this.props.appUser).then((gameId) => {
      this.props.setGameId(gameId);
      this.setState({gameId: gameId, progress: false});
      gameService.subscribe(gameId, this.props).then(() => {
        if (this.props.appUser) {
          gameService.joinBoard(gameId, this.props.appUser).then(m => {
            console.log("User joined with mark ", m);
          }).catch(e => {
            console.log("Failed to join the game ", e);
          });
        }
      }).catch(e => {
        console.log("Unable to subscribe");
      })
    }).catch(r=> {
      alert(r);
      this.setState({gameId: undefined, progress: true});
      this.props.navigation.navigate("Home");
    })
  }

  share = async () => {
    if (this.state.gameId) {
      let message = "Join me for a Game of Tic Tac Toe with Code " + this.state.gameId;
      const result = await Share.share({title:"Share Tic Tac Toe", message: message});
      if (result.action == Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared activity " + result.activityType);
        }
      } else if (result.action == Share.dismissedAction) {
        console.log("Sharing was dismissed");
      }
    }
  }

  gameReady = () => {
    this.props.navigation.navigate("Game");
  }

  render() {
    return (
      <View style={appStyles.container}>
        <LinearGradient style={{flex: 1}} colors={['rgba(241,225,153,1)', 'rgba(241,152,99,1)']}>
          <View style={iStyles.viewCode}>
            <Text style={iStyles.textCode}>Code: </Text>
            <Text style={iStyles.textCodeNumber}>{this.state.gameId}</Text>
          </View>
          <View style={iStyles.viewMessage}>
            <ActivityIndicator animating={this.state.progress} size="large" color="#0000ff" />
            <Text style={iStyles.textMessage}>Share this code with your friends and ask them to join</Text>
          </View>
          <View style={iStyles.viewShare}>
            {this.props.isReady ?
              <MyAwesomeButton onPress={this.gameReady} size={SizeTypes.large} type={ButtonTypes.primary}>
                Lets Play
              </MyAwesomeButton>
            : <MyAwesomeButton onPress={this.share} size={SizeTypes.large} type={ButtonTypes.secondary}>
                Share with Friends
              </MyAwesomeButton>
            }
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const InviteFriendContainer = connect(mapState, mapDispatch)(InviteFriend)

export default InviteFriendContainer;

export const iStyles = StyleSheet.create({
  viewCode: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  textCode: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textCodeNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewMessage: {
    flex: 1,
  },
  textMessage: {
    color: 'darkgrey',
    fontSize: 20,
    padding: 30
  },
  viewShare: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  buttonSimple: {
    alignItems: "center",
    backgroundColor: "dodgerblue",
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "dodgerblue",
    position: 'relative',
    width: '60%'
  },
  buttonReady: {
    alignItems: "center",
    backgroundColor: "green",
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "green",
    position: 'relative',
    width: '60%'
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: "bold"
  },
});