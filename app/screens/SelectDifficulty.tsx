import React, { Component } from 'react';
import {View, Image, Text, TouchableHighlight} from "react-native";
import {appStyles} from "../config/styles";
import { RootState } from '../store/reducers/appReducer';
import { SelectDifficultyProps, DifficultyLevel, Player, GameMode } from '../config/types';
import { connect } from 'react-redux';
import { StyleSheet} from 'react-native';
import {addPlayer, setDifficultyLevel, offlineReset, setGameState} from "../store/actions/gameActions";
import { Mark, Status } from '../store/types/gameTypes';
import { LinearGradient } from 'expo-linear-gradient';

const mapState = (state: RootState) => ({
  appUser: state.gameReducer.appUser,
  game: state.gameReducer.game,
  turn: state.gameReducer.game.turn,
  winner: state.gameReducer.game.winner,
  level: state.gameReducer.botLevel
})

const mapDispatch = {
  addPlayer,
  setGameState,
  setDifficultyLevel,
  offlineReset
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & SelectDifficultyProps

class SelectDifficulty extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.selected = this.selected.bind(this);
    if (props.appUser) {
      props.addPlayer(props.appUser, Mark.X);
    } else {
      console.error("app User should be set before this.");
    }
  }

  selected(level: DifficultyLevel, props: Props) {
    if (props.level) {
      if (props.level != level) {
        props.offlineReset();
      }
    }
    props.setDifficultyLevel(level);
    let displayName = (level == DifficultyLevel.EASY) ? "Dumb" : (level == DifficultyLevel.MEDIUM) ? "Friendly" : "Sherlock";
    let computer:Player = {name: "Computer", displayName: displayName, self: false};
    props.addPlayer(computer, Mark.O);
    props.setGameState(Status.READY);
    props.navigation.navigate('Game');
  }

  render() {
    return (
      <View style={appStyles.container}>
      <LinearGradient style={{flex: 1}} colors={['rgba(241,225,153,1)', 'rgba(241,152,99,1)']}>
        <View style={{flex: 2, justifyContent: 'center'}}>
          <Text style={cStyles.header}>!! Select Level !!</Text>
        </View>
        <View style={{flex: 3, justifyContent: 'space-evenly', paddingBottom: 100}}>
          <View style={cStyles.viewRow}>
            <Image source={require('./../assets/img/robot-1.png')} style={cStyles.diSimple}></Image>
            <TouchableHighlight style={cStyles.buttonSimple} onPress={() => this.selected(DifficultyLevel.EASY, this.props)}>
              <Text style={cStyles.buttonText}>Dumb Bot</Text>
            </TouchableHighlight>
          </View>
          <View style={cStyles.viewRow}>
            <Image source={require('./../assets/img/robot-2.png')} style={cStyles.diMedium}></Image>
            <TouchableHighlight style={cStyles.buttonMedium} onPress={() => this.selected(DifficultyLevel.MEDIUM, this.props)}>
              <Text style={cStyles.buttonText}>Friendly Bot</Text>
            </TouchableHighlight>
          </View>
          <View style={cStyles.viewRow}>
            <Image source={require('./../assets/img/robot-3.png')} style={cStyles.diDifficult}></Image>
            <TouchableHighlight style={cStyles.buttonDifficult} onPress={() => this.selected(DifficultyLevel.HARD, this.props)}>
              <Text style={cStyles.buttonText}>Sherlock Bot</Text>
            </TouchableHighlight>
          </View>
        </View>
        </LinearGradient>
      </View>
    );
  }
}

const SelectDifficultyContainer = connect(mapState, mapDispatch)(SelectDifficulty);

export default SelectDifficultyContainer;

export const cStyles = StyleSheet.create({
  header: {fontSize: 30, fontWeight:'bold', color: 'red'},
  viewRow: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    alignContent: 'stretch'
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: "bold"
  },
  diSimple: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    backgroundColor: 'dodgerblue',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'dodgerblue'
  },
  buttonSimple: {
    alignItems: "center",
    backgroundColor: "dodgerblue",
    padding: 17,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "dodgerblue",
    position: 'relative',
    left: -20,
    width: '60%',
    zIndex: -1
  },
  diMedium: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    backgroundColor: 'orange',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'orange'
  },
  buttonMedium: {
    alignItems: "center",
    backgroundColor: "orange",
    padding: 17,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "orange",
    position: 'relative',
    left: -20,
    width: '60%',
    zIndex: -1
  },
  buttonDifficult: {
    alignItems: "center",
    backgroundColor: "red",
    padding: 17,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "red",
    position: 'relative',
    left: -20,
    width: '60%',
    zIndex: -1
  },
  diDifficult: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    backgroundColor: 'red',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'red'
  }
});