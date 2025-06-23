import { View, StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768; // iPad width

const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={[
    styles.container,
    // Only apply maxWidth on web/desktop, not on iPad/tablet
    Platform.OS === 'web' ? styles.webContainer : null
  ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    width: '100%',
    alignSelf: 'stretch',
  },
  webContainer: {
    maxWidth: 700,
    alignSelf: 'center',
  },
});

export default ResponsiveContainer;