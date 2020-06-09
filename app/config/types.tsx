import {StackScreenProps} from '@react-navigation/stack';

export interface Player {
  name: string
  self: boolean
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
  SelectDifficulty: {self: Player, gameId?: string} | undefined;
  InviteFriend: {self: Player, gameId?: string} | undefined;
  JoinGame: {self: Player} | undefined;
  Game: { mode: GameMode, self: Player, gameId?: string, difficulty?: DifficultyLevel } | undefined;
};

export type WelcomeProps = StackScreenProps<RootStackParamList, 'Welcome'>;
export type HomeProps = StackScreenProps<RootStackParamList, 'Home'>;
export type InviteFriendProps = StackScreenProps<RootStackParamList, 'InviteFriend'>;
export type JoinGameProps = StackScreenProps<RootStackParamList, 'JoinGame'>;
export type SelectDifficultyProps = StackScreenProps<RootStackParamList, 'SelectDifficulty'>;
export type GameProps = StackScreenProps<RootStackParamList, 'Game'>;
