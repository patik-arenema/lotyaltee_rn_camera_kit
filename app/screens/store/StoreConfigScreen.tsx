import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import StampConfigForm from '../../../components/StampConfigForm';
import StoreConfigForm from '../../../components/StoreConfigForm';
import {colors} from '../../../utils/colors'; // adjust based on your project
import {fonts} from '../../../utils/fonts'; // adjust based on your project
import {ChevronLeft} from 'lucide-react-native';
import {updateStoreSettings} from '../../../services/api/api';
import Offline from '../../../components/Offline';

const StoreConfigScreen = () => {
  const [formSelected, setSelectedForm] = useState<'null' | 'stamp' | 'store'>(
    'null',
  );
  const [isConnected, setIsConnected] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);
  const handleRetry = async () => {
    if (unsubscribe) unsubscribe();

    const netState = await NetInfo.fetch();
    setIsConnected(!!netState.isConnected);

    const newUnsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!netState.isConnected);
    });

    setUnsubscribe(() => newUnsubscribe);
  };

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    setUnsubscribe(() => unsubscribeNetInfo);

    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  if (!isConnected) return <Offline retryAction={handleRetry} />;

  return (
    <ScrollView style={styles.container}>
      {formSelected === 'stamp' ? (
        <View>
          <TouchableOpacity onPress={() => setSelectedForm('null')}>
            <ChevronLeft />
          </TouchableOpacity>
          <StampConfigForm />
        </View>
      ) : formSelected === 'store' ? (
        <View>
          <TouchableOpacity onPress={() => setSelectedForm('null')}>
            <ChevronLeft />
          </TouchableOpacity>
          <StoreConfigForm />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => setSelectedForm('store')}>
            <Text style={styles.buttonText}>Store Configuration</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setSelectedForm('stamp')}>
            <Text style={styles.buttonText}>Pass Configuration</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.backgroundIvory,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 40,
    gap: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fonts.semiBold,
  },
});

export default StoreConfigScreen;
