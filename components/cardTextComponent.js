import React, { useRef, useState } from "react";
import { StyleSheet, View, Dimensions, ImageBackground, Text } from "react-native";
import { IconButton} from "react-native-paper";
import { subtitle, text, white, black, darkGrey, elevation, borderRadius, overlay } from "../styles";

const windowWidth = "100%";
const windowHeight = Dimensions.get("window").height * 0.5;

let cardWidth = windowWidth;
let cardHeight = windowHeight;

export default function CardTextComponent(props) {
  const favIcon = useRef(null)
  const [clicked, setClicked] = useState(false)

  cardWidth = props.width ? props.width : windowWidth;
  cardHeight = props.height ? props.height : windowHeight;

  const addToFavs = () => {
    setClicked(!clicked)
  }

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
              color={clicked ? "red" : "white"}
              size={30}
              style={styles.favIcon}
              ref={favIcon}
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