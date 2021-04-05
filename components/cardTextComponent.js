import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, ImageBackground, Text } from "react-native";
import { IconButton} from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage"
import { subtitle, text, white, black, darkGrey, elevation, borderRadius, overlay, red } from "../styles";

const windowWidth = "100%";
const windowHeight = Dimensions.get("window").height * 0.5;

let cardWidth = windowWidth;
let cardHeight = windowHeight;

export default function CardTextComponent(props) {
  const [clicked, setClicked] = useState(false);
  const [addedToFavs, setAddedToFavs] = useState(false);
  const item = props.recipe;

  let index = 0;
  let success = false;
  // const url = "https://api.spoonacular.com/recipes/" + itemId + "/information" + "?apiKey=";

  cardWidth = props.width ? props.width : windowWidth;
  cardHeight = props.height ? props.height : windowHeight;

  useEffect(() => {
    async function checkIsFav(title) {
      await AsyncStorage.getItem(title)
      .then((response) => {
        if (response) {
          setAddedToFavs(true)
        } 
      })
    }

    checkIsFav(props.title)
  }, [])

  async function addToFavs() {
    const prevAddedToFavs = addedToFavs
    const recipeTitle = props.title.toString()

    const value = await AsyncStorage.getItem(recipeTitle);

    if (!prevAddedToFavs && (!value || value == null)) {
      try {
        // const recipe = await getRecipe();
        await AsyncStorage.setItem(recipeTitle, JSON.stringify(item))
        setAddedToFavs(!addedToFavs);
      } catch {
        console.log("error")
      }
    } else if (prevAddedToFavs && value) {
      try {
        await AsyncStorage.removeItem(recipeTitle)
        setAddedToFavs(!addedToFavs);
      } catch {
        console.log("error")
      }
    }
  }

  const getRecipe = () => {
    if (doneCheckingKeys) return;
    fetch(url + apiKeys[index])
      .then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          success = true;
          console.log("error")// TO DO : ERROR HANDLING
          return json;
        } else {
          index++;

          if (!index < apiKeys.length) {
            console.log("error") // TO DO : ERROR HANDLING
          }
        }
      })
      .finally(() => {
        if (success) {
          console.log("done"); // TO DO: ??
        } else {
          if (index < apiKeys.length) {
            getRecipe();
          }
        }
      });
  };

  return (
    <View style={styles.cardContainer}>
      <ImageBackground
        style={styles.imageBackground}
        imageStyle={styles.imageBackgroundContainer}
        source={{ uri: props.imageUri }}
        resizeMode="cover"
      >
        <View style={styles.darken}>
          { props.showFavs ? (
            <IconButton
              onPress={() => addToFavs()}
              icon="heart"
              color={addedToFavs ? red : white}
              size={30}
              style={styles.favIcon}
            />
          ) : null }
          <View style={styles.overlay}>
            <View style={styles.firstRow}>
              <Text style={props.showFavs ? [styles.title, styles.spaced] : styles.title}>
                { (props.title.length > 40) ? props.title.substring(0, 40) + "..." : props.title }
              </Text>
            </View>
            <Text style={styles.subtitle}>{props.subtitle}</Text>
            { props.buttonText ? (
              <Text style={styles.textButton}>View &#8250;</Text>
            ) : null }
          </View>
        </View>
      </ImageBackground>
    </View> 
  );
}

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    borderRadius: borderRadius
  },
  imageBackground: {
    borderRadius: borderRadius,
    justifyContent: "flex-end",
    height: cardHeight,
    elevation: elevation,
  },
  overlay: {
    height: cardHeight * 0.35,
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    padding: 20, 
    position: "absolute",
    justifyContent: "flex-start",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: white,
  },
  darken: {
    borderRadius: borderRadius,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  firstRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  favIcon: {
    margin: 0,
    position: "absolute",
    right: 12,
    top: 12,
    marginLeft: 20
  },
  title: {
    ...subtitle,
    color: black,
    fontSize: 22
  },
  subtitle: {
    ...text,
    fontFamily: "SF-Medium",
    color: darkGrey,
    fontSize: 18
  },
  textButton: {
    fontFamily: "SF-Semibold",
    fontSize: 16,
    color: darkGrey,
    marginTop: 8
  }
});