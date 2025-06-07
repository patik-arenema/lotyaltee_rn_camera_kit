import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import {MoreVertical} from 'lucide-react-native';

type FilterType = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_YEAR';

interface Props {
  title: string;
  value: number;
  onFilterChange: (filter: FilterType) => void;
}

const CardWithFilterMenu = ({title, value, onFilterChange}: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selected, setSelected] = useState<FilterType>('THIS_WEEK');

  const handleSelect = (filter: FilterType) => {
    setSelected(filter);
    setMenuVisible(false);
    onFilterChange(filter);
  };

  return (
    <View style={styles.card}>
      {/* Menu Icon */}
      <TouchableOpacity
        onPress={() => setMenuVisible(prev => !prev)}
        style={styles.menuButton}>
        <MoreVertical size={20} color="#333" />
      </TouchableOpacity>

      {/* Dropdown menu */}
      {menuVisible && (
        <View style={styles.dropdown}>
          {(
            ['TODAY', 'THIS_WEEK', 'THIS_MONTH', 'THIS_YEAR'] as FilterType[]
          ).map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => handleSelect(item)}
              style={styles.menuItem}>
              <Text style={styles.menuText}>{item.replace('_', ' ')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Text content */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{selected.replace('_', ' ')}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default CardWithFilterMenu;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    elevation: 3,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 1, height: 2},
    shadowRadius: 4,
    zIndex: 10,
  },
  menuButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    padding: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    zIndex: 300,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 14,
    color: '#333',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 6,
    color: '#111',
  },
});
