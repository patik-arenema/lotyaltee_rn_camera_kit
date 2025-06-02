import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {Camera} from 'react-native-camera-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

const QRScanner = ({
  showCamera,
  cameraRef,
  setShowCamera,
  submit,
  handleQRCodeScanned,
}) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraType, setCameraType] = useState('back'); // 'front' or 'back'

  // const handleCapture = async () => {
  //   try {
  //     if (cameraRef.current) {
  //       const image = await cameraRef.current.capture();
  //       setCapturedImage(image);
  //     }
  //   } catch (error) {
  //     console.log('Error capturing image:', error.message);
  //     Alert.alert('Error', 'Failed to capture image.');
  //   }
  // };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = async () => {
    setShowCamera(false);
    await submit(capturedImage);
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  const toggleCameraType = () => {
    setCameraType(prev => (prev === 'front' ? 'back' : 'front'));
  };

  if (!showCamera) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.fullScreen}>
        {!capturedImage ? (
          <>
            <Camera
              ref={cameraRef}
              style={styles.cameraPreview}
              cameraType={cameraType}
              flashMode="auto"
              scanBarcode={true}
              onReadCode={event => {
                const {codeStringValue} = event.nativeEvent;
                handleQRCodeScanned(codeStringValue);
              }}
            />
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                onPress={handleCameraClose}
                style={styles.actionButton}>
                <Icon name="close" size={28} color="white" />
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={handleCapture}
                style={styles.captureButton}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={toggleCameraType}
                style={styles.actionButton}>
                <Icon name="flip-camera-ios" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Image
              source={{uri: capturedImage.uri}}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                onPress={handleRetake}
                style={[styles.actionButton, styles.retakeButton]}>
                <Icon name="close" size={28} color="white" />
              </TouchableOpacity>
              <View style={styles.emptySpace} />
              <TouchableOpacity
                onPress={handleConfirm}
                style={[styles.actionButton, styles.confirmButton]}>
                <Icon name="check" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'black',
  },
  fullScreen: {
    flex: 1,
  },
  cameraPreview: {
    flex: 1,
    resizeMode: 'cover',
  },
  imagePreview: {
    flex: 1,
    resizeMode: 'cover',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  retakeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  emptySpace: {
    width: 70,
  },
});

export default QRScanner;
