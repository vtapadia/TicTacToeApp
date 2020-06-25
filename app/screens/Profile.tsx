import React, { useEffect } from 'react';
import {appStyles, appColors} from "../config/styles";
import {View, TouchableWithoutFeedback, Text, Modal, Alert, TouchableHighlight, StyleSheet, ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform} from "react-native";
import { RootState } from '../store/reducers/appReducer';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { MyAwesomeButton, ButtonTypes, SizeTypes } from '../component/MyAwesomeButtons';
import {addAppUser} from "../store/actions/gameActions";
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Input, Divider } from 'react-native-elements';
import { ProfileProps, Player } from '../config/types';
import * as constants from "../config/constant";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

const mapState = (state: RootState) => ({
  appUser: state.gameReducer.appUser,
})

const mapDispatch = {
  addAppUser
}

type StateProps = ReturnType<typeof mapState>
type DispatchProps = typeof mapDispatch

type Props = StateProps & DispatchProps & ProfileProps

function Profile(props: Props) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  const [value, setValue] = React.useState<string | undefined>(props.appUser?.displayName);
  const [image, setImage] = React.useState<string | undefined>(props.appUser?.image);

  const [cameraPermission, setCameraPermission] = React.useState(false);
  const [cameraRollPermission, setCameraRollPermission] = React.useState(false);

  //The last [] is added to ensure that it does not apply and remove on every render change.
  useEffect(()=> {
    console.log("Adding keyboard listeners")
    Keyboard.addListener("keyboardWillShow", ()=>{setKeyboardVisible(true)})
    Keyboard.addListener("keyboardWillHide", ()=>{setKeyboardVisible(false)})
    return () => {
      console.log("Removing all listeners")
      Keyboard.removeAllListeners("keyboardWillShow")
      Keyboard.removeAllListeners("keyboardWillHide")
    }
  }, [])

  useEffect(()=>{
    ImagePicker.getCameraPermissionsAsync().then(cp => {
      // console.log("Camera Permission: ",cp)
      setCameraPermission(cp.granted);
    }).catch(e=>{console.log(e)})
    ImagePicker.getCameraRollPermissionsAsync().then(cp => {
      // console.log("Camera Roll Permission: ",cp)
      setCameraRollPermission(cp.granted);
    }).catch(e=>{console.log(e)})
  },[]);

  const saveProfile = async () => {
    if (props.appUser) {
      let appPlayer:Player = {...props.appUser};
      if (value && value.length>0) {
        appPlayer.displayName = value;
      } else {
        Alert.alert("Sorry, the name is required");
        return;
      }
      if (image && image != constants.imageFile) {
        console.log("Image File Selected: ", image)
        let result = await FileSystem.getInfoAsync(constants.imageFolder)
        if (!result.exists) {
          console.log("Image Directory missing, so creating it")
          await FileSystem.makeDirectoryAsync(constants.imageFolder)
        }
        await FileSystem.copyAsync({
          from: image,
          to: constants.imageFile
        })

        appPlayer.image = constants.imageFile;
        console.log("Image Saved at ", constants.imageFile)
      }
      try {
        await AsyncStorage.setItem(constants.asyncStoreAppUserName, value);
      } catch (e) {
        console.log("Saving name locally failed, continue..");
      }
      props.addAppUser(appPlayer);
    }
    props.navigation.goBack();
  }

  const showModel = () => {
    setModalVisible(true);
  }

  const takePhoto = async () => {
    if (!cameraPermission) {
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Sorry, we need camera permissions to make this work!")
        return;
      }
    }
    //Permission received
    console.log("Camera Permission received");
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
    setModalVisible(!modalVisible);
  }

  const pickImage = async () => {
    if (!cameraRollPermission) {
      console.log("Camera Roll permission not granted yet")
      try {
        let permissionResult = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        console.log("Permission result ", permissionResult);
        if (!permissionResult.granted) {
          Alert.alert("Sorry, we need camera roll permissions to make this work!");
        }
      } catch (e) {
        console.log("Failed when asking permission", e)
      }
    }
    console.log("Opening Image picker");

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: false,
      });
    
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
    //Its important to not change state as that would lead to page refresh.
    //This is primary because it is async method (otherwise method completion would have been done first.)
    setModalVisible(!modalVisible);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"} style={appStyles.container}>
      <LinearGradient style={appStyles.backgroundGradient} colors={appColors.gradient}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.outer}>
          <View style={styles.inner}>
            {/* <View style={{flex: 0.5, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', alignContent: 'space-between'}}>
              <Icon.Button name='chevron-left' underlayColor='yellow' onPress={props.navigation.goBack} backgroundColor='transparent' size={40} style={{padding: 10}}></Icon.Button>
            </View> */}
            <View style={styles.workarea}>
              <Avatar size={keyboardVisible?"large":"xlarge"} rounded showAccessory 
                // icon={{name: 'user', type: 'font-awesome'}}
                source={{ uri: image }}
                onPress={showModel}
                activeOpacity={0.7}
                containerStyle={{backgroundColor: 'red'}}
              />
              <Input
                placeholder='Name'
                label='Enter your name'
                leftIcon={
                  <Icon
                    name='user'
                    size={24}
                    color='black'
                  />
                }
                onChangeText={(value) => {setValue(value)}}
              >{value}</Input>
              <MyAwesomeButton onPress={saveProfile} size={SizeTypes.large} type={ButtonTypes.primary}>
                Save
              </MyAwesomeButton>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
          <View style={styles.bottomView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Select Image!</Text>
              <TouchableHighlight underlayColor='transparent' style={styles.modalOptions} onPress={takePhoto}>
                <Text style={styles.textStyle}>Take Photo...</Text>
              </TouchableHighlight>
              <TouchableHighlight underlayColor='transparent' style={styles.modalOptions} onPress={pickImage}>
                <Text style={styles.textStyle}>Choose from Library...</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.modalView}>
              <TouchableHighlight underlayColor='transparent' style={{alignSelf:'stretch'}} onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const ProfileContainer = connect(mapState, mapDispatch)(Profile)

export default ProfileContainer

export const styles = StyleSheet.create({
  outer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    flex: 1
  },
  workarea: {
    height: '80%',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'center',
    alignItems: "stretch",
    backgroundColor: 'rgba(204, 204, 204, 0.8)',
    marginTop: 22
  },
  modalView: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textStyle: {
    color: "rgb(56,132,246)",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center"
  },
  modalText: {
    marginBottom: 10,
    fontSize: 17,
    fontWeight: 'normal',
    textAlign: "center",
  },
  modalOptions: {
    alignSelf:'stretch', 
    paddingVertical: 10, 
    borderTopWidth: 1, 
    borderColor: 'lightgrey'
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
});



