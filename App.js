import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const TensorCamera = cameraWithTensors(Camera);
  //Tensorflow and Permissions
  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [frameworkReady, setFrameworkReady] = useState(false);
  const [predictionFound, setPredictionFound] = useState(false);

  const textureDims = Platform.OS === "ios"? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };
  const tensorDims = { width: 152, height: 200 }; 

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
        // setMobilenetModel(await loadMobileNetModel());

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
    if (!tensor && tensor != null && !store.getShowPrediction) return;
   
    //topk set to 1
    const prediction = await mobilenetModel.classify(tensor, 1);
    console.log(`prediction: ${JSON.stringify(prediction)}`);

    if(!prediction || prediction.length === 0) { return; }
    
    //only attempt translation when confidence is higher than 20%
    if(prediction[0].probability > 0.4) {

      //stop looping!
      // cancelAnimationFrame(requestAnimationFrameId);
      // setPredictionFound(true);
      // setWord(prediction[0].className);
      // store.toggle(prediction[0].className);
      // console.log(store.word)
      //get translation!
      // await getTranslation(prediction[0].className);
    }
  }

const handleCameraStream = (imageAsTensors) => {
    const loop = async () => {
      
      // if ( Platform.OS !== "ios" && Math.random()*50 % 50 == 1) run = false;
      // else if( Math.random()*7 % 7 == 0 ) { run = false; }
        const nextImageTensor = await imageAsTensors.next().value;
        // await getPrediction(nextImageTensor);
        requestAnimationFrameId = requestAnimationFrame(loop);
        console.log('hi')
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
      { frameworkReady ? renderCameraView() : <Text styles={styles.title}>Loading</Text> }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
     width: 700/2,
    height: 800/2,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
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
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  title: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff'
  },
});
