import React, { Component } from 'react';
import {View, Image, Text, TouchableHighlight} from "react-native";
import {styles} from "../config/styles";
import { RootState } from '../store/reducers/appReducer';
import { SelectDifficultyProps, DifficultyLevel, Player, GameMode } from '../config/types';
import { connect } from 'react-redux';
import { StyleSheet} from 'react-native';
import {addPlayer, setDifficultyLevel} from "../store/actions/gameActions";
import { Mark } from '../store/types/gameTypes';

const mapState = (state: RootState) => ({
  game: state.gameReducer.game,
  turn: state.gameReducer.game.turn,
  winner: state.gameReducer.game.winner
})

const mapDispatch = {
  addPlayer,
  setDifficultyLevel
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & SelectDifficultyProps
declare type ComponentProp = {
  props: Props
}

class SelectDifficulty extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.selected = this.selected.bind(this);
  }

  selected(level: DifficultyLevel, props: Props) {
    props.setDifficultyLevel(level);
    if (props.route.params) {
      let computer:Player = {name: "Computer", self: false};
      props.addPlayer(props.route.params.self, Mark.X);
      props.addPlayer(computer, Mark.O);
    } else {
      throw new Error("Player Name missing");
    }
    switch(level) {
      case DifficultyLevel.EASY:
        props.navigation.navigate('Game', {mode: GameMode.OFFLINE, self: props.route.params.self});
        break;
      case DifficultyLevel.MEDIUM:
        alert("Seems, your friendly bot is not charged");
        break;
      case DifficultyLevel.HARD:
        alert("Sherlock is busy with a case right now");
        break;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 2, justifyContent: 'center'}}>
          <Text style={cStyles.header}>Select Difficulty !!</Text>
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