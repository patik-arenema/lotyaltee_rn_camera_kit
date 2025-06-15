import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {StampConfigType} from '../app/types/passDetails';
import {colors} from '../utils/colors';
import {fonts} from '../utils/fonts';
const {width} = Dimensions.get('window');
const circleSize = width / 5;

type Props = {
  stamp_config: StampConfigType;
};
const StampCardPreview = ({stamp_config}: Props) => {
  console.log('Pass config in pass preview', stamp_config);

  return (
    <View
      style={[styles.card, {backgroundColor: stamp_config.background_color}]}>
        <Text style={[styles.cardTitle,{color:stamp_config.label_color}]}>Stamp Card</Text>
      <View style={styles.circleContainer}>
        {[...Array(stamp_config?.no_of_stamps)].map((_, index) => (
          <TouchableOpacity key={index}>
            {index === (stamp_config?.no_of_stamps ?? 0) - 1 ? (
              <View
                style={[
                  styles.circle,
                  stamp_config?.stamp_shape === 'square' && {
                    borderRadius: 8,
                  },
                  {
                    backgroundColor: stamp_config?.stamp_fill_color,
                  },
                ]}>
                <Text
                  style={{
                    color: stamp_config?.stamp_text_color,
                  }}>
                  Free
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.circle,
                  stamp_config?.stamp_shape === 'square' && {
                    borderRadius: 8,
                  },
                  {
                    backgroundColor: stamp_config?.stamp_fill_color,
                  },
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: colors.black,
  },

  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeDetails: {
    marginVertical: 20,
    alignItems: 'center',
  },
  storeName: {
    fontSize: 32,
    fontFamily: fonts.bold,
    color: colors.black,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  storeAddress: {
    fontSize: 20,
    fontFamily: fonts.regular,
    color: colors.black,
    textAlign: 'center',
    marginTop: 5,
  },
  card: {
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent:"center",
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginTop: 10,
    marginVertical: 50,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: fonts.semiBold,
    marginBottom: 15,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  circleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 15, 
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2, // Ensures the circle shape
    backgroundColor: 'rgba(163, 244, 255, 0.374)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  filledCircle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectedCircle: {
    borderColor: 'gold',
    transform: [{scale: 1.1}],
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Less transparency for better readability
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    marginBottom: 10,
    color: colors.primary, // Use primary color or a dark color
  },

  modalText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: '#333', // Dark gray for readability
    textAlign: 'center',
  },

  cancelText: {
    color: colors.primary, // Keep it noticeable
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 12,
    padding: 14,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#000000',
  },
  verifyButton: {
    width: '50%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 5,
  },
  gradientButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    padding: 12,
    textTransform: 'uppercase',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  closeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusOverlay: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{translateX: -40}, {translateY: -40}],
    backgroundColor: 'rgba(255, 255, 255, 0)',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  overlayContainer: {
    alignItems: 'center',
  },
  overlayText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
export default StampCardPreview;
