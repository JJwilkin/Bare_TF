import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
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



export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [mobileNet, setMobileNet] = useState();
  const store = new GlobalState();

  useEffect(() => {
    async function loadMobileNet () {
      await tf.ready();
      setMobileNet(await mobilenet.load());
      console.log('mobilenet loaded')
    }
    loadMobileNet();
  },[])

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadFonts();
       
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    async function check() {
      if (appIsReady) {
        await SplashScreen.hideAsync();
      } else {
        return null;
      }
    }
    
    check()
  }, [appIsReady]);

  

  if (!appIsReady ) {
    return null;
  } 
  return (
    <TabNav store={store} mobileNet={mobileNet}></TabNav>
  ); 
}