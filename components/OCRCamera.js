import React, { useState, useEffect } from 'react';
import { RNCamera } from 'react-native-camera'; 

export default function OCRCamera() {
  return(
    <RNCamera />
  );
};

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import { Camera } from 'expo-camera';

// export default function OCRCamera() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [type, setType] = useState(Camera.Constants.Type.back);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }
//   return (
//     <View style={styles.container}>
//       <Camera style={styles.camera} type={type}>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => {
//               setType(
//                 type === Camera.Constants.Type.back
//                   ? Camera.Constants.Type.front
//                   : Camera.Constants.Type.back
//               );
//             }}>
//             <Text style={styles.text}> Flip </Text>
//           </TouchableOpacity>
//         </View>
//       </Camera>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     flexDirection: 'row',
//     margin: 20,
//   },
//   button: {
//     flex: 0.1,
//     alignSelf: 'flex-end',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 18,
//     color: 'white',
//   },
// });
// export default class OCRCamera extends PureComponent {
//   render() {
//     return (
//       <Camera />
      // <View style={styles.container}>
      //   <RNCamera
      //     ref={ref => {
      //       this.camera = ref;
      //     }}
      //     style={styles.preview}
      //     type={RNCamera.Constants.Type.back}
      //     flashMode={RNCamera.Constants.FlashMode.on}
      //     androidCameraPermissionOptions={{
      //       title: 'Permission to use camera',
      //       message: 'We need your permission to use your camera',
      //       buttonPositive: 'Ok',
      //       buttonNegative: 'Cancel',
      //     }}
      //     androidRecordAudioPermissionOptions={{
      //       title: 'Permission to use audio recording',
      //       message: 'We need your permission to use your audio',
      //       buttonPositive: 'Ok',
      //       buttonNegative: 'Cancel',
      //     }}
      //     onGoogleVisionBarcodesDetected={({ barcodes }) => {
      //       console.log(barcodes);
      //     }}
      //   />
      //   <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
      //     <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
      //       <Text style={{ fontSize: 14 }}> SNAP </Text>
      //     </TouchableOpacity>
      //   </View>
      // </View>
//     );
//   }

//   takePicture = async () => {
//     if (this.camera) {
//       const options = { quality: 0.5, base64: true };
//       const data = await this.camera.takePictureAsync(options);
//       console.log(data.uri);
//     }
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: 'black',
//   },
//   preview: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   capture: {
//     flex: 0,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     padding: 15,
//     paddingHorizontal: 20,
//     alignSelf: 'center',
//     margin: 20,
//   },
// });