import * as React from 'react';
import {View, Text, Image, Button, TouchableHighlight} from "react-native";
import {WelcomeProps} from "../config/types";
import { styles } from '../config/styles';
import Icon from 'react-native-vector-icons/Ionicons';


export default function Welcome({ route, navigation }: WelcomeProps) {

  function randomName():string {
    let name = "Guest" + Math.floor(Math.random()*10000000);
    console.log("Plyer name assigned as %s", name);
    return name;
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
          onPress={()=>navigation.navigate('Home', {playerName: "Varesh"})}>
        Login with facebook
        </Icon.Button>
        <Icon.Button
          name="ios-person"
          backgroundColor="black"
          size={30}
          onPress={()=>navigation.navigate('Home', {playerName: randomName()})}>
        Play as Guest
        </Icon.Button>
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
        <Text style={{paddingBottom: 15}}>@ Copyright 2020</Text>
      </View>
    </View>
  );
}
