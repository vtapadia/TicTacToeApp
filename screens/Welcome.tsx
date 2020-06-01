import * as React from 'react';
import {View, Text, Image, Button, TouchableHighlight} from "react-native";
import {WelcomeProps} from "../config/types";
import { styles } from '../config/styles';

export default function Welcome({ route, navigation }: WelcomeProps) {
  return (
    <View style={styles.container}>
      <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-start'}}>
        <Text>Tic Tac Toe !!</Text>
        <Image source={require('./../assets/img/Tic_tac_toe_welcome.png')} style={styles.welcomeImage}></Image>
      </View>
      <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'stretch'}}>
        <TouchableHighlight style={styles.buttonFacebook} onPress={() => navigation.navigate('Home')}>
          <Text> Log in with Facebook </Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.buttonOther} onPress={() => navigation.navigate('Home')}>
          <Text> Play as a Guest </Text>
        </TouchableHighlight>
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
        <Text style={{paddingBottom: 15}}>@ Copyright 2020</Text>
      </View>
    </View>
  );
}
