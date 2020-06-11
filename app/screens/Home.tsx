import React from 'react';
import {View, Text, TouchableHighlight} from "react-native";
import {styles} from "../config/styles";
import {HomeProps, GameMode, Player} from "../config/types";
import { addPlayer, setGameMode } from '../store/actions/gameActions';
import { connect } from 'react-redux'
import { RootState } from '../store/reducers/appReducer';
import * as gameService from "./../service/gameService";
import { Mark } from '../store/types/gameTypes';

const mapState = (state: RootState) => ({
  // isReady: state.gameReducer.game.status==Status.READY
  appUser: state.gameReducer.appUser
})

const mapDispatch = {
  addPlayer,
  setGameMode
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & HomeProps

function Home(props: Props) {
  
  function singlePlayer() {
    let computer:Player = {name: "Computer", self: false};
    
    if (props.appUser) {
      // player = {name: props.route.params.playerName, self: true};
      props.addPlayer(props.appUser, Mark.X);
      props.addPlayer(computer, Mark.O);
      props.setGameMode(GameMode.OFFLINE);
      props.navigation.navigate('SelectDifficulty', {self: props.appUser});
    } else {
      throw new Error("Player Name missing");
    }
  }

  function inviteFriend() {
    if (props.route.params) {
      let player:Player;
      player = {name: props.route.params.playerName, self: true};
      gameService.createGame(player)
        .then((v) => {
          console.log("Game created with id:%s", v);
          props.setGameMode(GameMode.NETWORK);
          props.navigation.navigate('InviteFriend', {self: player, gameId: v});
        }).catch((r) => {
          console.error(r);
        });
    }
  }

  function joinGame() {
    if (props.route.params) {
      let player:Player;
      player = {name: props.route.params.playerName, self: true};
      props.setGameMode(GameMode.NETWORK);
      props.navigation.navigate('JoinGame', {self: player});
    }
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 2}}></View>
      <View style={{flex: 2, justifyContent: 'space-around', alignItems: 'stretch'}}>
        <TouchableHighlight style={styles.button} onPress={inviteFriend}>
          <Text style={styles.buttonText}> Invite Friend </Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={joinGame}>
          <Text style={styles.buttonText}> Join Game </Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.buttonOther} 
          onPress={singlePlayer}>
          <Text style={styles.buttonText}> Single Player </Text>
        </TouchableHighlight>
      </View>
      <View style={{flex: 2}}></View>
    </View>
  );
}


const HomeContainer = connect(mapState, mapDispatch)(Home)

export default HomeContainer
