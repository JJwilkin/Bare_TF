import React, { useState, useEffect } from "react";

//react native
import {
  ActivityIndicator,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Button,
  Platform,
} from "react-native";
import { DeviceMotion } from 'expo-sensors';

export default function TextDisplay(props) {
  const { store, styles } = props;
  const [word, setWord] = useState("");
  const [motionData, setMotion] = useState();
  const [subscription, setSubScription] = useState();
  useEffect(()=>{
    (async () => {
      // const status = await Permissions.askAsync(Permissions.MOTION);
      subscribe();
    })();
    
  },[]);
  useEffect(()=>{
    return () => unsubscribe();
  },[])

  const subscribe = () => {
    DeviceMotion.setUpdateInterval(1000)
    DeviceMotion.addListener(motionData => {
      const {x, y, z} = motionData.acceleration;
      // console.log(Math.abs(x)< 0.3)
      if (!store.getShowPrediction && Math.abs(x)< 0.08 && Math.abs(y) < 0.08 && Math.abs(z) < 0.08){
        // console.log(motionData)
        store.prediction(true)
    
      }
      else {
        store.prediction(false);
      }
      
      
    })
        

    // setSubScription(tempSub);
  }

  const unsubscribe = () => {
    // subscription.remove();
    DeviceMotion.removeAllListeners();
  }
  

  // setInterval(() => {
  //   store.prediction(true);
  //   setWord(store.getWord);
  //   setTimeout(() => {
  //     store.prediction(false);
  //   }, 200);
  // }, 1000);

  // setInterval(() => {
  //   let currentPrediction = store.getWord;

  //   setTimeout(()=>{
  //     if (currentPrediction = store.getWord) {
  //       store.toggle("");
  //     }
  //   }, 1500)

  // }, 2500);

  setInterval(()=>{
    setWord(store.word)
  },1000)

  // const triggerPrediction = () => {
  //   store.prediction(true);
  //   setTimeout(() => {
  //     setWord(store.word);
  //     store.prediction(false);
  //   }, 1500)
  // }
  return (
    <View style={styles.header}>
      
      {/* <Button title="Get Prediction" onPress={() => setWord(store.getWord)}/> */}
      <Text style={styles.title}>{store.getWord}</Text>
    </View>
  );
}
