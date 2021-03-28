import React from 'react';
import {View, TouchableOpacity, Text, Dimensions, StyleSheet, Button, ImageBackground, ScrollView} from 'react-native';
import SolidButton from './components/buttons/solidButton';
import SlidingUpPanel from 'rn-sliding-up-panel';
import {title, darkGrey, text, white, lightOverlay, green, lightGrey, subtitle } from "./styles";
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const targetAreaPng = require("./assets/targetArea.png");


export default function IngredientsView(props) {
  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        // padding: 16,
        // height: 450,
        padding: 30,
        paddingBottom: 10,
        backgroundColor: "white",
        width: windowWidth ,
        height: windowHeight * 0.65,
      }}
    >
      <View style={{ flex: 5}}>
              <View style={props.styles.modalHeader}>
                <Text style={[title, props.styles.modalTitle]}>
                  Ingredients
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    // this._panel.hide();
                  }}
                >
                  <AntDesign name="arrowdown" size={35} color="black" />
                </TouchableOpacity>
              </View>
              <ScrollView style={{flex:1}}>
                {props.store.getIngredients().map((ingredient) => (
                  <View style={styles.ingredientItem}>
                    <Text style={props.styles.text}>{ingredient}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        props.store.removeIngredient(ingredient);
                      }}
                    >
                    <Ionicons name="remove-circle-outline" size={30} color="red" />
                  </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
          </View>
          <View style={[props.styles.buttonContainer]}>
               <SolidButton
                color={green}
                 style={{ width: "100%" }}
                 onPress={() => {
                  //  this.props.store.setStopPrediction(true);
                   storeData(
                     "ingredientList",
                     props.store.getIngredients()
                   );
                 }}
                 labelStyle={{ color: "white", fontSize: 16 }}
                 text={`Find Recipes`}
               />
             </View>
    </View>
  );

  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      console.log(jsonValue);
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
  const sheetRef = React.useRef(null);

  return (
    <>
     <View style={styles.container}>
        <View style={{display:'none'}}>
          <Text style={[text, styles.cameraText]}>Added</Text>
          <Text style={[subtitle, styles.cameraText]}>{props.store.getWord()}</Text>
        </View>

        <View style={styles.centerAll}>
          <ImageBackground source={targetAreaPng} style={styles.image}>
            {props.store.getWord() ? (
              <SolidButton
                color={lightOverlay}
                style={{ width: "100%" }}
                labelStyle={{ color: darkGrey, fontSize: 16 }}
                text={props.store.getWord()}
              />
            ) : null}
          </ImageBackground>
        </View>
        <TouchableOpacity onPress={()=>sheetRef.current.snapTo(0)}>
        <Text style={{color:'red'}}>Hello World</Text>

        </TouchableOpacity>
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[450, 300, 0]}
        borderRadius={35}
        renderContent={renderContent}
      />
    </>
  );
}
     
// export default class IngredientsView extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {ingredientList: []}
//   }
//   animatedValue = new Animated.Value(0);

//   componentDidMount() {
//     this.listener = this.animatedValue.addListener(this.onAnimatedValueChange.bind(this))
//     setInterval(()=> {this.setState({...this.state, ingredientList: this.props.store.getIngredients()})}, 250);
//   }

//   componentWillUnmount() {
//     this.animatedValue.removeListener(this.listener)
//   }

//   onAnimatedValueChange({ value }) {
//     // Fired when the panel is moving
//     if (value == 0 ) {
//       this.props.store.setStopPrediction(false);
//     }
//   }
//   render() {
//     return (
//       <View style={styles.container}>
//         <View style={{display:'none'}}>
//           <Text style={[text, styles.cameraText]}>Added</Text>
//           <Text style={[subtitle, styles.cameraText]}>{this.props.store.getWord()}</Text>
//         </View>

//         <View style={styles.centerAll}>
//           <ImageBackground source={targetAreaPng} style={styles.image}>
//             {this.props.store.getWord() ? (
//               <SolidButton
//                 color={lightOverlay}
//                 style={{ width: "100%" }}
//                 labelStyle={{ color: darkGrey, fontSize: 16 }}
//                 text={this.props.store.getWord()}
//               />
//             ) : null}
//           </ImageBackground>
//         </View>
        
//         <SlidingUpPanel
//           ref={(c) => (this._panel = c)}
//           animatedValue={this.animatedValue}
//           allowDragging={false}
//         >
//           <View style={this.props.styles.modal}>
//             <View style={{ flex: 5}}>
//               <View style={this.props.styles.modalHeader}>
//                 <Text style={[title, this.props.styles.modalTitle]}>
//                   Ingredients
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     this._panel.hide();
//                   }}
//                 >
//                   <AntDesign name="arrowdown" size={35} color="black" />
//                 </TouchableOpacity>
//               </View>
//               <ScrollView style={{flex:1}}>
//                 {this.state.ingredientList.map((ingredient) => (
//                   <View style={styles.ingredientItem}>
//                     <Text style={this.props.styles.text}>{ingredient}</Text>
//                     <TouchableOpacity
//                       onPress={() => {
//                         this.props.store.removeIngredient(ingredient);
//                       }}
//                     >
//                     <Ionicons name="remove-circle-outline" size={30} color="red" />
//                   </TouchableOpacity>
//                   </View>
//                 ))}
//               </ScrollView>
//             </View>
//             <View style={[this.props.styles.buttonContainer]}>
//               <SolidButton
//                 color={green}
//                 style={{ width: "100%" }}
//                 onPress={() => {
//                   this.props.store.setStopPrediction(true);
//                   this.props.storeData(
//                     "ingredientList",
//                     this.props.store.getIngredients()
//                   );
//                 }}
//                 labelStyle={{ color: "white", fontSize: 16 }}
//                 text={`Find Recipes`}
//               />
//             </View>
//           </View>
//         </SlidingUpPanel>
//         {/* <SolidButton
//           color={white}
//           style={{ width: "100%" }}
//           labelStyle={{ color: "grey", fontSize: 16 }}
//           text={`^ Ingredients ${this.props.store.getIngredients().length}`}
//           onPress={() => {
//             this.props.store.setStopPrediction(true);
//             this._panel.show();
//           }}
//         /> */}
//         <TouchableOpacity onPress={() => {
//             this.props.store.setStopPrediction(true);
//             this._panel.show();
//           }}>
//           <Text style={{ color: "grey", fontSize: 16 }}>{`^ Ingredients ${this.props.store.getIngredients().length}`}</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }

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
    height: windowWidth * 0.4,
    width: windowWidth * 0.4,
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