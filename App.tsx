import React from 'react';
import { StyleSheet} from 'react-native';
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from "./app/screens/Welcome";
import HomeContainer from "./app/screens/Home";
import GameContainer from "./app/screens/Game";
import InviteFriendContainer from "./app/screens/InviteFriend";
import {RootStackParamList} from "./app/config/types";
import appStore from './app/store/store';
import JoinGameContainer from './app/screens/JoinGame';
import SelectDifficultyContainer from './app/screens/SelectDifficulty';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={appStore}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false, headerStyle: {backgroundColor: 'rgba(241,225,153,1)'}}}>
          <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}}/>
          <Stack.Screen name="Home" component={HomeContainer} options={{headerShown: true}}/>
          <Stack.Screen name="InviteFriend" component={InviteFriendContainer}  options={{headerShown: true}}/>
          <Stack.Screen name="JoinGame" component={JoinGameContainer}  options={{headerShown: true}}/>
          <Stack.Screen name="SelectDifficulty" component={SelectDifficultyContainer}  options={{headerShown: true}}/>
          <Stack.Screen name="Game" component={GameContainer}  options={{headerShown: true, title: '! Tic Tac Toe !'}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

