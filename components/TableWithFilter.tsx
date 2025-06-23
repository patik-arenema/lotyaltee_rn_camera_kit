import { Picker } from '@react-native-picker/picker';
import { ArrowDown, ArrowLeft, ArrowRight, ChevronDown, FileSpreadsheet } from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,

} from 'react-native';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { exportToExcel } from './ExportToExcel';

const CELL_WIDTH = Dimensions.get('window').width / 2.5
type Props = {
    data: Array<Record<string, any>>;
    title: string
};

const TableWithFilter: React.FC<Props> = ({ data, title }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredData = useMemo(() => {
        const lowerSearch = searchQuery.toLowerCase();
        return data.filter(row =>
            Object.values(row).some(value =>
                String(value).toLowerCase().includes(lowerSearch)
            )
        );
    }, [searchQuery, data]);

    const totalData = filteredData.length;
    const totalPages = Math.ceil(totalData / pageSize);
    const startIdx = (currentPage - 1) * pageSize;
    const paginatedData = filteredData.slice(startIdx, startIdx + pageSize);

    const columnHeaders = data.length > 0 ? Object.keys(data[0]) : [];

    const handlePageChange = (direction: 'next' | 'prev') => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const startCount = totalData === 0 ? 0 : startIdx + 1;
    const endCount = Math.min(startIdx + pageSize, totalData);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{title}</Text>
            <TouchableOpacity style={styles.exportButton} onPress={() => exportToExcel(data)}>
                <FileSpreadsheet size={20} color={colors.white} /> <Text style={styles.exportButtonText}>Download Excel</Text>
            </TouchableOpacity>
            <TextInput
                placeholder="Search..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={text => {
                    setSearchQuery(text);
                    setCurrentPage(1);
                }}
            />

            <ScrollView horizontal>
                <View>
                    <View style={styles.headerRow}>
                        {columnHeaders.map((header, index) => (
                            <Text key={index} style={styles.headerCell}>
                                {header?.toUpperCase()?.replaceAll("_", " ")}
                            </Text>
                        ))}
                    </View>
                    <ScrollView style={{ maxHeight: 400 }}>
                        {paginatedData.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.dataRow}>
                                {columnHeaders.map((key, colIndex) => (
                                    <Text key={colIndex} style={styles.cell}>
                                        {row[key]}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Pagination Info */}
            <View style={styles.paginationContainer}>
                <Text style={styles.countText}>
                    Showing {startCount}–{endCount} of {totalData} results
                </Text>

                <View style={styles.paginationButtons}>
                    <View style={styles.paginationBox}>
                        <TouchableOpacity
                            style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                            onPress={() => handlePageChange('prev')}
                            disabled={currentPage === 1}
                        >
                            <ArrowLeft size={15} />
                        </TouchableOpacity>

                        <Text style={styles.pageInfo}>
                            {currentPage} of {totalPages || 1}
                        </Text>

                        <TouchableOpacity
                            style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                            onPress={() => handlePageChange('next')}
                            disabled={currentPage === totalPages}
                        >
                            <ArrowRight size={15} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.pageSizeContainer}>
                        <Text style={{ marginRight: 6 }}>Page size</Text>
                        <TouchableOpacity
                            style={styles.dropdown}
                            onPress={() => setShowDropdown(!showDropdown)}
                        >
                            <Text >{pageSize}</Text>
                            <ChevronDown size={18} />
                        </TouchableOpacity>
                    </View>
                </View>
                {showDropdown && (
                    <View style={styles.dropdownList}>
                        {[5, 10, 20, 50].map(size => (
                            <TouchableOpacity
                                key={size}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setPageSize(size);
                                    setCurrentPage(1);
                                    setShowDropdown(false);
                                }}
                            >
                                <Text>{size}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

            </View>
        </View>
    );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        padding: 12,
        marginBottom: 40,
        backgroundColor: '#fff',
        paddingBottom: 10,
        elevation: 4,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
    },
    header: {
        fontSize: 24,
        fontWeight: "900",
        paddingVertical: 10,
        fontFamily: fonts.medium,
    },
    searchInput: {
        borderColor: colors.gray,
        color: colors.black,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        marginBottom: 12,
        height: 40,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        paddingVertical: 10,
    },
    exportButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        backgroundColor: '#4CAF50',
        padding: 10,
        marginBottom: 10,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
    },
    exportButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    headerCell: {
        fontWeight: 'bold',
        paddingHorizontal: 12,
        minWidth: CELL_WIDTH,
        maxWidth: CELL_WIDTH,
        width: CELL_WIDTH,
        textAlign: 'left', // or 'center' if preferred
    },

    cell: {
        paddingHorizontal: 12,
        minWidth: CELL_WIDTH,
        maxWidth: CELL_WIDTH,
        width: CELL_WIDTH,
        textAlign: 'left',
    },
    dataRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingVertical: 8,
    },

    paginationContainer: {
        marginTop: 12,
        borderTopWidth: 1,
        borderColor: '#eee',
        paddingTop: 10,
    },
    countText: {
        fontSize: 14,
        marginBottom: 8,
    },
    paginationButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginBottom: 10,
    },
    pageButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginHorizontal: 6,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    pageInfo: {
        fontSize: 14,
    },
    paginationBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pageSizeContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    pageSizePicker: {
        width: 100,
        height: 40,
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: 'red',
    },
    dropdown: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        backgroundColor: '#f5f5f5',
        minWidth: 80,
    },
    dropdownList: {
        position: 'absolute',
        top: -100, // Adjust based on screen layout
        right: -10,
        width: 100,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        zIndex: 9999,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },

});

export default TableWithFilter;
