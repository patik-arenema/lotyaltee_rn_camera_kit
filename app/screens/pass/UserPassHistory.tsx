import NetInfo from '@react-native-community/netinfo';
import {useIsFocused} from '@react-navigation/native';
import {format} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getUserCardsHistory} from '../../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Offline from '../../../components/Offline';
import Loader from '../../../components/Loader';
import {colors} from '../../../utils/colors';

const {width, height} = Dimensions.get('window');

type CardStatus = 'active' | 'awaiting' | 'expired';

interface ImprovedStampCard {
  card_uuid: string;
  no_of_stamps: number;
  status: CardStatus;
  created_at: string;
  marked_date?: string;
  store_name?: string;
  store_address?: string;
  redeemed_at?: string;
}

interface NewStampResponse {
  active_cards: ImprovedStampCard[];
  expired_cards: ImprovedStampCard[];
  awaiting_cards: ImprovedStampCard[];
}

const UserPassHistory = () => {
  const [loading, setLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [stampCards, setStampCards] = useState<NewStampResponse>({
    active_cards: [],
    expired_cards: [],
    awaiting_cards: [],
  });
  const [activeTab, setActiveTab] = useState<CardStatus>('active');
  const isActive = useIsFocused();

  const getStampsData = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem('userId');
    const storeId = await AsyncStorage.getItem('storeId');
    const apiData = {
      user_id: userId,
      store_id: storeId,
    };
    try {
      const res = await getUserCardsHistory(apiData);
      if (res?.status === 200) {
        setStampCards(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStampsData();
  }, [isActive]);

  const [isConnected, setIsConnected] = useState<Boolean | null>(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    setUnsubscribe(() => unsubscribeNetInfo);
    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  const handleRetry = async () => {
    if (unsubscribe) unsubscribe();
    const netState = await NetInfo.fetch();
    setIsConnected(netState.isConnected);
    const newUnsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    setUnsubscribe(() => newUnsubscribe);
  };

  const handleTabSwitch = (tab: CardStatus) => {
    setSectionLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setSectionLoading(false);
    }, 300);
  };

  if (!isConnected) return <Offline retryAction={handleRetry} />;
  if (loading)
    return (
      <View style={styles.centered}>
        <Loader />
      </View>
    );

  const tabMap: Record<CardStatus, ImprovedStampCard[]> = {
    active: stampCards.active_cards,
    expired: stampCards.expired_cards,
    awaiting: stampCards.awaiting_cards,
  };

  const displayedCards = tabMap[activeTab];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        {(['active', 'awaiting', 'expired'] as CardStatus[]).map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabSwitch(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {sectionLoading ? (
        <View style={styles.centered}>
          <Loader />
        </View>
      ) : displayedCards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No cards in this section</Text>
        </View>
      ) : (
        <View>
          {displayedCards.map(item => (
            <View
              key={item.card_uuid}
              style={[
                styles.card,
                item.status === 'expired'
                  ? styles.redeemedCard
                  : item.status === 'active'
                  ? styles.activeCard
                  : styles.awaitingCard,
              ]}>
              <Text style={styles.storeName}>
                {item.store_name || 'Store Name'}
              </Text>
              <Text style={styles.address}>
                {item.store_address || 'Address not available'}
              </Text>
              <Text style={styles.date}>
                Created: {format(new Date(item.created_at), 'dd-MMMM-yyyy')}
              </Text>
              <Text style={styles.date}>
                Marked:{' '}
                {item.marked_date
                  ? format(new Date(item.marked_date), 'dd-MMMM-yyyy')
                  : 'N/A'}
              </Text>
              <Text style={styles.status}>
                Status: {item.status.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
    backgroundColor: colors.backgroundIvory,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  activeTabButton: {
    backgroundColor: '#000',
  },
  tabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  activeCard: {
    backgroundColor: '#4CAF50',
  },
  redeemedCard: {
    backgroundColor: '#727171',
  },
  awaitingCard: {
    backgroundColor: '#927b04',
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  address: {
    fontSize: 14,
    color: '#fff',
  },
  date: {
    fontSize: 14,
    color: '#fff',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserPassHistory;
