import React from 'react';
import {View, Text, TouchableHighlight, ActivityIndicator, StyleSheet} from "react-native";
import {appStyles} from "../config/styles";
import {HomeProps, GameMode, Player} from "../config/types";
import { setGameMode, setGameId, reset } from '../store/actions/gameActions';
import { connect } from 'react-redux'
import { RootState } from '../store/reducers/appReducer';
import * as gameService from "./../service/gameService";
import { LinearGradient } from 'expo-linear-gradient';

const mapState = (state: RootState) => ({
  // isReady: state.gameReducer.game.status==Status.READY
  appUser: state.gameReducer.appUser,
  gameId: state.gameReducer.gameId
})

const mapDispatch = {
  setGameMode,
  setGameId,
  reset
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & HomeProps

function Home(props: Props) {
  
  const [progress, setProgress] = React.useState(false);
  
  function unsubscribe() {
    if(props.gameId) {
      gameService.unsubscribe(props.gameId).then(() => {
        console.log("Unsubscription done successfully");
        props.setGameId(undefined);
      }).catch((e) => {
        console.log("Failed unsubscribing, Error ", e);
      })
    }
    props.reset();
  }

  function singlePlayer() {
    unsubscribe();
    props.setGameMode(GameMode.OFFLINE);
    props.navigation.navigate('SelectDifficulty');
  }

  function inviteFriend() {
    unsubscribe();
    props.setGameMode(GameMode.NETWORK);
    props.navigation.navigate('InviteFriend');
  }

  function joinGame() {
    unsubscribe();
    props.setGameMode(GameMode.NETWORK);
    props.navigation.navigate('JoinGame');
  }

  return (
    <View style={appStyles.container}>
      <LinearGradient style={{flex: 1}} colors={['rgba(241,225,153,1)', 'rgba(241,152,99,1)']}>
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
      </LinearGradient>
    </View>
  );
}


const HomeContainer = connect(mapState, mapDispatch)(Home)

export default HomeContainer

export const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderWidth: 1,
    borderRadius: 10
  },
  buttonOther: {
    alignItems: "center",
    backgroundColor: "lightgrey",
    padding: 15,
    borderWidth: 1,
    borderRadius: 10
  },
  buttonText: {
    fontSize: 20
  },
});
