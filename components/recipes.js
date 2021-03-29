import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Dimensions, TouchableWithoutFeedback, Image, ImageBackground } from "react-native";
import { Provider as PaperProvider, Text, ActivityIndicator } from "react-native-paper";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import LottieView from "lottie-react-native";

import oneRecipe from "./oneRecipe.js";
import SolidButton from "./buttons/solidButton.js";
import EmptyPage from "./empty.js";
import CardComponent from "./cardComponent.js"
import CardTextComponent from "./cardTextComponent.js";

import { apiKeys } from "../config/constants";
import { global, view, title, subtitle, overlay, flexView, grey, darkGrey, mainContainer, lightGrey } from "../styles";
import { useIsFocused } from "@react-navigation/native"; // TEMP

const windowWidth = Dimensions.get("window").width;

const Stack = createStackNavigator();
export default function RecipesTab() {
  return (
    <Stack.Navigator
      mode="card"
      initialRouteName="Recipes"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Recipes"
        component={Recipes}
        options={{
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="oneRecipe"
        component={oneRecipe}
        options={{
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
}

function Recipes({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [isError, setError] = useState(false);
  const [foodItems, setFoodItems] = useState(["apple", "banana", "flour"]);

  const base = "https://api.spoonacular.com/recipes/findByIngredients";
  let index = 0;
  let success = false;

  useEffect(() => {
    if (foodItems.length === 0) {
      setLoading(true);
    }
    if (route.params && route.params.foodItems) {
      setFoodItems(route.params.foodItems);
      let currentFoodItems = route.params.foodItems;

      setLoading(true);
      let baseUrl = base + "?ingredients=" + currentFoodItems.join(", ") + "&apiKey=";
      getRecipes(baseUrl);
    }
  }, [route.params]);

  const getRecipes = (url) => {
    fetch(url + apiKeys[index])
      .then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          success = true;
          setRecipes(json);
          setError(false);
        } else {
          index++;

          if (!index < apiKeys.length) {
            setError(true);
          }
        }
      })
      .finally(() => {
        if (success) {
          setLoading(false);
        } else {
          if (index < apiKeys.length) {
            getRecipes(url);
          } else {
            setLoading(false);
          }
        }
      });
  };

  // const isFocused = useIsFocused()
  // useEffect(() => {
  //   getRecipes(base + "?ingredients=" + foodItems.join(", ") + "&apiKey=")
  // }, [isFocused])
  
  if (foodItems.length === 0) {
    return (
      <PaperProvider theme={global}>
        <View style={styles.mainContainer}>
          <View>
            <EmptyPage 
              title="Hamburger" 
              subtitle="hello this is subtitle omg hello this is  omg hello this is subtitle omg" 
              imageUri="https://food.fnr.sndimg.com/content/dam/images/food/fullset/2004/2/25/0/bw2b07_hambugers1.jpg.rend.hgtvcom.616.462.suffix/1558017418187.jpeg"
            />
          </View>
          {/* onPress={() => navigation.navigate("Camera")} */}
        </View>
      </PaperProvider>
    );
  } else {
    if (isLoading) {
      return (
        <View>
        
        </View>
        //TO DO: ADD LOADING VIEW
      );
    } else if (isError) {
     return (
      <PaperProvider theme={global}>
        <View style={styles.mainContainer}>
          <View>
           {/* TO DO: ERROR CARD */}
          </View>
          {/* onPress={() => navigation.navigate("Camera")} */}
        </View>
      </PaperProvider>
    );
    } else {
      return (
        <PaperProvider theme={global}>
          <View style={styles.view}>
            <View style={styles.flexView}>
              <FlatList
                contentContainerStyle={styles.recipesContainer}
                showsHorizontalScrollIndicator={false}
                snapToInterval={Dimensions.get("window").width - 52 + 18}
                snapToAlignment={"center"}
                decelerationRate={0.8}
                horizontal={true}
                scrollEnabled={true}
                data={recipes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={(item) => _renderItem(item, navigation)}
              />
            </View>
          </View>
        </PaperProvider>
      );
    }
  }

  function _renderItem({ item }, navigation) {
    return (
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate("oneRecipe", { item: item })}
      >
        <View style={styles.recipesItem}>
          <CardTextComponent
            imageUri={item.image}
            title={item.title}
            subtitle={`Your Ingredients: ${item.usedIngredientCount}`}
            showFavs={true}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
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
