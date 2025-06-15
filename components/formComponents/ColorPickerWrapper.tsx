import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
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

  // 🔁 Update internal color state when defaultColor changes
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
      <TouchableOpacity
        onPress={togglePicker}
        style={[styles.toggleButton, { backgroundColor: color }]}>
        <Text style={styles.buttonText}>
          {showPicker ? 'Close' : 'Select Color'}
        </Text>
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
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: colors.black,
    padding: 4,
  },
  pickerContainer: {
    height: 250,
    width: '100%',
  },
});

export default ColorPickerWrapper;
