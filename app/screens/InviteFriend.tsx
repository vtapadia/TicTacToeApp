import React, { Component } from 'react';
import {View, Share, Text, TouchableHighlight, StyleSheet} from "react-native";
import {styles} from "../config/styles";
import { RootState } from '../store/reducers/appReducer';
import { InviteFriendProps } from '../config/types';
import { connect } from 'react-redux';
import { GameState } from '../component/GameState';
import { Status } from '../store/types/gameTypes';

const mapState = (state: RootState) => ({
  game: state.gameReducer.game,
  isReady: state.gameReducer.game.status == Status.READY,
  turn: state.gameReducer.game.turn,
  winner: state.gameReducer.game.winner
})

const mapDispatch = {
  // move,
  // addPlayer,
  // reset
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & InviteFriendProps

class InviteFriend extends Component<Props> {
  constructor(props:Props) {
    super(props);
  }

  share = async () => {
    if (this.props.route.params) {
      let gameId = this.props.route.params.gameId;
      let message = "Please join me for a Game of Tic Tac Toe with Code " + gameId;
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
      <View style={styles.container}>
        <View style={iStyles.viewCode}>
          <Text style={iStyles.textCode}>Code: </Text>
          <Text style={iStyles.textCodeNumber}>{this.props.route.params?.gameId}</Text>
        </View>
        <View style={iStyles.viewMessage}>
          <Text style={iStyles.textMessage}>Share this code with your friends and ask them to join</Text>
        </View>
        <View style={iStyles.viewShare}>
          {this.props.isReady ?
            <TouchableHighlight onPress={this.share} style={iStyles.buttonSimple}>
              <Text style={iStyles.buttonText}> Share with Friends </Text>
            </TouchableHighlight> : 
            <TouchableHighlight onPress={this.gameReady} style={iStyles.buttonReady}>
              <Text style={iStyles.buttonText}> Lets Play </Text>
            </TouchableHighlight>            
          }
        </View>
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