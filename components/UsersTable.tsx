import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../utils/colors';
import { MoreVertical } from 'lucide-react-native';

type FilterType = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_YEAR';

type Customer = {
    name: string;
    email: string;
    visit_count: string;
};

type Props = {
    data: Customer[];
    onFilterChange: (filter: FilterType) => void;
};

const UsersTable: React.FC<Props> = ({ data, onFilterChange }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [selected, setSelected] = useState<FilterType>('THIS_WEEK');

    const handleSelect = (filter: FilterType) => {
        setSelected(filter);
        setMenuVisible(false);
        onFilterChange(filter);
    };

    return (
        <View style={styles.tableContainer}>
            <View style={styles.headerContainer}>
                {/* Title on Top */}
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>Top 10 Customers</Text>
                </View>

                {/* Filter + Menu Below */}
                <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>{selected.replace('_', ' ')}</Text>
                    <TouchableOpacity
                        onPress={() => setMenuVisible(prev => !prev)}
                        style={styles.menuButton}>
                        <MoreVertical size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>

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
            </View>

            <View style={styles.headerRow}>
                <Text style={[styles.cell, styles.headerText, styles.leftAligned]}>Name</Text>
                <Text style={[styles.cell, styles.headerText, styles.centerAligned]}>Email</Text>
                <Text style={[styles.cell, styles.headerText, styles.rightAligned]}>Visits</Text>
            </View>

            {data?.map((item, index) => {
                return (
                    <View style={[styles.dataRow, { backgroundColor: index % 2 == 0 ? "#D0E5E9" : "#C5E1A5" }]} key={index}>
                        <Text style={[styles.cell, styles.leftAligned]}>{item.name}</Text>
                        <Text style={[styles.cell, styles.centerAligned]}>{item.email}</Text>
                        <Text style={[styles.cell, styles.rightAligned]}>{item.visit_count}</Text>
                    </View>
                )
            })}

        </View>
    );
};

export default UsersTable;

const styles = StyleSheet.create({
    tableContainer: {
        width: '100%',
        marginTop: 24,
        marginBottom: 80,
        backgroundColor: "#DFE6F0",
        borderRadius: 12,
        paddingVertical: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    headerContainer: {
        flexDirection: 'column',
        paddingHorizontal: 14,
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.black,
    },
    titleWrapper: {
        marginBottom: 8,
    },

    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    filterLabel: {
        fontSize: 14,
        paddingRight: 4,
        fontWeight: '600',
        color: colors.black,
    },
    menuButton: {
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        padding: 6,
    },
    dropdown: {
        position: 'absolute',
        top: 65,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        minWidth: 160,
        zIndex: 200,
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
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 8,
        marginTop: 12,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: "#A2AEB7"
    },
    dataRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    cell: {
        flex: 1,
        fontSize: 14,
        color: colors.black,
    },
    headerText: {
        fontWeight: '600',
        color: '#1e293b',
    },
    leftAligned: {
        textAlign: 'left',
        paddingLeft: 2
    },
    centerAligned: {
        textAlign: 'center',
    },
    rightAligned: {
        textAlign: 'right',
        paddingRight: 2
    },
});
