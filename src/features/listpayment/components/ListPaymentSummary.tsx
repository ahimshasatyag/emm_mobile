import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ListPaymentSummaryItem } from '../types/listpayment.types';

interface Props {
    summary: ListPaymentSummaryItem[];
}

export const ListPaymentSummaryComponent = ({ summary }: Props) => {
    if (summary.length === 0) return null;

    const totalMonth = summary.filter(s => s.kategori === 'month').reduce((acc, curr) => acc + curr.product_price, 0);
    const qtyMonth = summary.filter(s => s.kategori === 'month').reduce((acc, curr) => acc + curr.nqty, 0);

    const totalYtd = summary.filter(s => s.kategori === 'ytd').reduce((acc, curr) => acc + curr.product_price, 0);
    const qtyYtd = summary.filter(s => s.kategori === 'ytd').reduce((acc, curr) => acc + curr.nqty, 0);

    return (
        <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Summary (Month)</Text>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Qty:</Text>
                <Text style={styles.summaryValue}>{qtyMonth}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Val:</Text>
                <Text style={styles.summaryValue}>Rp {totalMonth.toLocaleString('id-ID')}</Text>
            </View>

            <Text style={[styles.summaryTitle, { marginTop: 10 }]}>Summary (YTD)</Text>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Qty:</Text>
                <Text style={styles.summaryValue}>{qtyYtd}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Val:</Text>
                <Text style={styles.summaryValue}>Rp {totalYtd.toLocaleString('id-ID')}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    summaryContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    summaryLabel: {
        color: '#555'
    },
    summaryValue: {
        fontWeight: 'bold',
        color: '#333'
    }
});
