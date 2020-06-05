import React, { useState } from 'react';
import {View, Text, TouchableHighlight} from "react-native";
import {styles} from "../config/styles";
import {GameProps} from "../config/types";
import Icon from 'react-native-vector-icons/FontAwesome';
import { GameState } from '../component/GameState';

export default function Game({ route, navigation }: GameProps) {
  const gameState = new GameState(route.params?.mode);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}></View>
      <View style={{flex: 3, flexDirection: 'row'}}>
        <View style={{flex: 1}}></View>
        <View style={{flex: 3, alignItems: 'stretch'}}>
          <View style={styles.board}>
            <View style={styles.boardRow}>
              <Square row={0} col={0} game={gameState}></Square>
              <Square row={0} col={1} game={gameState}></Square>
              <Square row={0} col={2} game={gameState}></Square>
            </View>
            <View style={styles.boardRow}>
              <Square row={1} col={0} game={gameState}></Square>
              <Square row={1} col={1} game={gameState}></Square>
              <Square row={1} col={2} game={gameState}></Square>
            </View>
            <View style={styles.boardRow}>
              <Square row={2} col={0} game={gameState}></Square>
              <Square row={2} col={1} game={gameState}></Square>
              <Square row={2} col={2} game={gameState}></Square>
            </View>
          </View>
        </View>
        <View style={{flex: 1}}></View>
      </View>
      <View style={{flex: 1}}></View>
    </View>
  );
}

declare type SquareProp = {
  row: number,
  col: number,
  game?: GameState
};

export function Square(props: SquareProp) {
  // const value;
  const [value, setValue] = useState(String);

  function selected() {
    if (props.game) {
      if (!value) { 
        props.game?.setValue(props.row, props.col);
        setValue(props.game?.myPiece);
      }
    }
  }

  return (
    <TouchableHighlight style={styles.square} disabled={(value)?true:false}
     onPress={selected}>
      <Text style={{textAlign: 'center'}}>
        {value=="X" ? <Icon name="close" size={50} ></Icon> : null}
        {value=="O" ? <Icon name="circle-o" size={40}></Icon> : null}
      </Text>
    </TouchableHighlight>
  );
};

declare type BoardProp = {
  game: GameState
};

export function Board(props: BoardProp) {
  return (
    <View style={styles.board}>
      <View style={styles.boardRow}>
        <Square row={0} col={0} game={props.game}></Square>
        <Square row={0} col={1} game={props.game}></Square>
        <Square row={0} col={2} game={props.game}></Square>
      </View>
      <View style={styles.boardRow}>
        <Square row={1} col={0} game={props.game}></Square>
        <Square row={1} col={1} game={props.game}></Square>
        <Square row={1} col={2} game={props.game}></Square>
      </View>
      <View style={styles.boardRow}>
        <Square row={2} col={0} game={props.game}></Square>
        <Square row={2} col={1} game={props.game}></Square>
        <Square row={2} col={2} game={props.game}></Square>
      </View>
    </View>
  );
}