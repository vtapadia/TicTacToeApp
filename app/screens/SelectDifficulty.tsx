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
import { Avatar } from 'react-native-elements';
import { Asset } from 'expo-asset';

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

function SelectDifficulty(props: Props) {

  const selected = (level: DifficultyLevel) => {
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
        image = Asset.fromModule(require('./../assets/img/robot-1.png')).uri
        break;
      case DifficultyLevel.MEDIUM:
        displayName = 'Medium';
        image = Asset.fromModule(require('./../assets/img/robot-2.png')).uri
        break;
      case DifficultyLevel.HARD:
        displayName = 'Hard';
        image = Asset.fromModule(require('./../assets/img/robot-3.png')).uri
        break;
    }
    let computer:Player = {name: "Computer", displayName: displayName, self: false, image: image};
    props.addPlayer(computer, Mark.O);
    props.setGameState(Status.READY);
    props.navigation.navigate('Game');
  }

  return (
    <View style={appStyles.container}>
      <LinearGradient style={appStyles.backgroundGradient} colors={appColors.gradient}>
        <View style={styles.header}>
          <View style={styles.headerProfile}>
            {props.appUser?.image ? 
            <Avatar size="medium" rounded 
                source={{ uri: props.appUser?.image }}
                onPress={() => props.navigation.navigate("Profile")}
                activeOpacity={0.7}
                containerStyle={styles.headerAvtar}
              /> : 
              <Avatar size="medium" rounded 
                icon={{name: 'user', type: 'font-awesome'}} 
                onPress={() => props.navigation.navigate("Profile")}
                activeOpacity={0.7}
                containerStyle={styles.headerAvtar}
              />
              }
          </View>
          {props.navigation.canGoBack() && <Icon.Button name='chevron-left' underlayColor='transparent' onPress={props.navigation.goBack} backgroundColor='transparent' size={38} style={styles.headerBack} color={appColors.defaultTextColor}></Icon.Button>}
        </View>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 10}}>
          <Image source={require('./../assets/img/questions.png')} style={cStyles.topImage}></Image>
        </View>
        <View style={{flex: 3, justifyContent: 'space-evenly', alignItems: 'center'}}>
          <MyAwesomeButton onPress={() => selected(DifficultyLevel.EASY)} type={ButtonTypes.primary} size={SizeTypes.large}>
            Easy
          </MyAwesomeButton>
          <MyAwesomeButton onPress={() => selected(DifficultyLevel.MEDIUM)} type={ButtonTypes.primary} size={SizeTypes.large}>
            Medium
          </MyAwesomeButton>
          <MyAwesomeButton onPress={() => selected(DifficultyLevel.HARD)} type={ButtonTypes.primary} size={SizeTypes.large}>
            Difficult
          </MyAwesomeButton>
        </View>
      </LinearGradient>
    </View>
  );
}

const SelectDifficultyContainer = connect(mapState, mapDispatch)(SelectDifficulty);

export default SelectDifficultyContainer;

export const styles = StyleSheet.create({
  header: {
    flex: 0.5, 
    flexDirection: 'row-reverse', 
    alignItems: 'flex-start', 
    justifyContent: 'space-between', 
    // alignContent: 'space-between', 
    // backgroundColor: 'red'
  },
  headerBack: {
    // flex: 1,
    paddingLeft: 10, 
    alignSelf: 'flex-end',
    // backgroundColor: 'green'
  },
  headerProfile: {
    flex: 1,
    paddingRight: 10, 
    alignSelf: 'flex-start', 
    // backgroundColor: 'green'
  },
  headerAvtar: {
    alignSelf: 'flex-end', 
    backgroundColor: appColors.defaultTextColor
  },
});

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