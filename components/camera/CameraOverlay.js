import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from "react-native";
import { DeviceMotion } from 'expo-sensors';
import {title, darkGrey, white, lightOverlay, green, lightGrey } from "../../styles";
import AsyncStorage from '@react-native-community/async-storage';
const targetAreaPng = require("../../assets/targetArea.png");
import CameraBottomPanel from './CameraBottomPanel';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function CameraOverlay(props) {
  const { store, frameworkReady, isFocused, handleViewRef, navigation } = props;

  
  useEffect(()=>{
    if (frameworkReady && isFocused){
      (async () => {
        subscribe();
      })();
    }
  },[frameworkReady, isFocused]);

  useEffect(()=>{
    return () => unsubscribe();
  },[]);

  const subscribe = () => {
    DeviceMotion.setUpdateInterval(1000)
    DeviceMotion.addListener(motionData => {
      const {x, y, z} = motionData.acceleration;
      
      if (Math.abs(x)< 0.08 && Math.abs(y) < 0.08 && Math.abs(z) < 0.08){
        store.prediction(true)
      } else {
        store.prediction(false);
      }
    })
  }

  const unsubscribe = () => {
    DeviceMotion.removeAllListeners();
  }

  return (
    <View style={styles.container}>
      <CameraBottomPanel store={store} navigation={navigation} handleViewRef={handleViewRef} styles={styles}  />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    zIndex:5,
    flex:1,
    // padding:25,
    // paddingTop:45,
    display:'flex',
    flexDirection:'column',
    // alignItems:'center',
    justifyContent:'space-between'
    
  },
  centerAlign: {
        alignItems:'center', 
        display:'flex',
      },
  centerAll: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerAlign: {
    alignItems:'center', 
    display:'flex'
  },
  image: {
    height: windowWidth * 0.4,
    width: windowWidth * 0.4,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: darkGrey,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
  },
  topBarContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: windowWidth,
    paddingHorizontal: 15,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  modal: {
    position: "absolute",
    bottom: "0%",
    padding: 30,
    paddingBottom: 10,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: "white",
    width: windowWidth ,
    height: windowHeight * 0.65,
  },
  modalHeader: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    paddingTop: 0,
    marginBottom: 0,
  },
});