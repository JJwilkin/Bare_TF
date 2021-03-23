import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { Text } from 'react-native';

//Components
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
  const [fontsLoaded, setFontsLoaded] = useState(false);

  SplashScreen.preventAutoHideAsync() // TO DO: HANDLE THEN AND CATCH
  .then(result => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
  .catch(console.warn);

  useEffect(async() => {
    await loadFonts();
    setFontsLoaded(true);
  }, [])

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [fontsLoaded])
  
  return (
    <TabNav></TabNav>
  );  
}