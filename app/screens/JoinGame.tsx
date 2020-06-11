import React from 'react';
import {View, Text, TextInput, TouchableHighlight, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from "react-native";
import { RootState } from '../store/reducers/appReducer';
import { JoinGameProps, GameMode } from '../config/types';
import { connect } from 'react-redux';
import * as gameService from "./../service/gameService";

const mapState = (state: RootState) => ({
  game: state.gameReducer.game,
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

type Props = StateProps & DispatchProps & JoinGameProps

function JoinGame(props:Props) {
  const [value, onChangeText] = React.useState("");

  const joinGame = () => {
    if (props.route.params) {
      gameService.joinBoard(value, props.route.params.self);
      props.navigation.navigate("Game");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.outer}>
          <View style={styles.inner}>
            <Text style={styles.header}> Enter Game Code : </Text>
            <TextInput placeholder="Game Code" keyboardType='numeric' 
              maxLength={6} style={styles.textInput} 
              onChangeText={text => onChangeText(text)} />
            <View style={styles.btnContainer}>
              <TouchableHighlight onPress={joinGame} style={styles.buttonSimple}>
                <Text style={styles.buttonText}> Join Game </Text>
              </TouchableHighlight>
            </View>
          </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const JoinGameContainer = connect(mapState, mapDispatch)(JoinGame)

export default JoinGameContainer;

import { StyleSheet} from 'react-native';

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
    // backgroundColor: 'grey'
  },
  header: {
    fontSize: 24
  },
  textInput: {
    fontSize: 24,
    height: 40,
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
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: "bold"
  },
});

