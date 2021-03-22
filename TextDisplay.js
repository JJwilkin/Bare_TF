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
  const { store, styles, frameworkReady } = props;
  const [word, setWord] = useState("");
  
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
    setWord(store.word)
  },1000)

  return (
    <View style={styles.header}>
      {/* <Text style={styles.title}>{word}</Text> */}
    </View>
  );
}
