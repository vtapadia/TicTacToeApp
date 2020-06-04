import React from 'react';
import {View, Text, TouchableHighlight} from "react-native";
import {styles} from "../config/styles";
import {HomeProps} from "../config/types";

export default function Home({ route, navigation }: HomeProps) {
  return (
    <View style={styles.container}>
      <View style={{flex: 2}}></View>
      <View style={{flex: 2, justifyContent: 'space-around', alignItems: 'stretch'}}>
        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Game')}>
          <Text style={styles.buttonText}> Invite Friend </Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Game')}>
          <Text style={styles.buttonText}> Join Board </Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.buttonOther} 
          onPress={() => navigation.navigate('Game', {mode: 'offline'})}>
          <Text style={styles.buttonText}> Single Player </Text>
        </TouchableHighlight>
      </View>
      <View style={{flex: 2}}></View>
    </View>
  );
}

