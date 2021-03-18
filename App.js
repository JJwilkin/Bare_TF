import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import { makeObservable, observable, action, computed } from "mobx"
const customModel = require('./model_3.json');
import TextDisplay from './TextDisplay';
// const Tensorset = require('tensorset');

class WordPrediction {
  word = ""
  showPrediction = false
  constructor() {
      makeObservable(this, {
          word: observable,
          toggle: action,
          getWord: computed,
          getShowPrediction: computed,
          prediction: action,
          showPrediction:observable,

      })
  }
  get getWord () {
    // console.log(this.word)
    return this.word
  }
  
  get getShowPrediction () {
    return this.showPrediction;
  }

  toggle(word) {
      this.word = word
      // console.log(word)
  }

  prediction(val) {
    this.showPrediction = val;
  }
}

export default function App() {
  const store = new WordPrediction();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const TensorCamera = cameraWithTensors(Camera);
  //Tensorflow and Permissions
  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [classifier, setClassifier] = useState();
  const [frameworkReady, setFrameworkReady] = useState(false);
  const [predictionFound, setPredictionFound] = useState(false);

  const textureDims = Platform.OS === "ios"? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };
  const tensorDims = { width: 152, height: 200 }; 

  async function load(classifier) {
      //can be change to other source
   
    // console.log(customModel)
    let tensorObj = parse(customModel);
    //covert back to tensor
    // Object.keys(tensorObj).forEach((key) => {
    //   tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1000, 1000])
    // })
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

        // const model = await mobilenet.load()
        // console.log(model)
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
  }, [frameworkReady]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  const loadMobileNetModel = async () => {
    const model = await mobilenet.load();
    return model;
  }

  const renderCameraView = () => {
    return <View style={styles.cameraView}>
                <TensorCamera
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
    // console.log(store.getShowPrediction);
    if ((!store.getShowPrediction) || (!tensor && tensor != null) ) return;

    // setTimeout(()=>{store.prediction(false)},500);
    const activation = mobilenetModel.infer(tensor, 'conv_preds');
          // Get the most likely class and confidence from the classifier module.
      const result = await classifier.predictClass(activation);
      const prediction = `${result.label} ${result.confidences[result.label]}`
      store.toggle(prediction);
    //topk set to 1
    // const prediction = await mobilenetModel.classify(tensor, 1);
    // console.log(`prediction: ${JSON.stringify(prediction)}`);

    // if(!prediction || prediction.length === 0) { return; }
    
    // //only attempt translation when confidence is higher than 20%
    // if(prediction[0].probability > 0.4) {

    //   //stop looping!
    //   // cancelAnimationFrame(requestAnimationFrameId);
    //   // setPredictionFound(true);
    //   // setWord(prediction[0].className);
    //   // store.toggle(prediction[0].className);
    //   // console.log(store.word)
    //   //get translation!
    //   // await getTranslation(prediction[0].className);
    // }
  }

const handleCameraStream = (imageAsTensors) => {
    const loop = async () => {
      
      // if ( Platform.OS !== "ios" && Math.random()*50 % 50 == 1) run = false;
      // else if( Math.random()*7 % 7 == 0 ) { run = false; }
        const nextImageTensor = await imageAsTensors.next().value;
        await getPrediction(nextImageTensor);
        requestAnimationFrameId = requestAnimationFrame(loop);
        // console.log('hi')
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
      {/* <View style={styles.header}>
        <Text style={styles.title}>
          {word}
        </Text>
      </View> */}
      <TextDisplay store={store} styles={styles}/>
      <View style={styles.body}>
        { frameworkReady ? renderCameraView() : <Text styles={styles.title}>Loading</Text> }
      </View>  
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 30,
    backgroundColor: '#E8E8E8',
  },
  header: {
    backgroundColor: '#41005d'
  },
  title: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff'
  },
  body: {
    padding: 5,
    paddingTop: 25
  },
  cameraView: {
    display: 'flex',
    flex:1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    paddingTop: 10
  },
  camera : {
    width: 700/2,
    height: 800/2,
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
