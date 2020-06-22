import React from 'react';
import {View, Text, TouchableHighlight, ActivityIndicator, StyleSheet, Image} from "react-native";
import {appStyles, appColors} from "../config/styles";
import {HomeProps, GameMode, Player} from "../config/types";
import { setGameMode, setGameId, reset } from '../store/actions/gameActions';
import { connect } from 'react-redux'
import { RootState } from '../store/reducers/appReducer';
import * as gameService from "./../service/gameService";
import { LinearGradient } from 'expo-linear-gradient';
import { MyAwesomeButton, ButtonTypes, SizeTypes } from '../component/MyAwesomeButtons';
import NetInfo from "@react-native-community/netinfo";
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const [connected, setConnected] = React.useState(false);

  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      setConnected(true);
    }
  }).catch(e=>{
    console.log("Unable to get network connection details.");
  })

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
      <LinearGradient style={appStyles.backgroundGradient} colors={appColors.gradient}>
        <View style={{flex: 0.5, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', alignContent: 'space-between'}}>
          <Icon.Button name='chevron-left' underlayColor='transparent' onPress={props.navigation.goBack} backgroundColor='transparent' size={40} style={{paddingLeft: 10}} color={appColors.defaultTextColor}></Icon.Button>
          <Icon.Button name='user-circle' underlayColor='transparent' onPress={() => props.navigation.navigate("Profile")} backgroundColor='transparent' size={40} color={appColors.defaultTextColor} style={{paddingRight: 10, alignSelf: 'flex-end'}}></Icon.Button>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image source={require('./../assets/img/tic-tac-toe.png')} style={styles.topImage}></Image>
        </View>
        <View style={{flex: 2, justifyContent: 'space-evenly', alignItems: 'center'}}>
          <ActivityIndicator animating={progress} size="large" color="#0000ff" />
          <MyAwesomeButton disabled={!connected || progress} onPress={inviteFriend} type={ButtonTypes.primary} size={SizeTypes.large}>
            Invite Friend
          </MyAwesomeButton>
          <MyAwesomeButton disabled={!connected || progress} onPress={joinGame} type={ButtonTypes.primary} size={SizeTypes.large}>
            Join Game
          </MyAwesomeButton>
          <MyAwesomeButton disabled={progress} onPress={singlePlayer} type={ButtonTypes.secondary} size={SizeTypes.large}>
            Single Player
          </MyAwesomeButton>
        </View>
        {/* <View style={{flex: 1}}></View> */}
      </LinearGradient>
    </View>
  );
}


const HomeContainer = connect(mapState, mapDispatch)(Home)

export default HomeContainer

export const styles = StyleSheet.create({
  topImage: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
    paddingBottom: 10
  },
});
