import React from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme/theme';

interface Props {
    periode: string;
    setPeriode: (val: string) => void;
    ckPeriode: boolean;
    setCkPeriode: (val: boolean) => void;
    idCustomer: string;
    setIdCustomer: (val: string) => void;
    idProduct: string;
    setIdProduct: (val: string) => void;
    onSearch: () => void;
}

export const ListPaymentFilterComponent = ({
    periode, setPeriode, ckPeriode, setCkPeriode, idCustomer, setIdCustomer, idProduct, setIdProduct, onSearch
}: Props) => {
    return (
        <View style={styles.filterContainer}>
            <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>All Periode</Text>
                <Switch
                    value={ckPeriode}
                    onValueChange={setCkPeriode}
                />
            </View>
            {!ckPeriode && (
                <TextInput
                    style={styles.input}
                    placeholder="Periode (YYYY-MM)"
                    value={periode}
                    onChangeText={setPeriode}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Customer ID / ALL"
                value={idCustomer}
                onChangeText={setIdCustomer}
            />
            <TextInput
                style={styles.input}
                placeholder="Product ID / Name"
                value={idProduct}
                onChangeText={setIdProduct}
            />
            <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        padding: 15,
        backgroundColor: 'white',
        marginBottom: 10
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fafafa'
    },
    searchButton: {
        backgroundColor: theme.colors.primary,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center'
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});
