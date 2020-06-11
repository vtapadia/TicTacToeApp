import React from 'react';
import {View, Text, TouchableHighlight, ActivityIndicator} from "react-native";
import {styles} from "../config/styles";
import {HomeProps, GameMode, Player} from "../config/types";
import { setGameMode } from '../store/actions/gameActions';
import { connect } from 'react-redux'
import { RootState } from '../store/reducers/appReducer';
import * as gameService from "./../service/gameService";

const mapState = (state: RootState) => ({
  // isReady: state.gameReducer.game.status==Status.READY
  appUser: state.gameReducer.appUser
})

const mapDispatch = {
  setGameMode
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & HomeProps

function Home(props: Props) {
  
  const [progress, setProgress] = React.useState(false);

  function singlePlayer() {
    
    props.setGameMode(GameMode.OFFLINE);
    props.navigation.navigate('SelectDifficulty');
  }

  function inviteFriend() {
    if (props.appUser) {
      let player:Player;
      player = props.appUser;
      setProgress(true);
      gameService.createGame(player)
        .then((v) => {
          console.log("Game created with id:%s", v);
          setProgress(false);
          props.setGameMode(GameMode.NETWORK);
          props.navigation.navigate('InviteFriend', {self: player, gameId: v});
        }).catch((r) => {
          setProgress(false);
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
        <ActivityIndicator animating={progress} size="large" color="#0000ff" />
        <TouchableHighlight disabled={progress} style={styles.button} onPress={inviteFriend}>
          <Text style={styles.buttonText}> Invite Friend </Text>
        </TouchableHighlight>
        <TouchableHighlight disabled={progress} style={styles.button} onPress={joinGame}>
          <Text style={styles.buttonText}> Join Game </Text>
        </TouchableHighlight>
        <TouchableHighlight disabled={progress} style={styles.buttonOther} 
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
