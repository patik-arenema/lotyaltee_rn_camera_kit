import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

type Props = {
  defaultColor: string;
  onColorSelected: (color: string) => void;
};

const ColorPickerWrapper: React.FC<Props> = ({
  defaultColor,
  onColorSelected,
}) => {
  const [color, setColor] = useState(defaultColor);

  return (
    <View style={styles.container}>
      <ColorPicker
        color={color}
        onColorChange={setColor}
        onColorChangeComplete={onColorSelected}
        thumbSize={30}
        sliderSize={30}
        noSnap={true}
        row={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
    marginBottom: 20,
  },
});

export default ColorPickerWrapper;
