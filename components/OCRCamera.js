import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Text, View, ScrollView, StyleSheet, Button, Platform, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as jpeg from 'jpeg-js';
import { useIsFocused } from "@react-navigation/native";
import TesseractOcr, {
  LANG_ENGLISH,
  useEventListener,
} from 'react-native-tesseract-ocr';
//Permissions
import * as Permissions from 'expo-permissions';

//camera
import { Camera } from 'expo-camera';

//tensorflow
import * as tf from '@tensorflow/tfjs';
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';

export default function LiveCameraScreen({navigation}) {
  const isFocused = useIsFocused();
  const [uri, setUri] = useState("")

  useEffect(() => {
    handleCameraStream()
    setUri('')
  }, [isFocused]);

  const [run, setRun] = useState(true);
  const [predictionFound, setPredictionFound] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [frameworkReady, setFrameworkReady] = useState(false);

  const TensorCamera = cameraWithTensors(Camera);
  let requestAnimationFrameId = 0;

  //performance hacks (Platform dependent)
  const textureDims = Platform.OS === "ios"? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };
  // const tensorDims = { width: 152, height: 200 }; 
  const tensorDims = { width: 500, height: 700} // figure out dimensions and apply here

  useEffect(() => {
    if(!frameworkReady) {
      (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');

        await tf.ready(); //wait for tf model
        // setMobilenetModel(await loadMobileNetModel()); // load tf model

        setFrameworkReady(true);
      })();
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  // const loadMobileNetModel = async () => { // TO DO: CHANGE THE MODEL
  //   const model = await mobilenet.load();
  //   return model;
  // }

/*-----------------------------------------------------------------------
Helper function to handle the camera tensor streams. Here, to keep up reading input streams, we use requestAnimationFrame JS method to keep looping for getting better predictions (until we get one with enough confidence level).
More info on RAF: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
-------------------------------------------------------------------------*/
// const handleCameraStream = async (imageAsTensors) => {
//   const loop = async () => {
//     const tensor = await imageAsTensors.next().value;
//     const [height, width] = tensor.shape;
//     const buffer = new Uint8ClampedArray(width * height * 4)

//     const data = tensor.dataSync();
//     var i = 0;
//     for(var y = 0; y < height; y++) {
//     for(var x = 0; x < width; x++) {
//         var pos = (y * width + x) * 4;      // position in buffer based on x and y
//         buffer[pos  ] = data[i]             // some R value [0, 255]
//         buffer[pos+1] = data[i+1]           // some G value
//         buffer[pos+2] = data[i+2]           // some B value
//         buffer[pos+3] = 255;                // set alpha channel
//         i+=3
//     }
//   }
//     //set the buffer to the image data
//     const rawImageData = {imageData, width, height};
//     const jpegImageData = jpeg.encode(rawImageData, 100);

//     const imgBase64 = tf.util.decodeString(jpegImageData.data, "base64")
//     const salt = `${Date.now()}-${Math.floor(Math.random() * 10000)}`
//     const uri = FileSystem.documentDirectory + `tensor-${salt}.jpg`;
//     await FileSystem.writeAsStringAsync(uri, imgBase64, {
//       encoding: FileSystem.EncodingType.Base64,
//     });
//     console.log(uri)
//     setUri(uri)
//     // return {uri, width, height}
//   };
//   // requestAnimationFrameId = requestAnimationFrame(loop);
//   !uri ? setTimeout(() => loop(), 4000) : null;
// }

const handleCameraStream = async (imageAsTensors) => {
  const loop = async () => {
    const tensor = await imageAsTensors.next().value;
    const [height, width] = tensor.shape
    const data = new Buffer(
      // concat with an extra alpha channel and slice up to 4 channels to handle 3 and 4 channels tensors
      tf.concat([tensor, tf.ones([height, width, 1]).mul(255)], [-1])
        .slice([0], [height, width, 4])
        .dataSync(),
    )

    const rawImageData = {data, width, height};
    const jpegImageData = jpeg.encode(rawImageData, 200);

    const imgBase64 = tf.util.decodeString(jpegImageData.data, "base64")
    const salt = `${Date.now()}-${Math.floor(Math.random() * 10000)}`
    const uri = FileSystem.documentDirectory + `tensor-${salt}.jpg`;
    await FileSystem.writeAsStringAsync(uri, imgBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("started")

    const tessOptions = { level: LEVEL_WORD };
    console.log(TesseractOcr);
    const result = await TesseractOcr.recognize("https://i5.walmartimages.com/asr/db63f3df-2cd1-4ec9-8f8f-25de3659205f_1.744bbfefd5cd025fa2fbaf25316d5951.jpeg", LANG_ENGLISH, tessOptions);
    console.log("finished")
    console.log(result)

    setUri(uri)
    // return {uri, width, height}
  };
  // requestAnimationFrameId = requestAnimationFrame(loop);
  !uri ? setTimeout(() => loop(), 1200) : null;
}

  //TO DO: USE TO RESET
  const loadNewTranslation = () => {
    setPredictionFound(false);
  }

  const renderCameraView = () => {
    return <View>
                <TensorCamera
                  style={styles.camera}
                  type={Camera.Constants.Type.back}
                  zoom={0}
                  cameraTextureHeight={textureDims.height} 
                  cameraTextureWidth={textureDims.width}
                  resizeHeight={tensorDims.height}
                  resizeWidth={tensorDims.width}
                  resizeDepth={3}
                  onReady={(imageAsTensors) => handleCameraStream(imageAsTensors)}
                  autorender={true}
                />
            </View>;
  }

  return (
    <View>
      <ScrollView>
        { frameworkReady ? renderCameraView() : <Text>Loading</Text> }
        <Text>Image</Text>
        {uri ? <Image style={styles.image} source={{uri: uri}}/> : null}

        {/* <Canvas id="canvas"></Canvas> */}
      </ScrollView>  
    </View>
  );
}


const styles = StyleSheet.create({
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
    // width: 700/2,
    height: 500,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
  image: {
    height: 400,
    width: 400
  }
});


// import React, {useState} from 'react';
// import {Button, StyleSheet, Text, View, Image} from 'react-native';
// // import ImagePicker from 'react-native-image-crop-picker';
// // import * as ImagePicker from 'expo-image-picker';
// import TesseractOcr, {
//   LANG_ENGLISH,
//   useEventListener,
// } from 'react-native-tesseract-ocr';

// const DEFAULT_HEIGHT = 500;
// const DEFAULT_WITH = 600;
// const defaultPickerOptions = {
//   cropping: true,
//   height: DEFAULT_HEIGHT,
//   width: DEFAULT_WITH,
// };

// function OCRCamera() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [imgSrc, setImgSrc] = useState(null);
//   const [text, setText] = useState('');
//   useEventListener('onProgressChange', (p) => {
//     setProgress(p.percent / 100);
//   });

//   const recognizeTextFromImage = async (path) => {
//     setIsLoading(true);
    
//     try {
//       const tesseractOptions = {};
//       const recognizedText = await TesseractOcr.recognize(
//         path,
//         LANG_ENGLISH,
//         tesseractOptions,
//       );
//       console.log("hello")

//       setText(recognizedText);
//     } catch (err) {
//       console.error(err);
//       setText('');
//     }

//     setIsLoading(false);
//     setProgress(0);
//   };

//   // const recognizeFromPicker = async (options = defaultPickerOptions) => {
//   //   try {
//   //     const image = await ImagePicker.openPicker(options);
//   //     setImgSrc({uri: image.path});
//   //     await recognizeTextFromImage(image.path);
//   //   } catch (err) {
//   //     if (err.message !== 'User cancelled image selection') {
//   //       console.error(err);
//   //     }
//   //   }
//   // };

//   const recognizeFromCamera = async (options = defaultPickerOptions) => {
//     try {
//       const imagePath = "https://mk0slidecowixjpdg2l0.kinstacdn.com/wp-content/uploads/2018/04/Spice-it-Up-Gradient-over-text-filled-image-1000x563.png"
//       setImgSrc({uri: imagePath});
//       await recognizeTextFromImage(imagePath);
//     } catch (err) {
//       if (err.message !== 'User cancelled image selection') {
//         console.error(err);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tesseract OCR example</Text>
//       <Text style={styles.instructions}>Select an image source:</Text>
//       <View style={styles.options}>
//         <View style={styles.button}>
//           <Button
//             disabled={isLoading}
//             title="Camera"
//             onPress={() => {
//               recognizeFromCamera();
//             }}
//           />
//         </View>
//         <View style={styles.button}>
//           {/* <Button
//             disabled={isLoading}
//             title="Picker"
//             onPress={() => {
//               recognizeFromPicker();
//             }}
//           /> */}
//         </View>
//       </View>
//       {imgSrc && (
//         <View style={styles.imageContainer}>
//           <Image style={styles.image} source={imgSrc} />
//           {isLoading ? (
//             <Text>{progress}</Text>
//           ) : (
//             <Text>{text}</Text>
//           )}
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   options: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//   },
//   button: {
//     marginHorizontal: 10,
//   },
//   imageContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     marginVertical: 15,
//     height: DEFAULT_HEIGHT / 2.5,
//     width: DEFAULT_WITH / 2.5,
//   },
//   title: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

// export default OCRCamera;