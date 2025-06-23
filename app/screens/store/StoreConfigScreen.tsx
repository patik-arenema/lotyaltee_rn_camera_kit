import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { CommonActions, useNavigation } from '@react-navigation/native';
import {
  Contact,
  Globe,
  ImageIcon,
  Lock,
  Mail,
  MapPin,
  MapPinHouse,
  Pin,
  Store,
  User,
  ArrowLeft,
} from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


import * as ImagePicker from 'react-native-image-picker';
import { BottomTabParamList, RootStackParamList } from '../../types/navigation';
import { getStoreById, updateStoreSettings, userRegister } from '../../../services/api/api';
import InputField from '../../../components/formComponents/InputField';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/Loader';

type ConfigNavigationProp = NativeStackNavigationProp<
  BottomTabParamList,
  'Settings'
>;
const schema = yup.object({
  store_name: yup.string().required('Store name is required'),
  contact: yup.string().required('Contact is required'),
  email_store: yup.string().email('Invalid email').required('Store email is required'),
  store_url: yup.string().url('Store URL must be valid').required('Store URL is required'),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  address: yup.string().required('Address is required'),
});


const StoreConfigScreen = ({ submitConfigurationData }: any) => {
  const navigation = useNavigation<ConfigNavigationProp>();
  const [secureEntry, setSecureEntry] = useState(true);
  const [confirmSecureEntry, setConfirmSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      response => {
        if (response.didCancel) return;
        if (response.assets && response.assets.length > 0) {
          setSelectedImage(response.assets[0]);
        }
      },
    );
  };
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      store_name: '',
      contact: '',
      email_store: '',
      store_url: '',
      country: '',
      state: '',
      city: '',
      address: '',
    },
  });


  const getStoreDetails = async () => {
    const storeId = (await AsyncStorage.getItem('storeId')) || '';
    if (!storeId) return;

    setLoading(true)
    try {
      const storeDataResponse = await getStoreById(storeId);
      if (storeDataResponse.status === 200) {
        const data = storeDataResponse.data;

        // Set form values
        reset({
          store_name: data.name || '',
          contact: data.contact_number || '',
          email_store: data.email || '',
          store_url: data.store_website_url || '',
          country: data.country || '',
          state: data.state || '',
          city: data.city || '',
          address: data.address || '',
        });

        // Set image for preview
        if (data.store_image_url) {
          setSelectedImage({
            uri: data.store_image_url,
            fileName: 'store.jpg',
            type: 'image/jpeg',
          });
        }

        await AsyncStorage.setItem('storeData', JSON.stringify(data));
      }
    } catch (error) {
      console.log('Failed to fetch store:', error);
    } finally { setLoading(false) }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('store_name', data.store_name);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('country', data.country);
    formData.append('store_website_url', data.store_url);
    formData.append('contact_number', data.contact);
    formData.append('email', data.email_store);

    if (selectedImage) {
      const image = {
        uri: selectedImage.uri,
        name: selectedImage.fileName || 'store.jpg',
        type: selectedImage.type || 'image/jpeg',
      };
      formData.append('store_image', image as any);
    }

    try {
      const res = await updateStoreSettings(formData);
      if (res.success) {
        Alert.alert('Store updated successfully!');
      } else {
        Alert.alert('Error', res.message || 'Store update failed.');
      }
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStoreDetails();
  }, []);

  if (loading) return <Loader />
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <ArrowLeft size={24} color={colors.primary} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Text style={styles.title}>Store Details</Text>

        {/* Store Info */}
        <InputField
          control={control}
          name="store_name"
          placeholder="Store Name"
          icon={<Store size={20} color={colors.gray} />}
          error={errors.store_name?.message}
        />
        <InputField
          control={control}
          name="contact"
          placeholder="Contact Number"
          icon={<Contact size={20} color={colors.gray} />}
          error={errors.contact?.message}
        />
        <InputField
          control={control}
          name="email_store"
          placeholder="Store Email"
          icon={<Mail size={20} color={colors.gray} />}
          error={errors.email_store?.message}
        />
        <InputField
          control={control}
          name="store_url"
          placeholder="Store URL"
          icon={<Globe size={20} color={colors.gray} />}
          error={errors.store_url?.message}
        />
        <InputField
          control={control}
          name="country"
          placeholder="Country"
          icon={<MapPin size={20} color={colors.gray} />}
          error={errors.country?.message}
        />
        <InputField
          control={control}
          name="state"
          placeholder="State"
          icon={<MapPin size={20} color={colors.gray} />}
          error={errors.state?.message}
        />
        <InputField
          control={control}
          name="city"
          placeholder="City"
          icon={<MapPin size={20} color={colors.gray} />}
          error={errors.city?.message}
        />
        <InputField
          control={control}
          name="address"
          placeholder="Address"
          icon={<MapPinHouse size={20} color={colors.gray} />}
          error={errors.address?.message}
        />
        <View style={styles.imageInputText}>
          <ImageIcon size={20} color={colors.gray} />
          <Text style={{ color: colors.primary, textAlign: 'left' }}>
            {selectedImage ? 'Change Image' : 'Pick Store Image'}
          </Text>
        </View>
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.imagePreview}
              />
            )}
          </TouchableOpacity>
        </View>
        {/* Submit */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundIvory,
    padding: 20,
    paddingTop: 50
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 0
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.button,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 50
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 100,
  },
  imageInputText: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    marginVertical: 15,
    gap: 10,
    fontWeight: "600"
  },
  imagePickerContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },

  imagePickerButton: {
    alignItems: 'center',
    marginBottom: 12,
  },

  imagePickerText: {
    fontFamily: fonts.medium,
    color: colors.primary,
    fontSize: 14,
  },

  imagePreview: {
    width: 220,
    height: 180,
    borderRadius: 8,
    alignSelf: 'center',
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
});

export default StoreConfigScreen