// import React, {useRef, useState} from 'react';
// import {
//   StatusBar,
//   StyleSheet,
//   useColorScheme,
//   View,
//   Button,
//   Alert,
// } from 'react-native';

// import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
// import QRScanner from './QRScanner';
// import {Camera} from 'react-native-camera-kit';

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };
//   const safePadding = '5%';

//   // State and ref required by QRScanner
//   const [showCamera, setShowCamera] = useState(false);
//   const cameraRef = useRef<typeof Camera.prototype>(null);

//   // Handler for submit (after capture)
//   const submit = (image: any) => {
//     console.log('Captured image:', image);
//     Alert.alert('Image Captured', `URI: ${image?.uri}`);
//     // You can upload or process image here
//   };
//   const handleQRCodeScanned = (data: string) => {
//     setShowCamera(false);
//     Alert.alert('QR Code Scanned', data);
//   };

//   return (
//     <View style={[backgroundStyle, {flex: 1}]}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <View style={{paddingRight: safePadding}}>
//         <Header />
//       </View>

//       <View style={styles.sectionContainer}>
//         <Button title="Open Camera" onPress={() => setShowCamera(true)} />
//       </View>

//       <QRScanner
//         showCamera={showCamera}
//         setShowCamera={setShowCamera}
//         cameraRef={cameraRef}
//         submit={submit}
//         handleQRCodeScanned={handleQRCodeScanned}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
// });

// export default App;

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './app/navigation/RootNavigator';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
