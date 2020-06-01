import {StackScreenProps} from '@react-navigation/stack';


export type RootStackParamList = {
  Welcome: undefined;
  Home: { userId: string } | undefined;
  Game: { sort: 'latest' | 'top' } | undefined;
};

export type WelcomeProps = StackScreenProps<RootStackParamList, 'Welcome'>;
export type HomeProps = StackScreenProps<RootStackParamList, 'Home'>;
export type GameProps = StackScreenProps<RootStackParamList, 'Game'>;
