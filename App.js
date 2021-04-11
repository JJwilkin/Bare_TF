import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { StyleSheet, Text, View, Dimensions, Button} from 'react-native';
import LottieView from "lottie-react-native";
import { global, view, title, subtitle, chip, padding, grey, darkGrey, green, spaceBetweenView } from "./styles";
//Components
import GlobalState from './GlobalState';
import { TabNav } from './components/nav'
import * as SplashScreen from 'expo-splash-screen';

const loadFonts = () => Font.loadAsync({
  'SF-Heavy': require('./assets/fonts/SF-Heavy.otf'),
  'SF-Bold': require('./assets/fonts/SF-Bold.otf'),
  'SF-Semibold': require('./assets/fonts/SF-Semibold.otf'),
  'SF-Regular': require('./assets/fonts/SF-Regular.otf'),
  'SF-Medium': require('./assets/fonts/SF-Medium.otf'),
  'SF-Light': require('./assets/fonts/SF-Light.otf'),
  'SF-Thin': require('./assets/fonts/SF-Thin.otf')
})

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [mobileNet, setMobileNet] = useState(null);
  const store = new GlobalState();

 

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
        await SplashScreen.preventAutoHideAsync();
        
        
       
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    async function loadMobileNet () {
      await tf.ready();
      setMobileNet(await mobilenet.load());
      console.log('mobilenet loaded')
    }
    async function check() {
      if (appIsReady) {
        await SplashScreen.hideAsync();
        await loadMobileNet();
      } else {
        return null;
      }
    }
    
    check()
  }, [appIsReady]);

  useEffect(() => {
   
  },[])

  

    if (!appIsReady) {
      return null;
    } else if (!mobileNet) {
    return (
      <View style={styles.viewCenter}>
        <LottieView
          style={{ width: windowWidth * 0.75, height: windowWidth * 0.75 }}
          resizeMode="cover"
          source={require("./assets/lottieJson/loading2.json")}
          autoPlay
          loop
        />
        <Text style={[subtitle, { marginVertical: 40 }]}>
          Prepping the Kitchen ...
        </Text>
      </View>
    );
  } 
  return (
    <TabNav store={store} mobileNet={mobileNet}></TabNav>
  ); 
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // paddingTop: 30,
    backgroundColor: '#E8E8E8',
  },
  viewCenter: {
    ...view,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    // margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    zIndex:2
  },
  body: {
    padding: 0,
    zIndex:1
  },
  cameraView: {
    display: 'flex',
    flex:1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    // paddingTop: 10
  },
  camera : {
    width: windowWidth,
    height: windowHeight,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
  translationView: {
    marginTop: 30, 
    padding: 20,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    height: 500
  },
  translationTextField: {
    fontSize:60
  },
  wordTextField: {
    textAlign:'right', 
    fontSize:20, 
    marginBottom: 50
  },
  legendTextField: {
    fontStyle: 'italic',
    color: '#888888'
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'purple',
    borderStyle: 'solid',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#ffffff'
  },
});
