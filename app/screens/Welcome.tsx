import * as React from 'react';
import {View, Text, Image, Button, TouchableHighlight, SafeAreaView, StyleSheet, StatusBar} from "react-native";
import {WelcomeProps} from "../config/types";
import { RootState } from '../store/reducers/appReducer';
import { appStyles } from '../config/styles';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {addAppUser, reset} from "../store/actions/gameActions";
import * as Application from "expo-application";
import { LinearGradient } from 'expo-linear-gradient';

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

  function loginFacebook(name:string, displayName?:string) {
    alert("Feature currently not supported");
  }

  function loginSuccess(name:string, displayName?:string) {
    props.addAppUser({name: name, displayName: displayName, self: true});
    props.navigation.navigate('Home');
  }

  React.useEffect(()=>{
    props.reset(); //Reset game
  })

  return (
    <View style={appStyles.container}>
      <LinearGradient style={{flex: 1}} colors={['rgba(241,225,153,1)', 'rgba(241,152,99,1)']}>
      <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 10}}>
        <Text>!! Tic Tac Toe !!</Text>
        <Image source={require('./../assets/img/Tic_tac_toe_welcome.png')} style={styles.welcomeImage}></Image>
      </View>
      <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'stretch'}}>
        <Icon.Button
          name="logo-facebook"
          backgroundColor="#3b5998"
          size={30}
          onPress={() => loginFacebook("AppDev")}>
        Login with facebook
        </Icon.Button>
        <Icon.Button
          name="ios-person"
          backgroundColor="black"
          size={30}
          onPress={() => loginSuccess(randomName(), "Guest")}>
        Play as Guest
        </Icon.Button>
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
  welcomeImage: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
})