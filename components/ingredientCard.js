import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Dimensions, Text, TouchableOpacity } from "react-native";
import { medGrey, view, title, subtitle, padding, flexView, grey, darkGrey, mainContainer, lightGrey, text, white } from "../styles";
import { Ionicons } from '@expo/vector-icons';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function IngredientsCard ({children, onPress}) {
    return (
      <View style={styles.card}>
        <View style={styles.viewCenter}>
          <Image
            style={styles.image}
            source={require("../assets/foodPictures/lemon.png")}
          />
          <Text style={styles.text}>{children}</Text>
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
        backgroundColor:lightGrey,
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
      fontSize:22,
      fontWeight:'600'
    },
    view: {
      ...view,
      backgroundColor: lightGrey,
    },
    viewCenter: {
      justifyContent: "center",
      alignItems: "center",
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
      width:'75%',
      resizeMode:'contain',
      shadowColor:darkGrey,
      shadowRadius:5,
      shadowOffset:{height:3, width:0},
      shadowOpacity:0.2,
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
  