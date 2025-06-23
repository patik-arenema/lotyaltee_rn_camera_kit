// components/DatePicker.tsx
import React from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type Props = {
    value: Date;
    onChange: (event: DateTimePickerEvent, date?: Date) => void;
    mode?: 'date' | 'time';
    maximumDate?: Date;
};

const DatePicker = ({ value, onChange, mode = 'date', maximumDate }: Props) => {
    return (
        <DateTimePicker
            value={value}
            themeVariant="light"
            mode={mode}
            display="spinner"
            onChange={onChange}
            maximumDate={maximumDate}
        />
    );
};

export default DatePicker;
