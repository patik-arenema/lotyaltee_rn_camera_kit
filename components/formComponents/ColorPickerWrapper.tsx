import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ColorPicker from 'react-native-wheel-color-picker';
import { colors } from '../../utils/colors';

type Props = {
  defaultColor: string;
  onColorSelected: (color: string) => void;
};

const ColorPickerWrapper: React.FC<Props> = ({
  defaultColor,
  onColorSelected,
}) => {
  const [color, setColor] = useState(defaultColor);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);

  const togglePicker = () => setShowPicker(prev => !prev);

  const handleColorChange = (selectedColor: string) => {
    setColor(selectedColor);
    onColorSelected(selectedColor);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={togglePicker} style={styles.buttonWrapper}>
        <LinearGradient
    colors={[colors.backgroundIvory, colors.backgroundIvory, color, color]}
          locations={[0, 0.5, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>
            {showPicker ? 'Close' : 'Select Color'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.pickerContainer}>
          <ColorPicker
            color={color}
            onColorChange={setColor}
            onColorChangeComplete={handleColorChange}
            thumbSize={30}
            sliderSize={30}
            noSnap={true}
            row={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    marginBottom: 20,
  },
  buttonWrapper: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden', 
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor:colors.black
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    paddingBottom:20
  },
  pickerContainer: {
    height: 250,
    width: '100%',
  },
});

export default ColorPickerWrapper;
