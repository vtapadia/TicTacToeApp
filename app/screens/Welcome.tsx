import * as React from 'react';
import {View, Text, Image, Button, TouchableHighlight} from "react-native";
import {WelcomeProps} from "../config/types";
import { RootState } from '../store/reducers/appReducer';
import { styles } from '../config/styles';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {addAppUser, reset} from "../store/actions/gameActions";

const mapState = (state: RootState) => ({
  appUser: state.gameReducer.appUser
})

const mapDispatch = {
  // move,
  // addPlayer,
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

  function loginSuccess(name:string, displayName?:string) {
    props.reset();
    props.addAppUser({name: name, displayName: displayName, self: true});
    props.navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-start'}}>
        <Text>!! Tic Tac Toe !!</Text>
        <Image source={require('./../assets/img/Tic_tac_toe_welcome.png')} style={styles.welcomeImage}></Image>
      </View>
      <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'stretch'}}>
        <Icon.Button
          name="logo-facebook"
          backgroundColor="#3b5998"
          size={30}
          onPress={() => loginSuccess("AppDev")}>
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
        <Text style={{paddingBottom: 15}}>@ Copyright 2020</Text>
      </View>
    </View>
  );
}

const WelcomeContainer = connect(mapState, mapDispatch)(Welcome)

export default WelcomeContainer;
