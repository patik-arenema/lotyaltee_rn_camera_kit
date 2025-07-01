import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Platform,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import TableWithFilter from '../../../components/TableWithFilter';
import { colors } from '../../../utils/colors';
import { getCustomerStampReport, getDaywiseTrendReport, getFreeCoffeeReport } from '../../../services/api/api';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabParamList } from '../../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fonts } from '../../../utils/fonts';
import { format } from 'date-fns';

type ConfigNavigationProp = NativeStackNavigationProp<BottomTabParamList, 'Settings'>;

const ReportsScreen = () => {
    const navigation = useNavigation<ConfigNavigationProp>();

    const [tableData, setTableData] = useState([]);
    const [title, setTitle] = useState('');
    const [reportType, setReportType] = useState<'customer' | 'redeemed' | 'stamp' | 'freeCoffee'>('customer');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [selectOpen, setSelectOpen] = useState(false);

    const reportOptions = [
        { label: 'Customer Stamps', value: 'customer' },
        { label: 'Weekly Coffee Redeemed Trend', value: 'redeemed' },
        { label: 'Weekly Marked Stamps Trend', value: 'stamp' },
        { label: 'Free Coffee Redeemed', value: 'freeCoffee' },
    ];

    const fetchData = async () => {
        try {
            const apiData = {
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
            };

            let apiResponseData;

            if (reportType === 'customer') {
                apiResponseData = await getCustomerStampReport(apiData);
                setTitle('Customers onboarded');
                setTableData(apiResponseData?.data || []);

            } else if (reportType === 'redeemed') {
                let trendData = { ...apiData, type: 'redeemed' }
                apiResponseData = await getDaywiseTrendReport(trendData);
                setTableData(apiResponseData?.data || []);

                setTitle('Weekly Coffee Redeemed Trend');
            } else if (reportType === 'stamp') {
                let trendData = { ...apiData, type: 'stamps' }
                apiResponseData = await getDaywiseTrendReport(trendData);
                setTableData(apiResponseData?.data || []);

                setTitle('Weekly Marked Stamps Trend');
            } else if (reportType === 'freeCoffee') {
                apiResponseData = await getFreeCoffeeReport(apiData);
                setTitle('Free Coffee Report');
                setTableData(apiResponseData?.data?.data || []);

            }
            console.log("api rews dataaaa", reportType, apiResponseData);
            if (apiResponseData?.status !== 200) {
                Alert.alert(apiResponseData?.message);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            Alert.alert('Error', 'Something went wrong while fetching the data.');
        }
    };


    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Settings')}>
                <ArrowLeft size={24} color={colors.primary} />
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.optionsContainer}>
                <Text style={styles.header}>Reports</Text>
                <Text style={{ paddingVertical: 4 }}>Select Report Type:</Text>

                <TouchableOpacity
                    style={styles.customSelect}
                    onPress={() => setSelectOpen(!selectOpen)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.customSelectText}>
                        {reportOptions.find(opt => opt.value === reportType)?.label}
                    </Text>
                    <ChevronDown size={20} />
                </TouchableOpacity>

                {selectOpen && (
                    <View style={styles.selectDropdown}>
                        {reportOptions.map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={styles.selectOption}
                                onPress={() => {
                                    setReportType(option.value as any);
                                    setSelectOpen(false);
                                }}
                            >
                                <Text style={styles.selectOptionText}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.datePickerContainer}>
                    <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
                        <Text>Start Date: {format(startDate, 'dd/MM/yyyy')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateButton}>
                        <Text>End Date: {format(endDate, 'dd/MM/yyyy')}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={fetchData}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>

            {tableData.length > 0 ? <View>
                <TableWithFilter title={title} data={tableData} date={{ start: startDate, end: endDate }} />
            </View> : <View style={[styles.optionsContainer, { alignItems: "center" }]}>
                <Text>No Data</Text></View>}
            <Modal visible={showStartPicker} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="spinner"
                            themeVariant="light"
                            minimumDate={new Date(2025, 0, 1)}
                            maximumDate={new Date()}
                            onChange={(_, date) => {
                                if (date) {
                                    if (date > endDate) {
                                        Alert.alert('Invalid Date', 'Start date cannot be after end date.');
                                        return;
                                    }
                                    setStartDate(date);
                                }
                            }}
                        />
                        <TouchableOpacity onPress={() => setShowStartPicker(false)} style={styles.doneButton}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal visible={showEndPicker} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="spinner"
                            themeVariant="light"
                            minimumDate={new Date(2025, 0, 1)}
                            maximumDate={new Date()}
                            onChange={(_, date) => {
                                if (date) {
                                    const sixMonthsAfterStart = new Date(startDate);
                                    sixMonthsAfterStart.setMonth(sixMonthsAfterStart.getMonth() + 6);

                                    if (date > sixMonthsAfterStart) {
                                        Alert.alert('Invalid Range', 'End date cannot be more than 6 months after start date.');
                                        return;
                                    }

                                    setEndDate(date);
                                }
                            }}
                        />
                        <TouchableOpacity onPress={() => setShowEndPicker(false)} style={styles.doneButton}>
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
};

export default ReportsScreen;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 50,
        paddingHorizontal: 10,
        backgroundColor: colors.backgroundIvory,
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
    header: {
        fontSize: 32,
        paddingVertical: 10,
        fontFamily: fonts.medium,
    },
    optionsContainer: {
        marginVertical: 10,
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
    },
    customSelect: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        backgroundColor: '#fff',
        marginBottom: 10,
        justifyContent: "space-between",
        flexDirection: "row"

    },
    customSelectText: {
        fontSize: 16,
        color: '#333',
    },
    selectDropdown: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        zIndex: 999,
        elevation: 3,
    },
    selectOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectOptionText: {
        fontSize: 16,
        color: '#333',
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    dateButton: {
        paddingVertical: 10,
        backgroundColor: colors.backgroundIvory,
        borderWidth: 1,
        borderColor: colors.button,
        borderRadius: 5,
        marginBottom: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    submitButton: {
        backgroundColor: colors.button,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontFamily: fonts.medium,
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,

    },
    doneButton: {
        marginTop: 10,
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 5,
    },
    doneButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: fonts.medium,
    },
});
