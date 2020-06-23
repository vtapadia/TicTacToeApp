import React, { Component } from 'react';
import {View, Image, Text, TouchableHighlight} from "react-native";
import {appStyles, appColors} from "../config/styles";
import { RootState } from '../store/reducers/appReducer';
import { SelectDifficultyProps, DifficultyLevel, Player, GameMode } from '../config/types';
import { connect } from 'react-redux';
import { StyleSheet} from 'react-native';
import {addPlayer, setDifficultyLevel, offlineReset, setGameState} from "../store/actions/gameActions";
import { Mark, Status } from '../store/types/gameTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { MyAwesomeButton, ButtonTypes, SizeTypes } from '../component/MyAwesomeButtons';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  }

  selected(level: DifficultyLevel, props: Props) {
    props.offlineReset();
    if (props.appUser) {
      props.addPlayer(props.appUser, Mark.X);
    } else {
      console.error("app User should be set before this.");
    }
    props.setDifficultyLevel(level);
    let displayName, image;
    switch(level) {
      case DifficultyLevel.EASY:
        displayName = 'Easy';
        break;
      case DifficultyLevel.MEDIUM:
        displayName = 'Medium';
        break;
      case DifficultyLevel.HARD:
        displayName = 'Hard';
        break;
    }
    let computer:Player = {name: "Computer", displayName: displayName, self: false};
    props.addPlayer(computer, Mark.O);
    props.setGameState(Status.READY);
    props.navigation.navigate('Game');
  }

  render() {
    return (
      <View style={appStyles.container}>
        <LinearGradient style={appStyles.backgroundGradient} colors={appColors.gradient}>
          <View style={{flex: 0.5, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', alignContent: 'space-between'}}>
            <Icon.Button name='chevron-left' underlayColor='transparent' onPress={this.props.navigation.goBack} backgroundColor='transparent' size={40} style={{paddingLeft: 10}} color={appColors.defaultTextColor}></Icon.Button>
            {/* <Text style={cStyles.header}> Select Level </Text> */}
            <Icon.Button name='user-circle' underlayColor='transparent' onPress={() => this.props.navigation.navigate("Profile")} backgroundColor='transparent' size={40} color={appColors.defaultTextColor} style={{paddingRight: 10, alignSelf: 'flex-end'}}></Icon.Button>
          </View>
          <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 10}}>
            <Image source={require('./../assets/img/questions.png')} style={cStyles.topImage}></Image>
          </View>
          <View style={{flex: 3, justifyContent: 'space-evenly', alignItems: 'center'}}>
            <MyAwesomeButton onPress={() => this.selected(DifficultyLevel.EASY, this.props)} type={ButtonTypes.primary} size={SizeTypes.large}>
              Easy
            </MyAwesomeButton>
            <MyAwesomeButton onPress={() => this.selected(DifficultyLevel.MEDIUM, this.props)} type={ButtonTypes.primary} size={SizeTypes.large}>
              Medium
            </MyAwesomeButton>
            <MyAwesomeButton onPress={() => this.selected(DifficultyLevel.HARD, this.props)} type={ButtonTypes.secondary} size={SizeTypes.large}>
              Difficult
            </MyAwesomeButton>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const SelectDifficultyContainer = connect(mapState, mapDispatch)(SelectDifficulty);

export default SelectDifficultyContainer;

export const cStyles = StyleSheet.create({
  header: {
    fontSize: 24, 
    fontWeight:'bold', 
    color: appColors.defaultTextColor,
    alignSelf: 'center'
  },
  topImage: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
    paddingBottom: 10
  },
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