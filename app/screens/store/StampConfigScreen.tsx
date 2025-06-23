import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoreById, updateStoreSettings, updateStripImage } from '../../../services/api/api';
import ColorPickerWrapper from '../../../components/formComponents/ColorPickerWrapper';
import StampCardPreview from '../../../components/StampCardPreview';
import { fonts } from '../../../utils/fonts';
import { colors } from '../../../utils/colors';
import Offline from '../../../components/Offline';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList } from '../../types/navigation';


type StampConfigType = {
  no_of_stamps: number;
  background_color: string;
  label_color: string;
  stamp_shape: string;
  stamp_fill_color: string;
  stamp_text_color: string;
};

const defaultValues: StampConfigType = {
  no_of_stamps: 9,
  background_color: 'rgb(227, 219, 194)',
  label_color: 'rgb(0, 0, 0)',
  stamp_shape: 'square',
  stamp_fill_color: '#e2e2df',
  stamp_text_color: '#000000',
};
type ConfigNavigationProp = NativeStackNavigationProp<
  BottomTabParamList,
  'Settings'
>;
const StampConfigScreen = () => {
  const navigation = useNavigation<ConfigNavigationProp>();

  const [config, setConfig] = useState<StampConfigType>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  const shapeOptions = [
    { label: 'Circle', value: 'circle' },
    { label: 'Square', value: 'square' },
  ];

  const handleChange = <K extends keyof StampConfigType>(
    key: K,
    value: StampConfigType[K],
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!config) return;
    if (config.no_of_stamps <= 0) {
      Alert.alert("Stamps cannot be 0")
      return
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('no_of_stamps', config.no_of_stamps.toString());
      formData.append('background_color', config.background_color);
      formData.append('strip_gradient_start_color', config.background_color);
      formData.append('strip_gradient_end_color', config.background_color);
      formData.append('label_color', config.label_color);
      formData.append('stamp_shape', config.stamp_shape);
      formData.append('stamp_fill_color', config.stamp_fill_color);
      formData.append('stamp_text_color', config.stamp_text_color);


      const apiResponse = await updateStoreSettings(formData);
      console.log("this is store update", apiResponse);

      if (apiResponse.status === 200) {

        const strpiImageRes = await updateStripImage()
        console.log("strip response ", strpiImageRes);

        if (strpiImageRes.status == 200) {
          const rawData = await AsyncStorage.getItem('storeData');
          if (rawData) {
            const parsed = JSON.parse(rawData);
            const updated = {
              ...parsed,
              stamp_config: config,
            };
            Alert.alert(apiResponse.data?.message);
            await AsyncStorage.setItem('storeData', JSON.stringify(updated));
          }
        } else {
          Alert.alert(strpiImageRes.message)
        }

      } else {
        Alert.alert(apiResponse.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setLoading(false)
      Alert.alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStoreDetails = async () => {
    const storeId = (await AsyncStorage.getItem('storeId')) || '';
    console.log(storeId);
    setLoading(true)
    try {
      const storeDataResponse = await getStoreById(storeId);
      if (storeDataResponse.status == 200) {
        setLoading(false)

        setConfig(storeDataResponse.data?.stamp_config);
        console.log("pass dot", storeDataResponse.data);
        AsyncStorage.setItem(
          'storeData',
          JSON.stringify(storeDataResponse.data),
        );
      }
    } catch (error) {
      console.log(error);
      setLoading(false)

    } finally {
      setLoading(false)
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
    getStoreDetails()
  }, []);

  console.log(config);
  if (!isConnected) return <Offline retryAction={handleRetry} />;


  return (
    <View>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <ArrowLeft size={24} color={colors.primary} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Store Details</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Number of Stamps</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={config.no_of_stamps === 0 ? '' : String(config.no_of_stamps)}
            onChangeText={(text) => {
              if (text === '') {
                handleChange('no_of_stamps', 0); // treat empty as 0 or undefined
              } else {
                const num = Number(text);
                if (!isNaN(num) && num > 0 && num <= 10) {
                  handleChange('no_of_stamps', num);
                }
              }
            }}
            maxLength={2}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Background Color</Text>
          <ColorPickerWrapper
            defaultColor={config.background_color}
            onColorSelected={color => handleChange('background_color', color)}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Label Color</Text>
          <ColorPickerWrapper
            defaultColor={config.label_color}
            onColorSelected={color => handleChange('label_color', color)}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Stamp Fill Color</Text>
          <ColorPickerWrapper
            defaultColor={config.stamp_fill_color}
            onColorSelected={color => handleChange('stamp_fill_color', color)}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Stamp Text Color</Text>
          <ColorPickerWrapper
            defaultColor={config.stamp_text_color}
            onColorSelected={color => handleChange('stamp_text_color', color)}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Stamp Shape</Text>
          <View style={styles.radioGroup}>
            {shapeOptions.map(item => (
              <View key={item.value} style={styles.radioOption}>
                <Text
                  onPress={() => handleChange('stamp_shape', item.value)}
                  style={[
                    styles.radioCircle,
                    config.stamp_shape === item.value &&
                    styles.radioCircleSelected,
                  ]}
                />
                <Text style={styles.radioLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff' }}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Card Preview</Text>
        <StampCardPreview stamp_config={config} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: colors.backgroundIvory,
    marginBottom: 50,

  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: 16,
    marginLeft: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    marginBottom: 8,
    marginTop: 20,
    color: colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  fieldContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray,
    marginRight: 8,
  },
  radioCircleSelected: {
    backgroundColor: colors.darkGray,
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
    borderBottomColor: colors.gray,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.button,
    paddingVertical: 12,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default StampConfigScreen;
