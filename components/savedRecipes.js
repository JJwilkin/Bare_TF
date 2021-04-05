import React, { useState, useEffect } from "react";
import {StyleSheet, View, FlatList, BackHandler } from "react-native";
import { Provider as PaperProvider, Text, ActivityIndicator} from "react-native-paper";
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import oneRecipe from "./oneRecipe.js";
import CardComponent from "./cardComponent.js";
import EmptyPage from "./empty";

import {global, title, green, mainContainer } from "../styles";

const Stack = createStackNavigator();

export default function SavedTab() {
  return (
    <Stack.Navigator
      mode="card"
      initialRouteName="savedRecipes"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="oneRecipe"
        component={oneRecipe}
        options={{
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="savedRecipes"
        component={savedRecipes}
        options={{
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
}

function savedRecipes({ navigation }) {
  const [empty, setEmpty] = useState(true);
  const [isLoading, setLoading] = useState(true);
  // const [isSet, set] = useState(false);
  const [saved, setSaved] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    getSaved();
    BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
  }, [isFocused]);

  async function getSaved() {
    const allSavedRecipes = [];

    try {
      const recipeTitles = await AsyncStorage.getAllKeys();
      if (recipeTitles.length == 0) {
        setEmpty(true);
      } else {
        setEmpty(false);
        for (const title of recipeTitles) {
          const recipe = JSON.parse(await AsyncStorage.getItem(title));
          allSavedRecipes.push(recipe);
        }
        setSaved(allSavedRecipes);
      }
    } catch (e) {
      console.log(e) // TO DO: Error handling
    }
    setLoading(false);
  }

  if (isLoading) {
    return (
      <View style={styles.viewCenter}>
        <ActivityIndicator color={green} size="large" />
      </View>
    );
  } else {
    if (empty) {
      return (
        <PaperProvider theme={global}>
          <View style={styles.mainContainer}>
            <Text style={styles.title}>Saved</Text>
            <EmptyPage
              imageUri="https://food.fnr.sndimg.com/content/dam/images/food/fullset/2004/2/25/0/bw2b07_hambugers1.jpg.rend.hgtvcom.616.462.suffix/1558017418187.jpeg"
              title="No saved recipes yet."
              subtitle="Filler text, filler text, filler text"
              onPress={() => navigation.navigate("Camera")}
            />
          </View>
        </PaperProvider>
      );
    } else {
      return (
        <PaperProvider theme={global}>
          <View style={styles.mainContainer}>
            <Text style={styles.title}>Saved</Text>
            <FlatList
              contentContainerStyle={styles.recipesContainer}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              snapToAlignment={"center"}
              scrollEnabled={true}
              data={saved}
              renderItem={(item) => _renderItem(item, navigation)}
            />
          </View>
        </PaperProvider>
      );
    }
  }

  function _renderItem({ item }, navigation) {
    return (
      <View>
        <CardComponent 
          imageUri={item.image}
          height={180}
          title={item.title}
          titleSize={25}
          subtitle={`${item.missedIngredientCount + item.usedIngredientCount + item.unusedIngredients.length} ingredients · ${item.readyInMinutes ? item.readyInMinutes : 30} mins`}
          onPress={() =>
            navigation.navigate("oneRecipe", {item: item})
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    ...mainContainer,
  },
  title: {
    ...title,
  },
  recipesItem: {
    paddingRight: 18,
    marginBottom: 20,
  }
});
