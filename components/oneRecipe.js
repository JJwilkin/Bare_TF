import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, ImageBackground, BackHandler, Dimensions, FlatList, Linking } from "react-native";
import { Provider as PaperProvider, Text, IconButton, Snackbar } from "react-native-paper";
import AsyncStorage from '@react-native-community/async-storage';

import { apiKeys } from "../config/constants";
import { global, view, subtitle, chip, padding, grey, darkGrey, green, spaceBetweenView, elevation, overlay, mainContainer, borderRadius, yellow, purple, blue, text, red } from "../styles";

export default function oneRecipe({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [doneCheckingKeys, setDoneCheckingKeys] = useState(false);
  const [isError, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState("Added to Favourites");
  const [recipe, setRecipe] = useState([]);
  const [addedToFavs, setAddedToFavs] = useState(false)

  const base = "https://api.spoonacular.com/recipes/";
  const { item } = route.params;

  const removedFromFavsText = "Removed recipe from saved"
  const addedToFavsText = "Saved recipe"
  const errorText = "Oh No! Something went wrong."

  let index = 0;
  let success = false;

  const url = base + item.id + "/information" + "?apiKey=";

  useEffect(() => {
    getRecipes();
    setIsFavIcon();

    BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.goBack();
      return true;
    });
  }, []);

  const getRecipes = () => {
    if (doneCheckingKeys) return;
    fetch(url + apiKeys[index])
      .then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          success = true;
          setRecipe(json);
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
          setDoneCheckingKeys(true);
        } else {
          if (index < apiKeys.length) {
            getRecipes();
          } else {
            setLoading(false);
            setDoneCheckingKeys(true);
          }
        }
      });
  };

  const setIsFavIcon = async () => {
    const value = await AsyncStorage.getItem(item.title.toString());
    setAddedToFavs(!!value);
  }

  function displaySnackbar (text) {
    setVisible(true)
    setSnackBarText(text);
  }

  useEffect(() => {
    setTimeout(function () {
      if (visible) {
        setVisible(false);
      }
    }, 1500);
  }, [visible]);

  async function addToFavs() {
    const prevAddedToFavs = addedToFavs
    const recipeTitle = item.title.toString()

    const value = await AsyncStorage.getItem(recipeTitle);

    if (!prevAddedToFavs && (!value || value == null)) {
      try {
        await AsyncStorage.setItem(recipeTitle, JSON.stringify(item))
        displaySnackbar(addedToFavsText)
      } catch {
        displaySnackbar(errorText)
      }
    } else if (prevAddedToFavs && value) {
      try {
        await AsyncStorage.removeItem(recipeTitle)
        displaySnackbar(removedFromFavsText)
      } catch {
        displaySnackbar(errorText)
      }
    }

    setIsFavIcon();
  }

  if (isLoading) {
    return (
      <View style={styles.viewCenter}>
        {/* //TO DO: Loading view */}
      </View>
    );
  } else {
    if (isError) {
      return (
        <PaperProvider theme={global}>
          <View style={styles.spaceBetweenView}>
            {/* TO DO: ERROR */}
          </View>
        </PaperProvider>
      );
    } else {
      return (
        <PaperProvider theme={global}>
          <View style={styles.view}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.imageContainer}>
                <ImageBackground
                  style={styles.imageBackground}
                  source={{ uri: recipe.image }}
                  resizeMode="cover"
                >
                  <View style={styles.overlay}></View>
                    <IconButton
                      onPress={() => navigation.goBack()}
                      icon="keyboard-backspace"
                      color="white"
                      size={36}
                      style={styles.backIcon}
                    />
                    <View style={styles.headerRow}>
                      <Text
                        style={[
                          styles.title,
                          item.title.length > 24 ? styles.smaller : styles.none,
                        ]}
                      >
                      {recipe.title}
                      </Text>
                      <IconButton
                        id="favIcon"
                        onPress={() => addToFavs()}
                        icon="heart"
                        color={addedToFavs ? red : "white"}
                        size={30}
                        style={styles.backIcon}
                      />
                    </View>
                </ImageBackground>
              </View>
              <View style={styles.mainContainer}>
                <View style={styles.infoSection}>
                  <View style={[styles.littleCard, {marginRight: 10}]}>
                    <Text style={[styles.littleCardText, {color: green, fontSize: 24}]}>{recipe.readyInMinutes}</Text>
                    <Text style={[styles.littleCardText, {color: darkGrey}]}>min to prep</Text>
                  </View>
                  <View style={styles.littleCard}>
                    <Text style={[styles.littleCardText, {color: yellow, fontSize: 24}]}>{recipe.extendedIngredients.length}</Text>
                    <Text style={[styles.littleCardText, {color: darkGrey}]}>ingredients</Text>
                  </View>
                </View>
                <View style={styles.infoSection}>
                  <View style={[styles.littleCard, {marginRight: 10}]}>
                    <Text style={[styles.littleCardText, {color: purple, fontSize: 24}]}>{recipe.servings}</Text>
                    <Text style={[styles.littleCardText, {color: darkGrey}]}>servings</Text>
                  </View>
                  <View style={styles.littleCard}>
                    <Text style={[styles.littleCardText, {color: blue, fontSize: 24}]}>{recipe.cookingMinutes}</Text>
                    <Text style={[styles.littleCardText, {color: darkGrey}]}>min to cook</Text>
                  </View>
                </View>
                <Text style={styles.subtitle}>Ingredients</Text>
                <FlatList
                  data={recipe.extendedIngredients}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.ingredient}>
                      <Text style={styles.ingredientName}>{item.name}</Text>
                      <Text style={styles.ingredientAmount}>
                        {item.measures.us.amount} {item.measures.us.unitShort}
                      </Text>
                    </View>
                  )}
                />
                <Text style={styles.subtitle}>Recipe</Text>
              {(() => {
                if (recipe.analyzedInstructions.length > 0) {
                  return (
                    <View>
                      <FlatList
                        style={styles.list}
                        data={recipe.analyzedInstructions[0].steps}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                          <View style={styles.recipeStep}>
                            <View style={styles.stepNumberContainer}>
                              <Text style={styles.stepNumber}>
                                {item.number}
                              </Text>
                            </View>
                            <Text style={styles.instructions}>{item.step}</Text>
                          </View>
                        )}
                      />
                    </View>
                  );
                } else {
                  const url = recipe.sourceUrl;
                  return (
                    <View style={styles.padding}>
                      <View style={styles.recipeStep}>
                        <Text>
                          Please visit the following site to view the full list
                          of steps. Click the link below to get cooking:{" "}
                        </Text>
                      </View>
                      <Text
                        style={styles.link}
                        onPress={() => {
                          Linking.openURL(url);
                        }}
                      >
                        View full recipe &#8250;
                      </Text>
                    </View>
                  );
                }
              })()}
              </View>
              
              {/* 
              {(() => {
                if (!fromSavedPage) {
                  return (
                    <View style={styles.buttonContainer}>
                      <SolidButton
                        color={green}
                        flex={1}
                        text="Add to Favourites"
                        onPress={() => {
                          saveRecipe(recipe);
                        }}
                      ></SolidButton>
                    </View>
                  );
                }
              })()} */}
            </ScrollView>
            <View style={styles.snackbarView}>
              <Snackbar
                visible={visible}
                duration={1500}
                onDismiss={() => setVisible(false)}
                wrapperStyle={styles.snackbarContainer}
                style={styles.snackbar}
                action={
                  {
                    // label: 'Undo',
                    // onPress: () => {}
                  }
                }
              >
                {snackBarText}
              </Snackbar>
            </View>
          </View>
        </PaperProvider>
      );
    }
  }
}

const styles = StyleSheet.create({
  imageBackground: {
    height: 250,
    width: Dimensions.get("window").width,
    overflow: "hidden",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: elevation,
    justifyContent: "space-between",
    padding: 20,
  },
  overlay: {
    height: 250,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: overlay,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  imageContainer: {
    height: 250,
    justifyContent: "space-between"
  },
  title: {
    ...subtitle,
    color: "white",
    flexWrap: "wrap",
    fontSize: 30,
    maxWidth: '80%'
  },
  backIcon: {
    margin: 0,
    padding: 0
  },
  mainContainer: {
    ...mainContainer,
    paddingTop: 20
  },
  infoSection: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",

  },
  littleCard: {
    elevation: 25,
    backgroundColor: "white",
    borderRadius: borderRadius,
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  littleCardText: {
    fontFamily: "SF-Semibold",
    fontSize: 18
  },
  subtitle: {
    ...subtitle,
    marginTop: 20,
    marginBottom: 20
  },
  ingredient: {
    ...chip,
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: grey,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  ingredientName: {
    ...text,
    paddingLeft: 6,
    paddingVertical: 4,
  },
  ingredientAmount: {
    ...text,
    color: green,
    paddingRight: 6,
    fontFamily: "SF-Medium"
  },
  recipeStep: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  stepNumberContainer: {
    backgroundColor: grey,
    width: 40,
    height: 40,
    borderRadius: 35 / 2,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
  },
  stepNumber: {
    ...chip,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginBottom: 0,
    fontSize: 18,
    backgroundColor: "transparent",
  },
  instructions: {
    fontSize: 18,
    flex: 1,
    flexWrap: "wrap",
  },




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
  spaceBetweenView: {
    ...spaceBetweenView,
  },

  smaller: {
    fontSize: 24,
  },


  padding: {
    ...padding,
  },
  row: {
    flexDirection: "row",
  },



  time: {
    ...subtitle,
    color: "white",
  },
  info: {
    fontFamily: "SF-Medium",
    color: "white",
    fontSize: 18,
  },

 

  link: {
    color: green,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    justifyContent: "center",
    flexDirection: "row",
  },
  snackbarView: {
    position: "relative",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  snackbarContainer: {
    backgroundColor: "#303030",
    padding: 0,
    borderRadius: 10,
    color: "white",
    marginVertical: 10,
  },
  snackbar: {
    backgroundColor: "#303030",
    margin: 0,
  },
});
