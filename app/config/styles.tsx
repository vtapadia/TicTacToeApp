import React from 'react';
import { Platform, StyleSheet} from 'react-native';

export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'stretch' ,
    backgroundColor: 'rgba(241,225,153,1)'
  },
});

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'stretch' 
  },
  button: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderWidth: 1,
    borderRadius: 10
  },
  buttonFacebook: {
    alignItems: "center",
    backgroundColor: "dodgerblue",
    padding: 15,
    borderWidth: 1,
    borderRadius: 10
  },
  buttonOther: {
    alignItems: "center",
    backgroundColor: "lightgrey",
    padding: 15,
    borderWidth: 1,
    borderRadius: 10
  },
  buttonText: {
    fontSize: 20
  },
  square: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: "solid",
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
    width: 100,
    height: 100
  },
  boardRow: {
    alignItems: 'stretch', 
    alignContent: 'center',
    flexDirection: 'row'
  },
  board: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'stretch'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});