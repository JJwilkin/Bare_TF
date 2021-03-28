import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import { TabRouter, useIsFocused } from '@react-navigation/native';
// import { Camera } from 'expo-camera';
import { RNCamera } from 'react-native-camera';

export default function OCRCamera() {
  const isFocused = useIsFocused();
  const [hasCameraPermission, setHasCameraPermission ] = useState(false);

  useEffect(() => {
    permissionCheck = async () => {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Cool Photo App Camera Permission",
            message:
              "Cool Photo App needs access to your camera " +
              "so you can take awesome pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
          setHasCameraPermission(true);
        } else {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };

    permissionCheck();

  }, [])

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  } else if (hasCameraPermission !== null && isFocused) {
    return <CameraView />;
  } else {
    return null;
  }
}

function CameraView() {
  return (
    <View style={styles.container}>
      <RNCamera
        captureAudio={false}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        {/* {({ camera, status }) => {
          if (status !== 'READY') return <PendingView />;
          return (
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                <Text style={{ fontSize: 14 }}> SNAP </Text>
              </TouchableOpacity>
            </View>
          );
        }} */}
      </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  flexDirection: 'column',
  backgroundColor: 'black',
},
preview: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
},
capture: {
  flex: 0,
  backgroundColor: '#fff',
  borderRadius: 5,
  padding: 15,
  paddingHorizontal: 20,
  alignSelf: 'center',
  margin: 20,
},
});