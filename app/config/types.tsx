import {StackScreenProps} from '@react-navigation/stack';

export interface Player {
  name: string
  self: boolean
}

export enum GameMode {
  OFFLINE,
  NETWORK
}

export type RootStackParamList = {
  Welcome: undefined;
  Home: { playerName: string } | undefined;
  Game: { mode: GameMode, self: Player } | undefined;
};

export type WelcomeProps = StackScreenProps<RootStackParamList, 'Welcome'>;
export type HomeProps = StackScreenProps<RootStackParamList, 'Home'>;
export type GameProps = StackScreenProps<RootStackParamList, 'Game'>;
