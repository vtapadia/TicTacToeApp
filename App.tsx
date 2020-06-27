import React from 'react';
import { StyleSheet} from 'react-native';
import { AppLoading } from 'expo';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from "./app/screens/Welcome";
import HomeContainer from "./app/screens/Home";
import GameContainer from "./app/screens/Game";
import InviteFriendContainer from "./app/screens/InviteFriend";
import {RootStackParamList, Player} from "./app/config/types";
import appStore from './app/store/store';
import JoinGameContainer from './app/screens/JoinGame';
import SelectDifficultyContainer from './app/screens/SelectDifficulty';
import ProfileContainer from './app/screens/Profile';
import { appColors } from './app/config/styles';
import * as FileSystem from "expo-file-system";
import * as constants from "./app/config/constant";
import AsyncStorage from '@react-native-community/async-storage';
import { randomGuestId } from './app/util/appUtils';
import { addAppUser } from './app/store/actions/gameActions';


const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(false);

  const startAsyncTasks = async () => {
    let nameResult = await AsyncStorage.getItem(constants.asyncStoreAppUserName);
    if (nameResult != null) {
      setIsRegistered(true);
      let randomId = randomGuestId();
      let result = await FileSystem.getInfoAsync(constants.imageFile);
      if (result.exists) {
        appStore.dispatch(addAppUser({name: randomId, displayName: nameResult, self: true, image: constants.imageFile}));
      } else {
        appStore.dispatch(addAppUser({name: randomId, displayName: nameResult, self: true}));
      }
    }
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={startAsyncTasks}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  let homeScreen:"Welcome" | "Home" = "Welcome"
  if (isRegistered) {
    homeScreen = "Home"
  }
  return (
    <Provider store={appStore}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={homeScreen} screenOptions={{headerShown: false, headerTintColor: appColors.defaultTextColor, headerStyle: {backgroundColor: 'rgba(241,225,153,1)'}}}>
          <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}}/>
          <Stack.Screen name="Profile" component={ProfileContainer}/>
          <Stack.Screen name="Home" component={HomeContainer}/>
          <Stack.Screen name="InviteFriend" component={InviteFriendContainer}  options={{headerShown: true}}/>
          <Stack.Screen name="JoinGame" component={JoinGameContainer}  options={{headerShown: true}}/>
          <Stack.Screen name="SelectDifficulty" component={SelectDifficultyContainer}  options={{headerShown: false, title: 'Levels'}}/>
          <Stack.Screen name="Game" component={GameContainer}  options={{headerShown: true, title: '! Tic Tac Toe !'}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

