import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Button} from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import { makeObservable, observable, action, computed } from "mobx"
import CameraOverlay from './CameraOverlay';
import * as Font from 'expo-font';
import { Audio } from 'expo-av';
//Components
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
const customModel = require('./model_3.json');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class WordPrediction {
  word = ""
  lastWord = ""
  showPrediction = false
  stopPredicting = false
  shouldBounce = false
  ingredientList = []
  constructor() {
      makeObservable(this, {
          word: observable,
          // getWord: computed,
          getShowPrediction: computed,
          prediction: action,
          showPrediction:observable,

      })
  }
  getWord () {
    return this.word;
  }

  getLastWord () {
    return this.lastWord;
  }

  getShouldBounce () {
    return this.shouldBounce;
  }
  
  get getShowPrediction () {
    return this.showPrediction;
  }

  setWord(word) {
      this.word = word;
  }

  setShouldBounce(val) {
    this.shouldBounce = val;
  }

  setLast(lastWord) {
    this.lastWord = lastWord;
}

  prediction(val) {
    this.showPrediction = val;
  }

  setStopPrediction(val) {
    this.stopPredicting = val;
  }

  getIngredients() {
    return this.ingredientList;
  }

  addIngredient(val) {
    if (!this.ingredientList.includes(val)){
      this.ingredientList.unshift(val);
    }
  }

  removeIngredient(val) {
    const index = this.ingredientList.indexOf(val);
    if (index > -1) {
      this.ingredientList.splice(index, 1);
    }
  }
  
}

export default function ImageClassificationCamera() {
  const cameraRef = useRef();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const store = new WordPrediction();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const TensorCamera = cameraWithTensors(Camera);
  //Tensorflow and Permissions
  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [classifier, setClassifier] = useState();
  const [frameworkReady, setFrameworkReady] = useState(false);
  const [predictionFound, setPredictionFound] = useState(false);
  const [sound, setSound] = useState();

  const handleViewRef = useRef();
  const bounce = () => handleViewRef.current.bounce(1750).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
  const textureDims = Platform.OS === "ios"? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };
  const tensorDims = { width: 152, height: 200 }; 

  SplashScreen.preventAutoHideAsync() // TO DO: HANDLE THEN AND CATCH
  .then(result => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
  .catch(console.warn);

  const takePicture = async () => {
    cameraRef.current.camera.takePictureAsync().then(result => {
      console.log('picture taken')
    });
  };

  async function load(classifier) {
    let tensorObj = parse(customModel);
    await classifier.setClassifierDataset(tensorObj);
  }

  function parse (rawData) {
    let data = JSON.parse(rawData);
    const dataset = {};
    for (const example of data) {
        dataset[example.label] = tf.tensor(example.values, example.shape);
    }
    return dataset;
}

  let requestAnimationFrameId = 0;
  useEffect(() => {
    if(!frameworkReady) {
      (async () => {
        
        //check permissions
        const { status } = await Camera.requestPermissionsAsync();
        console.log(`permissions status: ${status}`);
        setHasPermission(status === 'granted');

        //we must always wait for the Tensorflow API to be ready before any TF operation...
        await tf.ready();

        //load the mobilenet model and save it in state
        setMobilenetModel(await loadMobileNetModel());
        let classifier = knnClassifier.create();
        await load(classifier);
        // let existingJson = await (await fetch('./model.json')).json()
        // if (existingJson) {
        //   let dataset = await Tensorset.parse(existingJson);
        //   classifier.setClassifierDataset(dataset);
        //   let classes = Object.keys(classifier.getClassExampleCount());
        //   console.log(classes);
        // }
        setClassifier(classifier);
        setFrameworkReady(true);

      })();
    }
  }, []);

  useEffect(() => {
    (async () => {
    await loadFonts();
    setFontsLoaded(true);
    })();
  }, [])

  useEffect(()=> {
    (async () => {
      const {sound} = await Audio.Sound.createAsync(
        require('./assets/chime.mp3')
      )
      setSound(sound);
    })();
  }, [])

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [fontsLoaded])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  const playSound = async () => {
    console.log('playing')
    sound.setPositionAsync(0);
    await sound.playAsync(); 
  }

  const loadMobileNetModel = async () => {
    const model = await mobilenet.load();
    return model;
  }

  const renderCameraView = () => {
    return <View style={styles.cameraView}>
                <TensorCamera
                  ref={cameraRef}
                  style={styles.camera}
                  type={Camera.Constants.Type.back}
                  zoom={0}
                  cameraTextureHeight={textureDims.height}
                  cameraTextureWidth={textureDims.width}
                  resizeHeight={tensorDims.height}
                  resizeWidth={tensorDims.width}
                  resizeDepth={3}
                  onReady={handleCameraStream}
                  autorender={true}
                />
                
            </View>;
  }

  const getPrediction = async (tensor) => {
    if ((store.stopPredicting) || (!store.getShowPrediction) || (!tensor && tensor != null) ) return;

    const activation = mobilenetModel.infer(tensor, 'conv_preds');
    // Get the most likely class and confidence from the classifier module.
      const result = await classifier.predictClass(activation);
      const prediction = `${result.label} ${result.confidences[result.label]}`
      if (result.confidences[result.label] > 0.8) {
        if (!store.ingredientList.includes(result.label)){
          bounce();
          // colorShift();
          await playSound();
          store.setLast(result.label);
        }
        store.setWord(prediction);
        store.addIngredient(result.label);
        
      }
      else {
        store.setWord("Scanning...")
      }
  }

const handleCameraStream = (imageAsTensors) => {
    const loop = async () => {
        const nextImageTensor = await imageAsTensors.next().value;
        await getPrediction(nextImageTensor);
        requestAnimationFrameId = requestAnimationFrame(loop);
        nextImageTensor.dispose();
      }
    if(!predictionFound) loop();
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        { frameworkReady ? renderCameraView() : <Text styles={styles.title}>Loading</Text> }
      </View>  
      
      <CameraOverlay store={store} styleSheet={styles} handleViewRef={handleViewRef} takePicture={takePicture} frameworkReady={frameworkReady}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // paddingTop: 30,
    backgroundColor: '#E8E8E8',
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
