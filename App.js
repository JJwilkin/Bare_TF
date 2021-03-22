import React, { useState, useEffect } from 'react';
import OCRCamera from './OCRCamera';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


export default function App() {
  return( 
    <View>
        <OCRCamera />
    </View>
  );
}