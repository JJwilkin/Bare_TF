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
import { AntDesign, Ionicons } from '@expo/vector-icons';
import SolidButton from './components/buttons/solidButton';
import {title, darkGrey, white, lightOverlay, green, lightGrey } from "./styles";
import AsyncStorage from '@react-native-community/async-storage';
const targetAreaPng = require("./assets/targetArea.png");
import IngredientsView from './IngredientsView';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function CameraOverlay(props) {
  const { store, styleSheet, frameworkReady, takePicture } = props;
  const [word, setWord] = useState("");
  const [showIngredients, setShowIngredients] = useState(false);
  
  useEffect(()=>{
    if (frameworkReady){
      (async () => {
        subscribe();
      })();
    }
  },[frameworkReady]);

  useEffect(()=>{
    return () => unsubscribe();
  },[]);

  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
      console.log(e)
    }
  };

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      console.log(JSON.parse(jsonValue))
      return JSON.parse(jsonValue);
    } catch(e) {
      console.log(e)
    }
  }

  const subscribe = () => {
    console.log("Subscribing")
  
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

  setInterval(()=>{
    if (store.word !== word){
      setWord(store.word);
    }
    store.getIngredients();
  },1000)

  return (
    <View style={styles.container}>
      
      {/* <View style={styles.topBarContainer}>
        <TouchableOpacity onPress={() => takePicture()}>
          <Ionicons name="arrow-back-circle" size={40} color="white"/>
        </TouchableOpacity>
      </View>
      <View style={styles.centerAll}>
        <ImageBackground source={targetAreaPng} style={styles.image}>
           <SolidButton
            color={lightOverlay}
            style={{width:'100%'}}
            labelStyle={{color: darkGrey, fontSize:16}}
            text={word}
          />
        </ImageBackground>
      </View> */}
      <IngredientsView store={store} styles={styles} setShowIngredients={setShowIngredients} />
      
      {/* <View style={styles.centerAlign}>
        <SolidButton
          color={white}
          style={{width:'100%'}}
          onPress={()=>{setShowIngredients(true)}}
          labelStyle={{color:'grey', fontSize:16}}
          text={`^ Ingredients ${store.getIngredients().length}`}
        /> 
      </View> */}
      {/* {showIngredients ? 
        <View style={styles.modal}>
          <View style={{flex:1}}>
            <View style={styles.modalHeader}>
              <Text style={[title, styles.modalTitle]}>Ingredients</Text>
              <TouchableOpacity onPress={() => setShowIngredients(false)}>
                <AntDesign name="arrowdown" size={30} color="black" />
              </TouchableOpacity>
            </View>
          {store.getIngredients().map((ingredient)=> (
            <Text style={styles.text}>{ingredient}</Text>
          ))}
          </View>
          <View style={styles.buttonContainer}>
            <SolidButton
              color={green}
              style={{width:'100%'}}
              onPress={()=> {storeData("ingredientList", store.getIngredients())}}
              labelStyle={{color:'white', fontSize:16}}
              text={`Find Recipes`}
            /> 
          </View>
        </View>
      : null}   */}
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
