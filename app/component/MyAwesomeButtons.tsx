import React from 'react';
import AwesomeButton, { AwesomeButtonProps } from "react-native-really-awesome-button";
import PropTypes from 'prop-types';

const COMMON = {
  borderRadius: 6,
  height: 55,
  activityColor: "#FFFFFF",
  raiseLevel: 5
};

export const TWITTER = {
  backgroundColor: "#00aced",
  backgroundDarker: "#0096cf"
};

export const MESSENGER = {
  backgroundColor: "#3186f6",
  backgroundDarker: "#2566bc"
};

export const FACEBOOK = {
  backgroundColor: "#4868ad",
  backgroundDarker: "#325194"
};

export const GITHUB = {
  backgroundColor: "#2c3036",
  backgroundDarker: "#060708"
};

//Blue
export const LINKEDIN = {
  backgroundColor: "#0077b5",
  backgroundDarker: "#005885"
};

//Green
export const READY_GREEN = {
  backgroundColor: "#25d366",
  backgroundDarker: "#14a54b"
};

//Orange 
export const REDDIT = {
  backgroundColor: "#fc461e",
  backgroundDarker: "#d52802"
};

//Dark Reddish button
export const PINTEREST = {
  backgroundColor: "#bd091c",
  backgroundDarker: "#980313"
};

//Light Reddish button
export const YOUTUBE = {
  backgroundColor: "#cc181e",
  backgroundDarker: "#ab0d12"
};

export enum ButtonTypes {
  primary="primary",
  secondary="secondary",
  anchor="anchor",
  disabled="disabled",
  // primaryFlat="primaryFlat",
  facebook="facebook",
  ready="ready",
  pinterest="pinterest"
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
  [ButtonTypes.anchor]: {
    ...COMMON,
    backgroundColor: "#af2831",
    backgroundDarker: "#8b1e25",
    backgroundProgress: "#8b1e25",
    textColor: "#FFFFFF"
  },
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
  [ButtonTypes.ready]: {
    ...COMMON,
    ...READY_GREEN
  },
  [ButtonTypes.pinterest]: {
    ...COMMON,
    ...PINTEREST
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