import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import {
  customerOnboardedData,
  coffeeRedeemedData,
  cardsGeneratedData,
  stampsMarkedData,
  customerVisitedData,
} from '../../../services/api/api'; // Replace with actual import
import CardWithFilterMenu from '../../../components/CardWithFilter';
import {useIsFocused} from '@react-navigation/native';
import {colors} from '../../../utils/colors';
import Offline from '../../../components/Offline';

const {width} = Dimensions.get('window');
const CARD_MARGIN = 16;

const HomeScreen = () => {
  const [onboarded, setOnboarded] = useState(0);
  const [redeemed, setRedeemed] = useState(0);
  const [cards, setCards] = useState(0);
  const [stamps, setStamps] = useState(0);
  const [customer, setCustomer] = useState(0);
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

  const isFocus = useIsFocused();

  const fetchData = async (type: string, range: string) => {
    const payload = {range};
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
      }
    } catch (err) {
      console.error(`Error fetching ${type} data`, err);
    }
  };

  console.log(onboarded);

  useEffect(() => {
    if (isFocus === true) {
      console.log('first focus effect called');
      fetchData('onboarded', 'THIS_WEEK');
      fetchData('redeemed', 'THIS_WEEK');
      fetchData('cards', 'THIS_WEEK');
      fetchData('stamps', 'THIS_WEEK');
      fetchData('customer', 'THIS_WEEK');
    }
  }, [isFocus]);
  return (
    <ScrollView style={styles.container}>
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
          title="Stamps Marked"
          value={stamps}
          gradient={['#d4fc79', '#96e6a1']} 
          onFilterChange={range => fetchData('stamps', range)}
        />
        <CardWithFilterMenu
          title="Customer Visited"
          value={customer}
          gradient={['#ffb986', '#bb4d00']} 
          onFilterChange={range => fetchData('customer', range)}
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
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: CARD_MARGIN,
    gap: CARD_MARGIN,
    marginTop: 10,
    marginBottom:80,
  },
});
