import * as React from 'react';
import {View, Text, Image, Button, TouchableHighlight, SafeAreaView, StyleSheet, StatusBar} from "react-native";
import {WelcomeProps} from "../config/types";
import { RootState } from '../store/reducers/appReducer';
import { appStyles, appColors } from '../config/styles';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {addAppUser, reset} from "../store/actions/gameActions";
import * as Application from "expo-application";
import { LinearGradient } from 'expo-linear-gradient';
import AwesomeButton from "react-native-really-awesome-button";
import { MyAwesomeButton, ButtonTypes, SizeTypes } from '../component/MyAwesomeButtons';
import * as FileSystem from "expo-file-system";
import * as constants from "../config/constant";

const mapState = (state: RootState) => ({
  appUser: state.gameReducer.appUser
})

const mapDispatch = {
  reset,
  addAppUser
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & WelcomeProps

function Welcome(props: Props) {

  function randomName():string {
    let name = "Guest" + Math.floor(Math.random()*10000000);
    console.log("Player name assigned as %s", name);
    return name;
  }

  const loginFacebook = () => {
    alert("Feature currently not supported");
  }

  const loginGuest = async () => {
    let name = randomName();
    let displayName = "Guest";
    let result = await FileSystem.getInfoAsync(constants.imageFile);
    if (result.exists) {
      props.addAppUser({name: name, displayName: displayName, self: true, image: constants.imageFile});
    } else {
      props.addAppUser({name: name, displayName: displayName, self: true});
    }
    props.navigation.navigate('Home');
  }

  React.useEffect(()=>{
    props.reset(); //Reset game
  })

  return (
    <View style={appStyles.container}>
      <LinearGradient style={appStyles.backgroundGradient} colors={appColors.gradient}>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 10}}>
          <Text style={styles.header}>!! Tic Tac Toe !!</Text>
          <Image source={require('./../assets/img/Tic_tac_toe_welcome.png')} style={styles.welcomeImage}></Image>
        </View>
        <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
          <MyAwesomeButton onPress={loginFacebook} type={ButtonTypes.facebook} size={SizeTypes.large}>Login with Facebook</MyAwesomeButton>
          <MyAwesomeButton onPress={loginGuest} type={ButtonTypes.secondary} size={SizeTypes.large}>Play as Guest</MyAwesomeButton>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
          <Text>{Application.nativeBuildVersion}</Text>
          <Text style={{paddingBottom: 15}}>@ Copyright 2020</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const WelcomeContainer = connect(mapState, mapDispatch)(Welcome)

export default WelcomeContainer;

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.defaultTextColor,
  },
  welcomeImage: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  }
})