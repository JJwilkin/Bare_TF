import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, Dimensions, StyleSheet, Button, ImageBackground, ScrollView} from 'react-native';
import SolidButton from './components/buttons/solidButton';
import {title, darkGrey, text, white, lightOverlay, green, lightGrey, subtitle } from "./styles";
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const modalHeight = Math.floor(windowHeight * 0.65);
const modalHalfHeight = Math.floor(windowHeight * 0.25);
const targetAreaPng = require("./assets/targetArea.png");


// export default function IngredientsView(props) {
//   const [ingredientList, setIngredientList] = useState([]);

//   useEffect(()=> {
//     setInterval(()=> {setIngredientList(props.store.getIngredients()); console.log(props.store.getIngredients())}, 500);
//   }, [])
  
//   const renderContent = () => (
//     <View
//       style={{
//         backgroundColor: 'white',
//         // padding: 16,
//         // height: 450,
//         padding: 30,
//         paddingBottom: 10,
//         backgroundColor: "white",
//         width: windowWidth ,
//         height: modalHeight,
//       }}
//     >
//       <View style={{ flex: 5}}>
//               <View style={props.styles.modalHeader}>
//                 <Text style={[title, props.styles.modalTitle]}>
//                   Ingredients
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     console.log(Object.keys(sheetRef.current.context))
//                     sheetRef.current.snapTo(2)
//                   }}
//                 >
//                   <AntDesign name="arrowdown" size={35} color="black" />
//                 </TouchableOpacity>
//               </View>
//               <ScrollView style={{flex:1}}>
//                 {ingredientList.map((ingredient) => (
//                   <View style={styles.ingredientItem}>
//                     <Text style={props.styles.text}>{ingredient}</Text>
//                     <TouchableOpacity
//                       onPress={() => {
//                         props.store.removeIngredient(ingredient);
//                       }}
//                     >
//                     <Ionicons name="remove-circle-outline" size={30} color="red" />
//                   </TouchableOpacity>
//                   </View>
//                 ))}
//               </ScrollView>
//           </View>
//           <View style={[props.styles.buttonContainer]}>
//                <SolidButton
//                 color={green}
//                  style={{ width: "100%" }}
//                  onPress={() => {
//                   //  this.props.store.setStopPrediction(true);
//                    storeData(
//                      "ingredientList",
//                      ingredientList
//                    );
//                  }}
//                  labelStyle={{ color: "white", fontSize: 16 }}
//                  text={`Find Recipes`}
//                />
//              </View>
//     </View>
//   );

//   const storeData = async (key, value) => {
//     try {
//       const jsonValue = JSON.stringify(value)
//       console.log(jsonValue);
//       await AsyncStorage.setItem(key, jsonValue)
//     } catch (e) {
//       console.log(e)
//     }
//   };

//   const getData = async (key) => {
//     try {
//       const jsonValue = await AsyncStorage.getItem(key)
//       console.log(JSON.parse(jsonValue))
//       return JSON.parse(jsonValue);
//     } catch(e) {
//       console.log(e)
//     }
//   }
//   const sheetRef = React.useRef(null);

//   return (
//     <>
//     <View style={{position:'absolute', top:windowHeight*0.05, left:0, right:0}}>
//           <Text style={[text, styles.cameraText]}>Added</Text>
//           <Text style={[subtitle, styles.cameraText]}>{props.store.getWord()}</Text>
//         </View>
//      <View style={styles.container}>
     

//         <View style={[styles.centerAll,]}>
        
//           <ImageBackground source={targetAreaPng} style={styles.image}>
//             {props.store.getWord() ? (
//               <SolidButton
//                 color={lightOverlay}
//                 style={{ width: "100%" }}
//                 labelStyle={{ color: darkGrey, fontSize: 16 }}
//                 text={props.store.getWord()}
//               />
//             ) : null}
//           </ImageBackground>
//         </View>
//         <TouchableOpacity onPress={()=>sheetRef.current.snapTo(0)}>
//           <View style={{backgroundColor: green, borderRadius:25, paddingHorizontal:23, paddingVertical:15}}>
//             <Text style={{color:"white", fontWeight:'500', fontSize:18, }}>My Ingredients: {props.store.getIngredients().length}</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//       <BottomSheet
//         ref={sheetRef}
//         snapPoints={[modalHeight, modalHalfHeight, 0]}
//         borderRadius={35}
//         initialSnap={2}
//         renderContent={renderContent}
//       />
//     </>
//   );
// }

export default class IngredientsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {ingredientList: []}
    this.sheetRef = React.createRef();
    this.intervalId = 0;
  }

  componentDidMount() {
    this.intervalId = setInterval(()=> {this.setState({...this.state, ingredientList: this.props.store.getIngredients()})}, 250);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
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
    <View style={{position:'absolute', top:windowHeight*0.05, left:0, right:0}}>
          <Text style={[text, styles.cameraText]}>Added</Text>
          <Text style={[subtitle, styles.cameraText]}>{this.props.store.getWord()}</Text>
        </View>
     <View style={styles.container}>
        <View style={[styles.centerAll,]}>
        
          <ImageBackground source={targetAreaPng} style={styles.image}>
            {this.props.store.getWord() ? (
              <SolidButton
                color={lightOverlay}
                style={{ width: "100%" }}
                labelStyle={{ color: darkGrey, fontSize: 16 }}
                text={this.props.store.getWord()}
              />
            ) : null}
          </ImageBackground>
        </View>
        <TouchableOpacity onPress={()=> {this.props.store.setStopPrediction(true);this.sheetRef.current.snapTo(0); }}>
          <View style={{backgroundColor: green, borderRadius:25, paddingHorizontal:23, paddingVertical:15}}>
            <Text style={{color:"white", fontWeight:'500', fontSize:18, }}>My Ingredients: {this.props.store.getIngredients().length}</Text>
          </View>
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