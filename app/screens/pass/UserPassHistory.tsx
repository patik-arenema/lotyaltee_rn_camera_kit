import NetInfo from '@react-native-community/netinfo';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getUserCardsHistory } from '../../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Offline from '../../../components/Offline';
import Loader from '../../../components/Loader';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { ArrowLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabParamList, RootStackParamList } from '../../types/navigation';

const { width, height } = Dimensions.get('window');

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

type ConfigNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Scan Pass'
>;

const UserPassHistory = () => {
  const navigation = useNavigation<ConfigNavigationProp>();

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


  const tabMap: Record<CardStatus, ImprovedStampCard[]> = {
    active: stampCards.active_cards,
    expired: stampCards.expired_cards,
    awaiting: stampCards.awaiting_cards,
  };

  const displayedCards = tabMap[activeTab];

  if (loading)
    return (
      <View style={styles.centered}>
        <Loader />
      </View>
    );

  if (!isConnected) return <Offline retryAction={handleRetry} />;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Scan Pass')}
      >
        <ArrowLeft size={24} color={colors.primary} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        {(["active", "awaiting", "expired"] as CardStatus[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabSwitch(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
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
        <View style={styles.cardList}>
          {displayedCards.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.9}
              key={item.card_uuid}
              style={[
                styles.cardItemFull,
                item.status === "expired"
                  ? styles.redeemedCard
                  : item.status === "active"
                    ? styles.activeCard
                    : styles.awaitingCard,
              ]}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  {item.store_name || "Store Name"}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {item.store_address || "Address not available"}
                </Text>
                <Text style={styles.cardDetail}>
                  <Text style={styles.cardLabel}>Stamps marked:</Text>{" "}
                  {item.no_of_stamps}
                </Text>
                <Text style={styles.cardDetail}>
                  <Text style={styles.cardLabel}>Last Marked:</Text>{" "}
                  {item.marked_date
                    ? format(new Date(item.marked_date), "dd MMM yyyy")
                    : "N/A"}
                </Text>
                <Text style={styles.cardDetail}>
                  <Text style={styles.cardLabel}>Created on:</Text>{" "}
                  {item.created_at ? format(new Date(item.created_at), "dd MMM yyyy") : "N/A"}
                </Text>
              </View>
            </TouchableOpacity>
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
    paddingTop: 70,
    backgroundColor: colors.backgroundIvory,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
  },
  activeTabButton: {
    backgroundColor: colors.button,
  },
  tabText: {
    color: colors.black,
    fontWeight: "600",
  },
  activeTabText: {
    color: colors.white,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardList: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 30,
  },

  cardItemFull: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardContent: {
    flexDirection: "column",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937", // gray-900
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#4B5563", // gray-600
    marginBottom: 6,
  },

  cardDetail: {
    fontSize: 13,
    color: "#6B7280", // gray-500
    marginBottom: 2,
  },

  cardLabel: {
    fontWeight: "600",
    color: "#374151", // gray-700
  },

  cardStatus: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563EB", // blue-600
  },

  activeCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },

  redeemedCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#6B7280",
  },

  awaitingCard: {
    borderLeftWidth: 5,
    borderLeftColor: "#F59E0B",
  },

  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  address: {
    fontSize: 14,
    color: "#fff",
  },
  date: {
    fontSize: 14,
    color: "#fff",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 30,
  },

  cardItem: {
    width: (width - 40) / 2, // Two cards per row with margins
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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

export default UserPassHistory;
