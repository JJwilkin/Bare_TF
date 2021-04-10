import React from "react";
import { View, Text, StyleSheet } from "react-native"; 

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"

import Ingredients from './Ingredients';
import Recipes from "./recipes";
import oneRecipe from "./oneRecipe";

import { medGrey, lightGrey, title, mainContainer, padding } from "../styles";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

export default function Home({rootTabNavigation}) {
  return(
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        // component={HomeWrapper}
        children={() => (
          <HomeWrapper
            rootTabNavigation={rootTabNavigation}
          />
        )}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="oneRecipe"
        component={oneRecipe}
        options={{
          gestureDirection: "horizontal",
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>  
  )
}

function HomeWrapper({rootTabNavigation}) {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Home</Text>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: "black",
          inactiveTintColor: medGrey,
          labelStyle: styles.tabLabel,
          style: styles.tabBar,
          indicatorStyle: styles.indicator,
          tabStyle: styles.tabItem,
          scrollEnabled: false,
        }}
      >
        <Tab.Screen
          name="Ingredients"
          // component={Ingredients}
          children={() => (
            <Ingredients
              rootTabNavigation={rootTabNavigation}
            />
          )}
        />
        <Tab.Screen name="Recipes" component={Recipes} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    ...mainContainer,
    paddingHorizontal: 0,
    flex: 1,
    backgroundColor: lightGrey,
  },
  title: {
    ...title,
    marginBottom: 10,
    paddingHorizontal: padding
  },
  tabBar: {
    backgroundColor: "transparent",
    marginBottom: 20,
    width: '70%',
    marginHorizontal: padding 
  },
  tabLabel: {
    fontSize: 19,
    margin: 0,
    padding: 0,
    fontFamily: "SF-Medium",
    textTransform: "lowercase",
    textTransform: "capitalize",
  },
  tabItem: {
    padding: 0,
    alignItems: "flex-start",

  },
  indicator: {
    backgroundColor:'black',
    width: '18%',
    height: 3,
  }
});