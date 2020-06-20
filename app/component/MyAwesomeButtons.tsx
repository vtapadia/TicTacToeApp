import React from 'react';
import AwesomeButton, { AwesomeButtonProps } from "react-native-really-awesome-button";
import PropTypes from 'prop-types';

const COMMON = {
  borderRadius: 6,
  height: 55,
  activityColor: "#FFFFFF",
  raiseLevel: 5
};

export const FACEBOOK = {
  backgroundColor: "#4868ad",
  backgroundDarker: "#325194"
};

export enum ButtonTypes {
  primary="primary",
  secondary="secondary",
  // anchor="anchor",
  disabled="disabled",
  // primaryFlat="primaryFlat",
  facebook="facebook"
}


const BUTTONS:{[key in ButtonTypes]: any} = {
  [ButtonTypes.primary]: {
    ...COMMON,
    backgroundColor: "#E85F3A",
    backgroundDarker: "rgb(140,26,17)",
    backgroundProgress: "rgb(140,26,17)",
    textColor: "#FFFFFF"
  },
  [ButtonTypes.secondary]: {
    ...COMMON,
    backgroundColor: "#404C60",
    backgroundDarker: "#242f41",
    backgroundProgress: "#242f41",
    textColor: "#FFFFFF"
  },
  // [ButtonTypes.anchor]: {
  //   ...COMMON,
  //   backgroundColor: "#95d44a",
  //   backgroundDarker: "#489d2b",
  //   textColor: "#34711f",
  //   backgroundProgress: "#489d2b",
  //   borderWidth: 2,
  //   borderColor: "#5bbd3a"
  // },
  [ButtonTypes.disabled]: {
    ...COMMON,
    backgroundColor: "#DFDFDF",
    backgroundDarker: "#CACACA",
    textColor: "#B6B6B6"
  },
  // [ButtonTypes.primaryFlat]: {
  //   backgroundColor: "rgba(0, 0, 0, 0)",
  //   backgroundDarker: "rgba(0, 0, 0, 0)",
  //   backgroundShadow: "rgba(0, 0, 0, 0)",
  //   raiseLevel: 0,
  //   borderRadius: 0
  // },
  [ButtonTypes.facebook]: {
    ...COMMON,
    ...FACEBOOK
  },
};

export enum SizeTypes {
  small="small",
  medium="medium",
  large="large"
}

const SIZE = {
  [SizeTypes.small]: {
    width: 120,
    height: 42,
    textSize: 12
  },
  [SizeTypes.medium]: {
    width: 200,
    height: 55
  },
  [SizeTypes.large]: {
    width: 250,
    height: 60,
    textSize: 16
  }
};

export function MyAwesomeButton(props: PropType & AwesomeButtonProps) {
  const { disabled, type, size } = props;
  const styles = disabled ? BUTTONS.disabled : BUTTONS[type];
  const sizeObj = size ? SIZE[size] : {};
  return <AwesomeButton {...styles} {...sizeObj} {...props} />;
}

declare type PropType = {
  type: ButtonTypes,
  disabled?: boolean,
  size: SizeTypes
  children: PropTypes.ReactNodeLike
}