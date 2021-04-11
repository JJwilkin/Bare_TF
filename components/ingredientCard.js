import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Dimensions, Text, TouchableOpacity } from "react-native";
import { medGrey, view, title, subtitle, padding, flexView, grey, darkGrey, mainContainer, lightGrey, text, white } from "../styles";
import { Ionicons } from '@expo/vector-icons';
import getImage from "../helpers/getImageHelper";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ingredientTextSize = windowWidth < 410 ? 17 : 20;

export default function IngredientsCard ({ingredientName="", imageName="", customText=null,  onPress}) {
  const [imageSource, setImageSource] = useState();
  useEffect(()=> {
    
    setImageSource(getImage(imageName));
  }, [ingredientName])

    return (
      <View style={styles.card}>
        <View style={styles.viewCenter}>
          {/* <View style={{width:'100%', justifyContent:'center', alignItems:'center'}}> */}
            <Image
              style={styles.image}
              source={imageSource}
            />
          {/* </View> */}
          <Text style={styles.text}>{customText ? customText : ingredientName}</Text>
        </View>
        {onPress && (
          <TouchableOpacity onPress={onPress} style={styles.topRight}>
            <Ionicons name="remove-circle" size={25} color={medGrey} />
          </TouchableOpacity>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
    emptyImage: {
      marginTop: 0,
      resizeMode: "contain",
      padding: 10,
      width: "80%",
      height: "70%",
    },
    card: {
        width: (windowWidth - (padding*3))*0.5,
        height: (windowWidth - (padding*3))*0.5,
        backgroundColor:'white',
        borderRadius: 23,
        padding: 23,
        marginTop: padding,
        position:'relative',
    },
    topRight:{
      position:'absolute',
      right:11,
      top:11,
    },
    text:{
      ...text,
      textAlign:'center',
      fontSize: ingredientTextSize,
      fontWeight:'600'
    },
    view: {
      ...view,
      backgroundColor: lightGrey,
    },
    viewCenter: {
      justifyContent: "center",
      alignItems: "center",
      width:'100%',
    },
    flexView: {
      ...flexView,
    },
    mainContainer: {
      ...mainContainer,
      paddingHorizontal: 0
    },
    title: {
      ...title,
    },
    subtitle: {
      ...subtitle,
    },
    image: {
      width:'80%',
      height:'75%',
      resizeMode:'contain',
      shadowColor:darkGrey,
      padding:5,
      shadowRadius:2,
      shadowOffset:{height:3, width:0},
      shadowOpacity:0.25,
    },
    chipContainer: {
      backgroundColor: grey,
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginRight: 10,
      marginVertical: 5,
      borderRadius: 7,
    },
    chip: {
      fontSize: 16,
      color: darkGrey,
    },
    row: {
      flexDirection: "column",
      flexGrow: 0,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    recipesContainer: {
      overflow: "scroll",
      backgroundColor: lightGrey
    },
    recipesItem: {
      marginLeft: 18,
      marginBottom: 20,
      width: Dimensions.get("window").width - 52
    },
    ingredientCount: {
      fontSize: 18,
    },
  });
  