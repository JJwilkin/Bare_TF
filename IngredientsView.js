import React from 'react';
import {View, TouchableOpacity, Text, Dimensions, Animated, StyleSheet, ImageBackground} from 'react-native';
import SolidButton from './components/buttons/solidButton';
import SlidingUpPanel from 'rn-sliding-up-panel';
import {title, darkGrey, text, white, lightOverlay, green, lightGrey, subtitle } from "./styles";
import { AntDesign, Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const targetAreaPng = require("./assets/targetArea.png");

export default class IngredientsView extends React.Component {
  constructor(props) {
    super(props);
  }
  animatedValue = new Animated.Value(0);

  componentDidMount() {
    this.listener = this.animatedValue.addListener(this.onAnimatedValueChange.bind(this))
  }

  componentWillUnmount() {
    this.animatedValue.removeListener(this.listener)
  }

  onAnimatedValueChange({ value }) {
    // Fired when the panel is moving
    if (value == 0 ) {
      this.props.store.setStopPrediction(false);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{display:'none'}}>
          <Text style={[text, styles.cameraText]}>Added</Text>
          <Text style={[subtitle, styles.cameraText]}>{this.props.store.getWord()}</Text>
        </View>

        <View style={styles.centerAll}>
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
        <SolidButton
          color={white}
          style={{ width: "100%" }}
          labelStyle={{ color: "grey", fontSize: 16 }}
          text={`^ Ingredients ${this.props.store.getIngredients().length}`}
          onPress={() => {
            this.props.store.setStopPrediction(true);
            this._panel.show();
          }}
        />
        <SlidingUpPanel
          ref={(c) => (this._panel = c)}
          animatedValue={this.animatedValue}
        >
          <View style={this.props.styles.modal}>
            <View style={{ flex: 1 }}>
              <View style={this.props.styles.modalHeader}>
                {/* <View style={{width:300, height:60, backgroundColor:'blue'}}></View> */}
                <Text style={[title, this.props.styles.modalTitle]}>
                  Ingredients
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this._panel.hide();
                  }}
                >
                  {/* <AntDesign name="arrowdown" size={30} color="black" /> */}
                </TouchableOpacity>
              </View>
              {this.props.store.getIngredients().map((ingredient) => (
                <Text style={this.props.styles.text}>{ingredient}</Text>
              ))}
            </View>
            <View style={this.props.styles.buttonContainer}>
              <SolidButton
                color={green}
                style={{ width: "100%" }}
                onPress={() => {
                  this.props.store.setStopPrediction(true);
                  this.props.storeData(
                    "ingredientList",
                    this.props.store.getIngredients()
                  );
                }}
                labelStyle={{ color: "white", fontSize: 16 }}
                text={`Find Recipes`}
              />
            </View>
          </View>
        </SlidingUpPanel>
      </View>
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
});