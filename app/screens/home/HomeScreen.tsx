import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  customerOnboardedData,
  coffeeRedeemedData,
  cardsGeneratedData,
  stampsMarkedData,
  customerVisitedData,
  customerRetentionData,
  topCustomerData,
  getStoreById,
} from '../../../services/api/api'; // Replace with actual import
import CardWithFilterMenu from '../../../components/CardWithFilter';
import { useIsFocused } from '@react-navigation/native';
import { colors } from '../../../utils/colors';
import Offline from '../../../components/Offline';
import { MapPin, Store } from 'lucide-react-native';
import UsersTable from '../../../components/UsersTable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoreDetailsType } from '../../types/passDetails';
import Loader from '../../../components/Loader';


const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;

const HomeScreen = () => {
  const [loading, setLoading] = useState(false)
  const [onboarded, setOnboarded] = useState(0);
  const [redeemed, setRedeemed] = useState(0);
  const [cards, setCards] = useState(0);
  const [stamps, setStamps] = useState(0);
  const [customer, setCustomer] = useState(0);
  const [retention, setRetention] = useState(0);
  const [topCustomers, setTopCustomers] = useState([])
  const [isConnected, setIsConnected] = useState(true);
  const [storeDetails, setStoreDetails] = useState<StoreDetailsType>()
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


  const isFocus = useIsFocused();

  const fetchData = async (type: string, range: string) => {
    const payload = { range };
    try {
      if (type === 'onboarded') {
        const res = await customerOnboardedData(payload);
        setOnboarded(res?.data?.count || 0);
      } else if (type === 'redeemed') {
        const res = await coffeeRedeemedData(payload);
        setRedeemed(res?.data?.count || 0);
      } else if (type === 'cards') {
        const res = await cardsGeneratedData(payload);
        setCards(res?.data?.count || 0);
      } else if (type === 'stamps') {
        const res = await stampsMarkedData(payload);
        setStamps(res?.data?.count || 0);
      } else if (type === 'customer') {
        const res = await customerVisitedData(payload);
        setCustomer(res?.data?.count || 0);
      } else if (type == "retention") {
        const res = await customerRetentionData(payload);
        setRetention(res?.data?.count || 0);
      } else if (type == 'top_customers') {
        const res = await topCustomerData(payload)
        setTopCustomers(res.data?.top_customers || [])
      }
    } catch (err) {
      console.error(`Error fetching ${type} data`, err);
    }
  };

  console.log(onboarded);
  const storeItemSet = async () => {
    setLoading(true)
    let store = await AsyncStorage.getItem("storeData")
    let storeId = await AsyncStorage.getItem("storeId")
    if (store) {
      let parsedStore = JSON.parse(store)
      setStoreDetails(parsedStore || {})
      setLoading(false)
    } else {
      try {
        if (storeId) {
          const storeDetailsRes = await getStoreById(storeId)
          if (storeDetailsRes.status == 200) {
            setStoreDetails(storeDetailsRes.data)
            AsyncStorage.setItem("storeData", JSON.stringify(storeDetailsRes.data))
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (isFocus === true) {
      console.log('first focus effect called');
      fetchData('onboarded', 'THIS_WEEK');
      fetchData('redeemed', 'THIS_WEEK');
      fetchData('cards', 'THIS_WEEK');
      fetchData('stamps', 'THIS_WEEK');
      fetchData('customer', 'THIS_WEEK');
      fetchData('retention', 'THIS_WEEK');
      fetchData("top_customers", "THIS_WEEK")
    }
    storeItemSet()
  }, [isFocus]);

  if (!isConnected) return <Offline retryAction={handleRetry} />;
  if (loading) return <Loader />;

  return (
    <ScrollView style={styles.container}>
      {storeDetails ?
        <View style={styles.iconTextContainer}>
          <Store size={20} color={colors.button} />
          <Text style={styles.titleText}>{storeDetails?.name}</Text>
        </View>
        : null}
      {storeDetails ?
        <View style={styles.iconTextContainer}>
          <MapPin size={20} color={colors.button} />
          <Text style={styles.subtitleText}>{storeDetails?.address}</Text>
        </View>
        : null}
      {storeDetails ?
        <View style={styles.iconTextContainer}>
          <MapPin size={20} color={colors.button} />
          <Text style={styles.subtitleText}>{storeDetails?.city},{storeDetails?.country}</Text>
        </View>
        : null}
      <View style={styles.cardContainer}>
        <CardWithFilterMenu
          title="Customer Onboarded"
          value={onboarded}
          gradient={['#fbc2eb', '#a6c1ee']}
          onFilterChange={range => fetchData('onboarded', range)}
        />
        <CardWithFilterMenu
          title="Card Generated"
          value={cards}
          gradient={['#fceabb', '#f8b500']}
          onFilterChange={range => fetchData('cards', range)}
        />
        <CardWithFilterMenu
          title="Coffee Redeemed"
          value={redeemed}
          gradient={['#a1c4fd', '#c2e9fb']}
          onFilterChange={range => fetchData('redeemed', range)}
        />
        <CardWithFilterMenu
          title="Customer Visited"
          value={customer}
          gradient={['#D7DFC7', '#6F9712']}
          onFilterChange={range => fetchData('customer', range)}
        />
        <CardWithFilterMenu
          title="Stamps Marked"
          value={stamps}
          gradient={['#d4fc79', '#96e6a1']}
          onFilterChange={range => fetchData('stamps', range)}
        />

        <CardWithFilterMenu
          title="Customer Retention Rate "
          additionalText="Customer onboarded/Customer visited"
          value={retention}
          gradient={['#ffb986', '#bb4d00']}
          onFilterChange={range => fetchData('retention', range)}
        />
        <UsersTable
          data={topCustomers}
          onFilterChange={(range) => fetchData('top_customers', range)}
        />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundIvory,
    flex: 1,
    paddingTop: 50
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: CARD_MARGIN,
    gap: CARD_MARGIN,
    marginTop: 10,
    marginBottom: 80,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
