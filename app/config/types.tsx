import {StackScreenProps} from '@react-navigation/stack';

export interface Player {
  name: string
  displayName?: string
  self?: boolean
  image?: string
}

export enum GameMode {
  OFFLINE,
  NETWORK
}

export enum DifficultyLevel {
  EASY,
  MEDIUM, 
  HARD
}

export type RootStackParamList = {
  Welcome: undefined;
  Home: { playerName: string } | undefined;
  Profile: undefined;
  SelectDifficulty: undefined;
  InviteFriend: undefined;
  JoinGame: undefined;
  Game: { mode: GameMode, gameId?: string, difficulty?: DifficultyLevel } | undefined;
};

export type WelcomeProps = StackScreenProps<RootStackParamList, 'Welcome'>;
export type ProfileProps = StackScreenProps<RootStackParamList, 'Profile'>;
export type HomeProps = StackScreenProps<RootStackParamList, 'Home'>;
export type InviteFriendProps = StackScreenProps<RootStackParamList, 'InviteFriend'>;
export type JoinGameProps = StackScreenProps<RootStackParamList, 'JoinGame'>;
export type SelectDifficultyProps = StackScreenProps<RootStackParamList, 'SelectDifficulty'>;
export type GameProps = StackScreenProps<RootStackParamList, 'Game'>;
