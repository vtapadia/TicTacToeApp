import React from 'react';
import {View, Text, TouchableHighlight} from "react-native";
import {styles} from "../config/styles";
import { RootState } from '../store/reducers/appReducer';
import { InviteFriendProps } from '../config/types';
import { connect } from 'react-redux';

const mapState = (state: RootState) => ({
  game: state.gameReducer.game,
  turn: state.gameReducer.game.turn,
  winner: state.gameReducer.game.winner
})

const mapDispatch = {
  // move,
  // addPlayer,
  // reset
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & InviteFriendProps

function InviteFriend(props:Props) {
  return <View></View>;
}

const InviteFriendContainer = connect(mapState, mapDispatch)(InviteFriend)

export default InviteFriendContainer;
