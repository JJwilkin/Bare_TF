import React, { useState, useEffect } from "react";
import { StyleSheet, View, Platform, Dimensions, Text, TouchableOpacity, LayoutAnimation, UIManager } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native"; 

import EmptyPage from "./empty.js";
import CardTextComponent from "./cardTextComponent.js";
import IngredientsCard from './ingredientCard';
import AsyncStorage from '@react-native-community/async-storage';

import { apiKeys } from "../config/constants";
import { global, view, title, subtitle, overlay, flexView, grey, darkGrey, mainContainer, lightGrey, red, white, padding } from "../styles";
import { ScrollView } from "react-native-gesture-handler";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const layoutAnimConfig = {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut, 
    },
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

export default function IngredientsTab({ route, rootTabNavigation }) {
    const isFocused = useIsFocused();
    const [ingredients, setIngredients] = useState([])

    const getData = async (key) => {
        try {
          const jsonValue = await AsyncStorage.getItem(key)
          return JSON.parse(jsonValue);
        } catch(e) {
          console.log(e)
        }
    }

    const storeData = async (key, value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
          console.log(e)
        }
      };
    const removeFoodItem = (foodItem) => {
        const ingredientsTemp = ingredients.filter(function(food) {
            return foodItem !== food
          })
        setIngredients(ingredientsTemp);
        LayoutAnimation.configureNext(layoutAnimConfig)
        storeData("foodItems", ingredientsTemp)
    }

    useEffect(()=> {
        if (isFocused) {
            async function getIngredients() {
                setIngredients(await getData("foodItems"));
            }
            getIngredients();
        }
    }, [isFocused]);
    return (
    <PaperProvider theme={global}>
        <View style={styles.view}>
            <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
                <View style={styles.cardContainer}>
                    <TouchableOpacity onPress={() => rootTabNavigation.navigate('Camera')}>
                        <IngredientsCard key={"Add"} >Add</IngredientsCard>
                    </TouchableOpacity>
                    {ingredients.map((foodItem) => (
                        <IngredientsCard key={foodItem} onPress={() => removeFoodItem(foodItem)}>{foodItem}</IngredientsCard>
                    )) 
                    }
                </View>    
            </ScrollView>         
        </View>
    </PaperProvider>
    )
}

const styles = StyleSheet.create({
  emptyImage: {
    marginTop: 0,
    resizeMode: "contain",
    padding: 10,
    width: "80%",
    height: "70%",
  },
  view: {
    ...view,
    backgroundColor: lightGrey,
    
  },
  cardContainer: {
    width: windowWidth,
    paddingHorizontal:padding,
    flexWrap:'wrap',
    display:'flex',
    justifyContent:'space-between',
    flexDirection: 'row',
    marginBottom:padding,
    shadowColor:darkGrey,
    shadowRadius:4,
    shadowOffset:{height:3, width:0},
    shadowOpacity:0.2
  },
  viewCenter: {
    ...view,
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
  name: {
    ...subtitle,
    color: "white",
    marginVertical: 20,
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
