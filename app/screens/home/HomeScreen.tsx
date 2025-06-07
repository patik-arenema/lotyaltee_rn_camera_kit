import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {
  customerOnboardedData,
  coffeeRedeemedData,
  cardsGeneratedData,
} from '../../../services/api/api'; // Replace with actual import
import CardWithFilterMenu from '../../../components/CardWithFilter';
import {useIsFocused} from '@react-navigation/native';

const HomeScreen = () => {
  const [onboarded, setOnboarded] = useState(0);
  const [redeemed, setRedeemed] = useState(0);
  const [cards, setCards] = useState(0);
  const [stamps, setStamps] = useState(0);

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
        // You may implement stamp logic similarly.
        setStamps(10); // Placeholder
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
    }
  }, [isFocus]);
  return (
    <ScrollView style={styles.container}>
      <CardWithFilterMenu
        title="Customer Onboarded"
        value={onboarded}
        onFilterChange={range => fetchData('onboarded', range)}
      />
      <CardWithFilterMenu
        title="Card Generated"
        value={cards}
        onFilterChange={range => fetchData('cards', range)}
      />
      <CardWithFilterMenu
        title="Coffee Redeemed"
        value={redeemed}
        onFilterChange={range => fetchData('redeemed', range)}
      />
      <CardWithFilterMenu
        title="Stamps Marked"
        value={stamps}
        onFilterChange={range => fetchData('stamps', range)}
      />
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});
