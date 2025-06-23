import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../utils/colors';


const { width } = Dimensions.get('window');
const HORIZONTAL_SPACING = 16;

type FilterType = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_YEAR';

interface Props {
  title: string;
  value: number;
  additionalText?: string
  onFilterChange: (filter: FilterType) => void;
  gradient: [string, string]
}

const CardWithFilterMenu = ({ title, additionalText, value, onFilterChange, gradient }: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selected, setSelected] = useState<FilterType>('THIS_WEEK');

  const handleSelect = (filter: FilterType) => {
    setSelected(filter);
    setMenuVisible(false);
    onFilterChange(filter);
  };

  // Calculate width for two cards per row, accounting for HomeScreen's paddingHorizontal and gap
  const cardWidth = (width - (2 * HORIZONTAL_SPACING) - HORIZONTAL_SPACING) / 2;

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { width: cardWidth, borderRadius: 20, overflow: 'hidden' }]}> {/* ADD borderRadius + overflow */}

      <View style={styles.innerCardContent}>
        <TouchableOpacity
          onPress={() => setMenuVisible(prev => !prev)}
          style={styles.menuButton}>
          <MoreVertical size={20} color="#64748b" />
        </TouchableOpacity>

        {menuVisible && (
          <View style={styles.dropdown}>
            {(['TODAY', 'THIS_WEEK', 'THIS_MONTH', 'THIS_YEAR'] as FilterType[]).map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => handleSelect(item)}
                style={[
                  styles.menuItem,
                  selected === item && styles.selectedMenuItem,
                ]}>
                <Text
                  style={[
                    styles.menuText,
                    selected === item && styles.selectedMenuText,
                  ]}>
                  {item.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>{selected.replace('_', ' ')}</Text>
          <Text style={styles.value}>{value.toLocaleString()}</Text>
          {additionalText ?
            <Text style={styles.subtitle}>{additionalText}</Text>
            : null}
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

    </LinearGradient>


  );
};

export default CardWithFilterMenu;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    overflow: 'visible',
  },
  innerCardContent: {
    padding: 10,
    flex: 1,
    borderRadius: 20,

  },
  contentContainer: {
    marginTop: 8,
    paddingVertical: 10
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    zIndex: 300,
    minWidth: 160,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectedMenuItem: {
    backgroundColor: '#f8fafc',
  },
  menuText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedMenuText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.black,
    marginTop: 2,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  value: {
    fontSize: 75,
    fontWeight: '800',
    marginTop: 8,
    color: '#0f172a',
    letterSpacing: -0.5,
  },
});
