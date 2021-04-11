import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Dimensions, Text, TouchableWithoutFeedback } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native"; // TEMP
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from "lottie-react-native";
import EmptyPage from "./empty.js";
import CardTextComponent from "./cardTextComponent.js";

import { apiKeys } from "../config/constants";
import { global, view, title, subtitle, overlay, flexView, grey, darkGrey, mainContainer, lightGrey, red, white } from "../styles";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function RecipesTab({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [isError, setError] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const isFocused = useIsFocused();

  const base = "https://api.spoonacular.com/recipes/findByIngredients";
  let index = 0;
  let success = false;

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return JSON.parse(jsonValue);
    } catch(e) {
      console.log(e)
    }
  }
  storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    setLoading(true);
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


  useEffect(() => {
    async function getIngredients () {
      const ingredientList = await getData("foodItems");
      console.log(ingredientList)
      getRecipes(base + "?ingredients=" + ingredientList.join(", ") + "&apiKey=")
    }
    getIngredients();
  }, [isFocused]) // TO DO: REMOVE AFTER
  
  if (recipes.length === 0 && !isLoading) {
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
        <View style={styles.lottieContainer}>
           <LottieView
              style={{ width: windowWidth * 0.65, height: windowWidth * 0.65 }}
              resizeMode="cover"
              source={require("./food_loading.json")}
              autoPlay
              loop
            />
        </View>
        
        //TO DO: ADD LOADING VIEW
      );
    } else if (isError) {
     return (
      // <PaperProvider theme={global}>
      //   <View style={styles.mainContainer}>
      //     <View>
      //      {/* TO DO: ERROR CARD */}
      //     </View>
      //     {/* onPress={() => navigation.navigate("Camera")} */}
      //   </View>
      // </PaperProvider>
      <View style={styles.lottieContainer}>
           <LottieView
              style={{ width: windowWidth * 0.65, height: windowWidth * 0.65 }}
              resizeMode="cover"
              source={require("./food_loading.json")}
              autoPlay
              loop
            />
        </View>
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
      <TouchableWithoutFeedback onPress={() => navigation.navigate("oneRecipe", {item: item})}>
        <View style={styles.recipesItem}>
          <CardTextComponent
            imageUri={item.image}
            title={item.title}
            subtitle={`Your Ingredients: ${item.usedIngredientCount}`}
            showFavs={true}
            recipe={item}
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
  lottieContainer: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  view: {
    ...view,
  },
  viewCenter: {
    ...view,
    backgroundColor: lightGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  flexView: {
    ...flexView,
  },
  mainContainer: {
    ...mainContainer,
    paddingHorizontal: 0,
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
    backgroundColor: lightGrey,
  },
  recipesItem: {
    marginLeft: 18,
    marginBottom: 20,
    width: Dimensions.get("window").width - 52,
  },
  ingredientCount: {
    fontSize: 18,
  },
});
