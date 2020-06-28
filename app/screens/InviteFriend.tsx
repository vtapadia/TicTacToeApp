import React, { Component } from 'react';
import {View, Share, Text, TouchableHighlight, StyleSheet, ActivityIndicator} from "react-native";
import {appStyles, appColors} from "../config/styles";
import { RootState } from '../store/reducers/appReducer';
import { InviteFriendProps } from '../config/types';
import { setGameId, unsetGameId, move, addPlayer, setGameState, replay} from '../store/actions/gameActions';
import { connect } from 'react-redux';
import { Status } from '../store/types/gameTypes';
import * as gameService from "./../service/gameService";
import { LinearGradient } from 'expo-linear-gradient';
import { MyAwesomeButton, ButtonTypes, SizeTypes } from '../component/MyAwesomeButtons';

const mapState = (state: RootState) => ({
  game: state.gameReducer.game,
  gameId: state.gameReducer.gameId,
  appUser: state.gameReducer.appUser,
  isReady: state.gameReducer.game.status == Status.READY,
  turn: state.gameReducer.game.turn,
  winner: state.gameReducer.game.winner
})

const mapDispatch = {
  setGameId,
  unsetGameId,
  move,
  addPlayer,
  replay,
  setGameState
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & InviteFriendProps

function InviteFriend(props:Props) {

  React.useEffect(() => {
    if (props.appUser) {
      gameService.createGame(props.appUser).then((gameId) => {
        props.setGameId(gameId);
      })
    }
    return () => {
      props.unsetGameId();
    }
  }, []);

  React.useEffect(() => {
    if (props.gameId) {
      gameService.subscribe(props.gameId, props).then(() => {
        if (props.appUser && props.gameId) {
           gameService.joinBoard(props.gameId, props.appUser).then(m => {
            console.log("User joined with mark ", m);
          }).catch(e => {
            console.log("Failed to join the game ", e);
          });
        }
      }).catch(e => {
        console.log("Unable to subscribe");
      })
    }
    return () => {
      if (props.gameId) {
        gameService.unsubscribe(props.gameId);
      }
    }
  },[props.gameId]);

  const share = async () => {
    if (props.gameId) {
      let message = "Join me for a Game of Tic Tac Toe with Code " + props.gameId;
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

  const gameReady = () => {
    props.navigation.navigate("Game");
  }

  return (
    <View style={appStyles.container}>
      <LinearGradient style={appStyles.backgroundGradient} colors={appColors.gradient}>
        <View style={iStyles.viewCode}>
          <Text style={iStyles.textCode}>Code: </Text>
          <Text style={iStyles.textCodeNumber}>{props.gameId}</Text>
        </View>
        <View style={iStyles.viewMessage}>
          <ActivityIndicator animating={!props.gameId} size="large" color="#0000ff" />
          <Text style={iStyles.textMessage}>
            Share this code with your friends and wait for them to join.
          </Text>
        </View>
        <View style={iStyles.viewShare}>
          {props.isReady ?
            <MyAwesomeButton onPress={gameReady} size={SizeTypes.large} type={ButtonTypes.anchor}>
              Lets Play
            </MyAwesomeButton>
          : <MyAwesomeButton onPress={share} size={SizeTypes.large} type={ButtonTypes.primary}>
              Share with Friends
            </MyAwesomeButton>
          }
        </View>
      </LinearGradient>
    </View>
  );
}

const InviteFriendContainer = connect(mapState, mapDispatch)(InviteFriend)

export default InviteFriendContainer;

export const iStyles = StyleSheet.create({
  viewCode: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.defaultTextColor
  },
  textCodeNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.defaultTextColor
  },
  viewMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textMessage: {
    color: appColors.defaultTextColor,
    fontSize: 20,
    padding: 30,
    textAlign: "center"
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