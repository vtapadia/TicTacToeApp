import React from 'react';
import {View, Text, TextInput, TouchableHighlight, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert} from "react-native";
import { RootState } from '../store/reducers/appReducer';
import { JoinGameProps, GameMode } from '../config/types';
import { connect } from 'react-redux';
import {move, addPlayer, replay, setGameState, setGameId, unsetGameId} from "../store/actions/gameActions";
import * as gameService from "./../service/gameService";
import { StyleSheet} from 'react-native';
import { Status } from '../store/types/gameTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { appStyles, appColors } from '../config/styles';
import { MyAwesomeButton, ButtonTypes, SizeTypes } from '../component/MyAwesomeButtons';

const mapState = (state: RootState) => ({
  game: state.gameReducer.game,
  gameId: state.gameReducer.gameId,
  appUser: state.gameReducer.appUser,
  isReady: state.gameReducer.game.status==Status.READY,
  turn: state.gameReducer.game.turn,
  winner: state.gameReducer.game.winner
})

const mapDispatch = {
  move,
  addPlayer,
  setGameState,
  setGameId,
  unsetGameId,
  replay
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & JoinGameProps

function JoinGame(props:Props) {
  const [value, onChangeText] = React.useState("");
  const [inProgress, setInProgress] = React.useState(false);

  //Unsubscribe at the unload of this component.
  React.useEffect(() => {
    return () => {
      console.log("JoinGame Component unloading");
      if (props.gameId) {
        console.log("Unmounting of JoinGame triggering unsubscribe if game exists");
        props.unsetGameId();
        gameService.unsubscribe(props.gameId);
      }
    }
  },[]);

  const joinGame = () => {
    setInProgress(true);
    joinGameAsync();
  }

  const joinGameAsync = async () => {
    try {
      //Check if game is present.
      let gameResponse = await gameService.getGame(value);
      console.log("Game Response Received ", gameResponse);
      if (props.gameId) {
        //Un subscribe to any existing game.
        console.log("Unsubscribing from old game ", props.gameId);
        await gameService.unsubscribe(props.gameId);
      }
      //Subscribe to the game events.
      await gameService.subscribe(value, props);
      //Set gameId to state.
      props.setGameId(value);
      console.log("Game subscribed.");
      if (props.appUser) {
        let result = await gameService.joinBoard(value, props.appUser);
        console.log("User joined with %s ", result);
      }
    } catch (e) {
      console.log("Error: ", e);
      Alert.alert("Failure", "Game Join Failed. Check game code and try again.");
    } finally {
      setInProgress(false);
    }
  }

  const playGame = () => {
    props.navigation.navigate("Game");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={appStyles.container}>
      <LinearGradient style={appStyles.backgroundGradient} colors={appColors.gradient}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.outer}>
          <View style={styles.inner}>
            <Text style={styles.header}> Enter Game Code : </Text>
            <TextInput placeholder="Game Code" keyboardType='numeric' 
              maxLength={6} style={styles.textInput} 
              onChangeText={text => onChangeText(text)} />
            <View style={styles.btnContainer}>
              {props.isReady ? 
                <MyAwesomeButton onPress={playGame} size={SizeTypes.large} type={ButtonTypes.anchor}>
                  Lets Play
                </MyAwesomeButton>
              : <MyAwesomeButton disabled={inProgress} onPress={joinGame} size={SizeTypes.large} type={ButtonTypes.primary}>
                Join Game
                </MyAwesomeButton>
              }
              
            </View>
          </View>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const JoinGameContainer = connect(mapState, mapDispatch)(JoinGame)

export default JoinGameContainer;


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  outer: {
    flex: 1,
    borderWidth: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  header: {
    fontSize: 24
  },
  textInput: {
    fontSize: 24,
    height: 40,
    width: 100,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20
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

