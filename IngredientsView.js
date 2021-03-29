import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, Dimensions, StyleSheet, TextInput, ImageBackground, ScrollView} from 'react-native';
import SolidButton from './components/buttons/solidButton';
import {title, darkGrey, text, white, lightOverlay, green, lightGrey, subtitle } from "./styles";
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const modalHeight = Math.floor(windowHeight * 0.65);
const modalHalfHeight = Math.floor(windowHeight * 0.25);
const targetAreaPng = require("./assets/targetArea.png");

export default class IngredientsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {ingredientList: [], word: "", lastWord: "", modalVisible: true}
    this.sheetRef = React.createRef();
    this.intervalId = 0;
  }
  async componentDidMount() {
    this.intervalId = setInterval(()=> {this.updateUi()}, 250);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  updateUi = () => {
    if (this.props.store.getShouldBounce()) {
      this.bounce()
    }
    this.setState({...this.state, ingredientList: this.props.store.getIngredients(), word: this.props.store.getWord(), lastWord: this.props.store.getLastWord() })
  }

  renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        // padding: 16,
        // height: 450,
        padding: 30,
        paddingBottom: 10,
        backgroundColor: "white",
        width: windowWidth ,
        height: modalHeight,
      }}
    >
      <View style={{ flex: 5}}>
              <View style={this.props.styles.modalHeader}>
                <Text style={[title, this.props.styles.modalTitle]}>
                  Ingredients
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.sheetRef.current.snapTo(2);
                    this.props.store.setStopPrediction(false);
                  }}
                >
                  <AntDesign name="arrowdown" size={35} color="black" />
                </TouchableOpacity>
              </View>
              <ScrollView style={{flex:1}}>
                {this.state.ingredientList.map((ingredient) => (
                  <View style={styles.ingredientItem}>
                    <Text style={this.props.styles.text}>{ingredient}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.store.removeIngredient(ingredient);
                      }}
                    >
                    <Ionicons name="remove-circle-outline" size={30} color="red" />
                  </TouchableOpacity>
                  </View>
                ))}
                <TextInput
              style={this.props.styles.text}
              // onChangeText={onChangeNumber}
              // value={number}
              placeholderTextColor={darkGrey}
              placeholder="Enter Ingredient"

            />
              </ScrollView>
          </View>
          <View style={[this.props.styles.buttonContainer]}>
               <SolidButton
                color={green}
                 style={{ width: "100%" }}
                 onPress={() => {
                   this.storeData(
                     "ingredientList",
                     ingredientList
                   );
                 }}
                 labelStyle={{ color: "white", fontSize: 18 }}
                 text={`Find Recipes`}
               />
             </View>
    </View>
  );

  storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      console.log(jsonValue);
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
      console.log(e)
    }
  };

  getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      console.log(JSON.parse(jsonValue))
      return JSON.parse(jsonValue);
    } catch(e) {
      console.log(e)
    }
  }
  

  render() {
    return (
      <>
        {this.state.lastWord ? (
          <View style={{position: "absolute",top: windowHeight * 0.05,left: 0,right: 0,}}>
            <Text style={[text, styles.cameraText]}>Added</Text>
            <Text style={[subtitle, styles.cameraText]}>
              {this.state.lastWord}
            </Text>
          </View>
        ) : null}
        <View style={{position: "absolute",top: windowHeight * 0.06,right: windowHeight * 0.04,}}>
            <TouchableOpacity
                // onPress={() => {
                //   this.props.store.removeIngredient(ingredient);
                // }}
              >
                <Entypo name="add-to-list" size={30} color="white" />
            </TouchableOpacity>
          </View>
          {/* <View style={{padding:18,display:'flex', justifyContent:'space-between', position: "absolute",top: 30,left: windowWidth*0.05, zIndex:15, height:windowHeight* 0.4 , borderRadius:30, width: windowWidth*0.9, backgroundColor:'white'}}>
            <Text style={[title, this.props.styles.modalTitle, {fontSize:25}]}>Manually Add Ingredient</Text>
            <TextInput
              style={{color:"black", fontWeight:'500', borderBottomWidth: 1, paddingBottom: 5, fontSize:18}}
              // onChangeText={onChangeNumber}
              // value={number}
              placeholderTextColor={darkGrey}
              placeholder="Enter Ingredient"

            />
            <SolidButton
              color={green}
              style={{ width: "100%" , marginBottom:0, marginTop:0,}}
              labelStyle={{ color: 'white', fontSize: 16 }}
              text="Add"
            />
          </View> */}
          
        <View style={[styles.container,]}>
          <View style={[styles.centerAll]}>
            <ImageBackground source={targetAreaPng} style={styles.image}>
              {this.state.word ? (
                // <SolidButton
                //   color={lightOverlay}
                //   style={{ width: "100%" }}
                //   labelStyle={{ color: darkGrey, fontSize: 16 }}
                //   text={this.state.word}
                // />
              <TouchableOpacity
                onPress={() => {
                  this.props.store.setStopPrediction(true);
                  this.sheetRef.current.snapTo(0);
                }}
              >
                <View
                  useNativeDriver={true}
                  style={{
                    backgroundColor: lightOverlay,
                    borderRadius: 25,
                    paddingHorizontal: 23,
                    paddingVertical: 15,
                  }}
                >
                  <Text style={{ color: darkGrey, fontWeight: "500", fontSize: 16 }}>
                    {this.state.word}
                  </Text>
                </View>
              </TouchableOpacity>

              ) : null}
            </ImageBackground>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.store.setStopPrediction(true);
              this.sheetRef.current.snapTo(0);
            }}
          >
            <Animatable.View
              ref={this.props.handleViewRef}
              useNativeDriver={true}
              style={{
                backgroundColor: green,
                borderRadius: 25,
                paddingHorizontal: 23,
                paddingVertical: 15,
              }}
            >
              <Text style={{ color: "white", fontWeight: "500", fontSize: 18 }}>
                Ingredients: {this.props.store.getIngredients().length}
              </Text>
            </Animatable.View>
          </TouchableOpacity>
        </View>
        <BottomSheet
          ref={this.sheetRef}
          snapPoints={[modalHeight, 0, 0]}
          borderRadius={35}
          initialSnap={2}
          onCloseEnd={() => this.props.store.setStopPrediction(false)}
          renderContent={this.renderContent}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  centerAlign: {
    alignItems:'center', 
    display:'flex'
  },
  centerAll: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraText: {
    color: lightGrey,
    paddingTop:0,
    margin:0,
    padding:0,
    textAlign:'center'
  },
  container: {
    zIndex:10,
    flex:1,
    flexGrow:6,
    padding:25,
    // paddingTop:45,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'space-between'
  },
  image: {
    height: windowWidth * 0.45,
    width: windowWidth * 0.45,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  ingredientItem : {
    justifyContent:'space-between',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    marginBottom:10
  }
});