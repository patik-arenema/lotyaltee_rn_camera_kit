import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import QRScanner from '../../../components/QRScanner';
import { Camera } from 'react-native-camera-kit';
import {
  getCardDetailsById,
  getStoreById,
  getUserCardsHistory,
  redeemStampCard,
  updateStampCard,
} from '../../../services/api/api';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { StampsDetailsType, StoreDetailsType } from '../../types/passDetails';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Offline from '../../../components/Offline';
import { Modal } from 'react-native';
const { width, height } = Dimensions.get('window');
const circleSize = width / 4.5;
type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UserHistory'
>;

const PassdetailsScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const [showCamera, setShowCamera] = useState(true);
  const [scannedQR, setScannedQR] = useState(false);
  const [passDetails, setPassDetails] = useState<StampsDetailsType>();
  const [storeDetails, setStoreDetails] = useState<StoreDetailsType>();
  const [cardId, setCardId] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<typeof Camera.prototype>(null);
  const [purchaseCount, setPurchaseCount] = useState(1);
  const [redeemCount, setRedeemCount] = useState(0)
  const [redeemDialogBox, setRedeemDialogBox] = useState(false)
  const [redeemPass, setRedeemPass] = useState(false)
  const isFocused = useIsFocused();
  const getUserPassDetails = async (passId: string) => {
    try {
      setLoading(true);
      const userPassResponse = await getCardDetailsById(passId);
      console.log(userPassResponse.data, 'card details ');

      if (userPassResponse.status == 200) {
        setPassDetails(userPassResponse.data);
        setScannedQR(true);
        setLoading(false);
      } else {
        setScannedQR(true);
        setLoading(false);
        Alert.alert(userPassResponse.message)
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  const getStoreDetails = async () => {
    const storeId = (await AsyncStorage.getItem('storeId')) || '';
    console.log(storeId);

    try {
      const storeDataResponse = await getStoreById(storeId);
      if (storeDataResponse.status == 200) {
        setStoreDetails(storeDataResponse.data);
        console.log(storeDataResponse.data);
        AsyncStorage.setItem(
          'storeData',
          JSON.stringify(storeDataResponse.data),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleQRScan = (data: string) => {
    setShowCamera(false);
    if (data.length > 0) {
      getUserPassDetails(data);
      setCardId(data);
    }
    console.log('QR Code Scanned', data);
  };
  const submit = (image: any) => {
    console.log('Captured image:', image);
  };

  const submitPurchase = async () => {
    setLoading(true);
    const data = {
      card_uuid: cardId,
      purchase_count: String(purchaseCount),
      redeem_now: redeemPass,
    };
    console.log(data);

    try {
      const response = await updateStampCard(data);
      if (response.status === 200) {
        console.log(response);

        Alert.alert('Success', 'Purchase submitted successfully');
        getUserPassDetails(cardId); // Refresh stamp view
      } else {
        Alert.alert('Error', 'Failed to submit purchase');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const historyNavigation = async () => {
    if (passDetails?.user_id) {
      await AsyncStorage.setItem('userId', passDetails?.user_id);
      navigation.navigate('UserHistory');
    } else {
      Alert.alert('Please Scan the Pass again');
    }
  };
  const handleRetry = async () => {
    if (unsubscribe) unsubscribe();

    const netState = await NetInfo.fetch();
    setIsConnected(!!netState.isConnected);

    const newUnsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!netState.isConnected);
    });

    setUnsubscribe(() => newUnsubscribe);
  };

  const submitRedeem = async () => {
    const apiData = {
      "store_id": passDetails?.store_id,
      "user_id": passDetails?.user_id,
      "redeem_count": redeemCount
    }
    try {
      const redeemResponse = await redeemStampCard(apiData)
      if (redeemResponse.status == 200) {
        Alert.alert('Success', 'Card(s) redeemed successfully');
        getUserPassDetails(cardId);
        setRedeemDialogBox(false)
      }
      Alert.alert(redeemResponse.message)
    } catch (error) {
      console.log(error);

    }
  }
  const totalCount = () => {
    let res = purchaseCount + Number(passDetails?.stamps_count) >= Number(storeDetails?.stamp_config?.no_of_stamps)
    return res

  }
  console.log(redeemPass);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    setUnsubscribe(() => unsubscribeNetInfo);

    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  useEffect(() => {
    getStoreDetails();
  }, []);

  useEffect(() => {
    totalCount()
  }, [purchaseCount])

  useEffect(() => {
    if (!isFocused) {
      setShowCamera(true);
      setPassDetails(undefined);
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!isConnected) return <Offline retryAction={handleRetry} />;
  return (
    <ScrollView style={styles.container}>
      <Modal
        visible={redeemDialogBox}
        transparent
        animationType="slide"
        onRequestClose={() => setRedeemDialogBox(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setRedeemDialogBox(false)}
        />
        <View style={styles.dialogBox}>
          <Text style={styles.title}>Redeem Count</Text>

          <View style={styles.buttonCard}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => setRedeemCount(prev => Math.max(0, prev - 1))}
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{redeemCount}</Text>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => {
                if (redeemCount <= Number(passDetails?.pending_redeem)) {
                  setRedeemCount(prev => prev + 1);
                }
              }}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { marginTop: 20 }]}
            onPress={() => submitRedeem()}
          >
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View>
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            onPress={() => setShowCamera(true)}
            style={styles.submitBtn}
          >
            <Text style={{ paddingVertical: 4, fontSize: 16, color: colors.white }}>
              Scan QR Code
            </Text>
          </TouchableOpacity>
        </View>
        <View style={showCamera ? styles.scanner : styles.scanned}>
          <QRScanner
            showCamera={showCamera}
            setShowCamera={setShowCamera}
            cameraRef={cameraRef}
            submit={submit}
            handleQRCodeScanned={handleQRScan}
          />
        </View>
        {!showCamera && passDetails ? (
          <View
            style={[
              styles.card,
              { backgroundColor: storeDetails?.stamp_config.background_color },
            ]}>
            <View style={styles.circleContainer}>
              {[...Array(storeDetails?.stamp_config?.no_of_stamps)].map(
                (_, index) => (
                  <TouchableOpacity key={index}>
                    {index < (passDetails?.stamps_count ?? 0) ? (
                      <Image
                        source={require('../../../assets/images/bean.png')}
                        style={[styles.circle]}
                      />
                    ) : index ===
                      (storeDetails?.stamp_config?.no_of_stamps ?? 0) - 1 ? (
                      <View
                        style={[
                          styles.circle,
                          storeDetails?.stamp_config?.stamp_shape ===
                          'square' && {
                            borderRadius: 8,
                          },
                          {
                            backgroundColor:
                              storeDetails?.stamp_config?.stamp_fill_color,
                          },
                        ]}>
                        <Text
                          style={{
                            color: storeDetails?.stamp_config?.stamp_text_color,
                          }}>
                          Free
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.circle,
                          storeDetails?.stamp_config?.stamp_shape ===
                          'square' && {
                            borderRadius: 8,
                          },
                          {
                            backgroundColor:
                              storeDetails?.stamp_config?.stamp_fill_color,
                          },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>
        ) : null}
        {scannedQR && passDetails ? (
          <View style={styles.purchaseContainer}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.medium,
                marginBottom: 10,
              }}>
              Purchase Quantity
            </Text>
            <View
              style={styles.buttonCard}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() =>
                  setPurchaseCount(prev => Math.max(1, prev - 1))
                }>
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 20, fontSize: 18 }}>
                {purchaseCount}
              </Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={(e) => {
                  if (purchaseCount < (storeDetails?.stamp_config?.no_of_stamps || 9)) {
                    setPurchaseCount(prev => prev + 1)

                  }
                }}>

                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>
            {totalCount() ?
              <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 10, gap: 10 }}>
                <Text style={{ marginLeft: 10 }}>User has earned a free coffee </Text>
                <Text style={{ marginLeft: 10 }}>Redeem This Stamp Card </Text>
                <Switch
                  value={redeemPass}
                  onValueChange={setRedeemPass}
                  thumbColor={redeemPass ? '#34C759' : '#ccc'}
                  trackColor={{ false: '#fff', true: '#81b0ff' }}
                />
              </View> : null
            }
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={submitPurchase}>
              <Text style={styles.submitBtnText}>Submit Purchase</Text>
            </TouchableOpacity>

          </View>
        ) : null}
        {scannedQR && passDetails ? (
          <View style={styles.purchaseContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={historyNavigation}>
                <Text style={styles.submitBtnText}>Pass History</Text>
              </TouchableOpacity>
              {passDetails?.pending_redeem > 0 ?
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={() => {
                    setRedeemDialogBox(true)
                  }}>
                  <Text style={styles.submitBtnText}>Redeem Pass</Text>
                </TouchableOpacity>
                : null}
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  purchaseContainer: {
    backgroundColor: colors.white,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 20
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',

    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: colors.backgroundIvory,
  },
  scanner: {
    width: 'auto',
    height: 500,
  },
  scanned: {
    width: 'auto',
    height: 0,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeDetails: {
    marginVertical: 20,
    alignItems: 'center',
  },
  storeName: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  storeAddress: {
    fontSize: 20,
    fontFamily: fonts.regular,
    color: colors.black,
    textAlign: 'center',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#ffffff80',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginTop: 10,
    marginVertical: 50,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: fonts.semiBold,
    marginBottom: 15,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  circleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    gap: 15, // Add spacing between circles
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2, // Ensures the circle shape
    backgroundColor: 'rgba(163, 244, 255, 0.374)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  filledCircle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectedCircle: {
    borderColor: 'gold',
    transform: [{ scale: 1.1 }],
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Less transparency for better readability
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    marginBottom: 10,
    color: colors.primary, // Use primary color or a dark color
  },
  qtyButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.button,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',

  },
  submitBtn: {
    backgroundColor: colors.button,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.semiBold,
    textTransform: 'uppercase',
  },
  modalText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#333', // Dark gray for readability
    textAlign: 'center',
  },

  cancelText: {
    color: colors.primary, // Keep it noticeable
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 12,
    padding: 14,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#000000',
  },
  verifyButton: {
    width: '50%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 5,
  },
  gradientButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    padding: 12,
    textTransform: 'uppercase',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusOverlay: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    backgroundColor: 'rgba(255, 255, 255, 0)',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  overlayContainer: {
    alignItems: 'center',
  },
  overlayText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
  },
  dialogBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.medium,
    marginBottom: 10,
  },
  qtyValue: {
    fontSize: 18,
    paddingHorizontal: 20,
    fontWeight: '600',
  },
});

export default PassdetailsScreen;
