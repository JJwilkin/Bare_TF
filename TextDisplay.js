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
import SolidButton from './components/buttons/solidButton'
import {title, darkGrey, white, lightOverlay, green, lightGrey } from "./styles";
const targetAreaPng = require("./assets/targetArea.png");
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function TextDisplay(props) {
  const { store, styles, frameworkReady } = props;
  const [word, setWord] = useState("");
  const [ingredientList, setIngredientList] = useState([]);
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
  },[])

  const subscribe = () => {
    console.log("Subscribing")
  
    DeviceMotion.setUpdateInterval(1000)
    DeviceMotion.addListener(motionData => {
      const {x, y, z} = motionData.acceleration;
      
      if (Math.abs(x)< 0.08 && Math.abs(y) < 0.08 && Math.abs(z) < 0.08){
        store.prediction(true)
    
      }
      else {
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
    let arrayEqual = JSON.stringify(store.getIngredients().sort()) === JSON.stringify(ingredientList.sort())
    if (arrayEqual) {
      setIngredientList(store.getIngredients());
    }
  },1000)

  return (
    <View style={[styles.header]}>
      <View style={{justifyContent:'space-between', alignItems:'center', flexDirection:'row', width:windowWidth, paddingHorizontal:15}}>
        <Ionicons name="arrow-back-circle" size={40} color="white"/>
        {/* <Text style={subtitle}>Added Tangerines</Text>
        <Ionicons name="arrow-back-circle" size={40} color="white" /> */}
      </View>
      <View style={{display:'flex',flex:1, justifyContent:'center', alignItems:'center', }}>
        <ImageBackground source={targetAreaPng} style={styleSheet.image}>
           <SolidButton
            color={lightOverlay}
            style={{width:'100%'}}
            labelStyle={{color: darkGrey, fontSize:16}}
            text={word}
          />
        </ImageBackground>
      </View>
      <View style={{alignItems:'center', display:'flex'}}>
        <SolidButton
          color={white}
          style={{width:'100%'}}
          onPress={()=>{setShowIngredients(true)}}
          labelStyle={{color:'grey', fontSize:16}}
          text={`^ Ingredients ${ingredientList.length}`}
        /> 
      </View>
      {showIngredients ? 
        <View style={{position:'absolute', top:windowHeight*0.3, padding:30, paddingBottom:10, borderRadius:30, backgroundColor:"white", width: windowWidth*0.85, height:windowHeight*0.65,}}>
          <View style={{flex:1}}>
            <View style={{justifyContent:'space-between', flexDirection:'row', alignItems:'center', marginBottom:20}}>
              <Text style={[title, {paddingTop:0, marginBottom:0}]}>Ingredients</Text>
              <TouchableOpacity onPress={() =>setShowIngredients(false)}>
                <AntDesign name="arrowdown" size={30} color="black" />
              </TouchableOpacity>
            </View>
          {ingredientList.map((ingredient)=> (
            <Text style={styleSheet.text}>{ingredient}</Text>
          ))}
          </View>
          <View style={{flex:1, flexDirection:'column', justifyContent:'flex-end'}}>
            <SolidButton
              color={green}
              style={{width:'100%'}}
              onPress={()=>{setShowIngredients(false)}}
              labelStyle={{color:'white', fontSize:16}}
              text={`Find Recipes`}
            /> 
          </View>
        </View>
      : null}  
    </View>
  );
}


const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    height: windowWidth * 0.4,
    width: windowWidth * 0.4,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems:'center'
  },
  text: {
    color: darkGrey,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    
  }
});
