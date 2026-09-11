import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Printer } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useCustomerInvoice } from '../hooks/useCustomerInvoice';
import { ErrorState } from '../../../components/shared/ErrorState';
import { formatRp, formatUsd } from '../../../utils/helpers/money';
import { formatTerbilang } from '../../../utils/helpers/terbilang';
import { theme } from '../../../theme/theme';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmtDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

// ─── Styles (React Native style objects) ───────────────────────────────────

const S = {
    page: { backgroundColor: '#fff' },
    headerSection: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        paddingBottom: 8,
        marginBottom: 12,
        marginHorizontal: 16,
        marginTop: 12,
    },
    logoLeft: { fontSize: 14, fontWeight: '900' as const, color: '#1a1a1a', lineHeight: 20 },
    logoRight: { fontSize: 10, color: '#555', textAlign: 'right' as const },
    title: { fontSize: 18, fontWeight: '900' as const, textAlign: 'center' as const, letterSpacing: 2, marginBottom: 10 },
    infoRow: { flexDirection: 'row' as const, marginBottom: 3, paddingHorizontal: 16 },
    infoLabel: { width: 150, fontSize: 12, color: '#333' },
    infoValue: { fontSize: 12, color: '#111', flex: 1 },
    sectionLabel: { fontSize: 12, fontWeight: '700' as const, marginBottom: 2, paddingHorizontal: 16 },
    buyerName: { fontSize: 13, fontWeight: '800' as const, paddingHorizontal: 16 },
    buyerAddress: { fontSize: 12, color: '#444', paddingHorizontal: 16 },
    // Table
    tableContainer: { marginHorizontal: 16, borderWidth: 1, borderColor: '#000', marginTop: 8 },
    tableHeader: { flexDirection: 'row' as const, borderBottomWidth: 1, borderColor: '#000', backgroundColor: '#f5f5f5' },
    tableRow: { flexDirection: 'row' as const, borderBottomWidth: 1, borderColor: '#ddd' },
    tableRowLast: { flexDirection: 'row' as const },
    thNo: { width: 36, borderRightWidth: 1, borderColor: '#000', padding: 5, textAlign: 'center' as const, fontSize: 11, fontWeight: '700' as const },
    thDeskripsi: { flex: 1, borderRightWidth: 1, borderColor: '#000', padding: 5, fontSize: 11, fontWeight: '700' as const },
    thQty: { width: 80, borderRightWidth: 1, borderColor: '#000', padding: 5, textAlign: 'center' as const, fontSize: 11, fontWeight: '700' as const },
    thHarga: { width: 110, borderRightWidth: 1, borderColor: '#000', padding: 5, textAlign: 'center' as const, fontSize: 11, fontWeight: '700' as const },
    thSubtotal: { width: 110, padding: 5, textAlign: 'center' as const, fontSize: 11, fontWeight: '700' as const },
    tdNo: { width: 36, borderRightWidth: 1, borderColor: '#ddd', padding: 5, textAlign: 'center' as const, fontSize: 11 },
    tdDeskripsi: { flex: 1, borderRightWidth: 1, borderColor: '#ddd', padding: 5, fontSize: 11 },
    tdQty: { width: 80, borderRightWidth: 1, borderColor: '#ddd', padding: 5, textAlign: 'center' as const, fontSize: 11 },
    tdHarga: { width: 110, borderRightWidth: 1, borderColor: '#ddd', padding: 5, fontSize: 11 },
    tdSubtotal: { width: 110, padding: 5, fontSize: 11 },
    currencyAmount: { flexDirection: 'row' as const, justifyContent: 'space-between' as const },
    // Summary rows
    summaryRow: { flexDirection: 'row' as const, borderTopWidth: 1, borderColor: '#000' },
    summaryLabel: { flex: 1, borderRightWidth: 1, borderColor: '#000', padding: 5, textAlign: 'right' as const, fontSize: 11, fontWeight: '700' as const },
    summaryValue: { width: 110, padding: 5, fontSize: 11 },
    // Footer
    footerSection: { paddingHorizontal: 16, marginTop: 16 },
    footerText: { fontSize: 12, marginBottom: 2 },
    footerBold: { fontWeight: '700' as const },
    signSection: { marginTop: 24, paddingHorizontal: 16 },
    signTitle: { fontSize: 12, fontWeight: '700' as const, marginBottom: 48 },
    signName: { fontSize: 12, fontWeight: '700' as const },
    signRole: { fontSize: 11, color: '#444' },
    signCompany: { fontSize: 12, fontWeight: '800' as const },
};

// ─── Screen ─────────────────────────────────────────────────────────────────

export const CustomerInvoicePrintInvoiceScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params;

    const { detail, loadingDetail, error, getDetail, clearInvoiceDetail } = useCustomerInvoice();

    useEffect(() => {
        getDetail(id);
    }, [id]);

    const handlePrint = () => {
        if (Platform.OS === 'web') {
            window.print();
        } else {
            alert('Fitur print pada perangkat mobile sedang dalam pengembangan.');
        }
    };

    if (error && !detail) {
        return (
            <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
                <HeaderNavigator title="PRINT INVOICE V1" showBackButton onBackPress={() => navigation.goBack()} />
                <ErrorState error={error} onRetry={() => getDetail(id)} />
            </View>
        );
    }

    const renderContent = () => {
        if (loadingDetail || !detail) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            );
        }

        const isUSD = detail.vcurrency === 'USD';
        const fmt = (val: number, decimals = 0) => {
            if (isUSD) return formatUsd(val);
            if (decimals > 0) return 'Rp ' + val.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
            return formatRp(val);
        };
        const currLabel = isUSD ? 'USD' : 'RP';

        const hasPPN = String(detail.flag_ppn) === '1';
        const ppnPersen = Number(detail.nppn_amount) || 0;

        // Collect items
        const items: any[] = detail.barang || detail.items || [];

        // Calculate subtotal (harga sebelum PPN)
        let subTotal = 0;
        const itemsWithPrice = items.map((item: any) => {
            let hargaSatuan = Number(item.product_price) || 0;
            if (hasPPN && ppnPersen > 0) {
                hargaSatuan = (100 / (100 + ppnPersen)) * hargaSatuan;
            }
            const lineTotal = hargaSatuan * Number(item.nqty);
            subTotal += lineTotal;
            return { ...item, hargaSatuan, lineTotal };
        });

        const ppnAmount = hasPPN ? (ppnPersen / 100) * subTotal : 0;
        const total = subTotal + ppnAmount;

        const namaAtas = hasPPN ? 'PT EKAMAJU MESININDO' : 'KARNO HALIM';
        const noRekening = hasPPN ? '168-3100-980' : '168-302-0625';
        const namaPenanda = hasPPN ? 'Karno Halim' : 'Erawati';
        const jabatanPenanda = hasPPN ? 'Direktur' : 'Manager Accounting Finance';

        return (
            <ScrollView style={S.page} showsVerticalScrollIndicator={false}>
                {/* Header Logo */}
                <View style={S.headerSection}>
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        <Image source={require('../../../assets/images/logo_eka_alamat_old.png')} style={{ height: 60, width: 250 }} resizeMode="contain" />
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Image source={require('../../../assets/images/logo_kan.png')} style={{ height: 60, width: 80 }} resizeMode="contain" />
                    </View>
                </View>

                {/* Title */}
                <Text style={S.title}>INVOICE</Text>

                {/* Info Header */}
                <View style={S.infoRow}>
                    <Text style={S.infoLabel}>NOMOR INVOICE</Text>
                    <Text style={S.infoValue}>: {detail.code_invoice}</Text>
                </View>
                <View style={S.infoRow}>
                    <Text style={S.infoLabel}>TANGGAL INVOICE</Text>
                    <Text style={S.infoValue}>: {fmtDate(detail.date_invoice)}</Text>
                </View>
                <View style={S.infoRow}>
                    <Text style={S.infoLabel}>SALES CONTRACT NO</Text>
                    <Text style={S.infoValue}>: {detail.code_so}</Text>
                </View>
                <View style={S.infoRow}>
                    <Text style={S.infoLabel}>NO PO</Text>
                    <Text style={S.infoValue}>: {detail.no_po_cust || '-'}</Text>
                </View>

                {/* Buyer */}
                <View style={{ marginTop: 14, marginBottom: 8 }}>
                    <Text style={S.sectionLabel}>PEMBELI/BUYER:</Text>
                    <Text style={S.buyerName}>{detail.nm_customers}</Text>
                    {!!detail.customers_address_invoice && (
                        <Text style={S.buyerAddress}>{detail.customers_address_invoice}</Text>
                    )}
                    {!!detail.customers_phone && (
                        <Text style={S.buyerAddress}>Tel. {detail.customers_phone}</Text>
                    )}
                </View>

                {/* Table */}
                <View style={S.tableContainer}>
                    {/* Header */}
                    <View style={S.tableHeader}>
                        <Text style={S.thNo}>No</Text>
                        <Text style={S.thDeskripsi}>Deskripsi Barang</Text>
                        <Text style={S.thQty}>Qty</Text>
                        <Text style={S.thHarga}>Harga Satuan</Text>
                        <Text style={S.thSubtotal}>Sub Total</Text>
                    </View>

                    {/* Rows */}
                    {itemsWithPrice.map((item: any, idx: number) => (
                        <View key={`${item.id_product}_${idx}`} style={S.tableRow}>
                            <Text style={S.tdNo}>{idx + 1}</Text>
                            <Text style={S.tdDeskripsi}>{item.code_product} - {item.nm_product}</Text>
                            <Text style={S.tdQty}>{item.nqty} {item.nm_product_satuan}</Text>
                            <View style={S.tdHarga}>
                                <View style={S.currencyAmount}>
                                    <Text style={{ fontSize: 11 }}>{currLabel}</Text>
                                    <Text style={{ fontSize: 11 }}>
                                        {isUSD
                                            ? item.hargaSatuan.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            : Math.round(item.hargaSatuan).toLocaleString('id-ID')}
                                    </Text>
                                </View>
                            </View>
                            <View style={S.tdSubtotal}>
                                <View style={S.currencyAmount}>
                                    <Text style={{ fontSize: 11 }}>{currLabel}</Text>
                                    <Text style={{ fontSize: 11 }}>
                                        {isUSD
                                            ? item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                            : Math.round(item.lineTotal).toLocaleString('id-ID')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    {/* Summary rows */}
                    {hasPPN && (
                        <View style={S.summaryRow}>
                            <Text style={S.summaryLabel}>SUBTOTAL</Text>
                            <View style={S.summaryValue}>
                                <View style={S.currencyAmount}>
                                    <Text style={{ fontSize: 11 }}>{currLabel}</Text>
                                    <Text style={{ fontSize: 11 }}>
                                        {isUSD
                                            ? subTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })
                                            : Math.round(subTotal).toLocaleString('id-ID')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {hasPPN && (
                        <View style={S.summaryRow}>
                            <Text style={S.summaryLabel}>PPN {ppnPersen}%</Text>
                            <View style={S.summaryValue}>
                                <View style={S.currencyAmount}>
                                    <Text style={{ fontSize: 11 }}>{currLabel}</Text>
                                    <Text style={{ fontSize: 11 }}>
                                        {isUSD
                                            ? ppnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
                                            : Math.round(ppnAmount).toLocaleString('id-ID')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={[S.summaryRow, { borderTopWidth: 1, borderColor: '#000' }]}>
                        <Text style={[S.summaryLabel, { fontWeight: '900' }]}>TOTAL</Text>
                        <View style={S.summaryValue}>
                            <View style={S.currencyAmount}>
                                <Text style={{ fontSize: 11, fontWeight: '700' }}>{currLabel}</Text>
                                <Text style={{ fontSize: 11, fontWeight: '700' }}>
                                    {isUSD
                                        ? total.toLocaleString('en-US', { minimumFractionDigits: 2 })
                                        : Math.round(total).toLocaleString('id-ID')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={S.footerSection}>
                    <Text style={[S.footerText, { marginTop: 12 }]}>
                        <Text style={S.footerBold}>JUMLAH INVOICE INI</Text>
                        {': Rp. '}{Math.round(total).toLocaleString('id-ID')}
                    </Text>
                    <Text style={S.footerText}>
                        <Text style={S.footerBold}>TERBILANG</Text>
                        {': '}{formatTerbilang(total)}
                    </Text>

                    <View style={{ marginTop: 14 }}>
                        <Text style={S.footerText}>Pembayaran dapat di transfer/Bilyet giro/Cek ke:</Text>
                        <Text style={S.footerText}>
                            Nama Bank : <Text style={S.footerBold}>BCA KCU PLUIT LANDMARK BLOK A 8</Text>
                        </Text>
                        <Text style={S.footerText}>
                            Atas Nama : <Text style={S.footerBold}>{namaAtas}</Text>
                        </Text>
                        <Text style={S.footerText}>
                            No Rekening : <Text style={S.footerBold}>{noRekening}</Text>
                        </Text>
                    </View>
                </View>

                {/* Signature */}
                <View style={S.signSection}>
                    <Text style={S.signTitle}>PIHAK PENJUAL</Text>
                    <Text style={S.signName}>{namaPenanda}</Text>
                    <Text style={S.signRole}>{jabatanPenanda}</Text>
                    <Text style={S.signCompany}>PT. EKA MAJU MESININDO</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <HeaderNavigator
                title="PRINT INVOICE V1"
                showBackButton
                onBackPress={() => navigation.goBack()}
                rightComponent={
                    <TouchableOpacity
                        style={{ padding: 8, backgroundColor: '#374151', borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}
                        onPress={handlePrint}
                    >
                        <Printer size={16} color="white" />
                    </TouchableOpacity>
                }
            />
            <View style={{ flex: 1, backgroundColor: '#fff', margin: 0 }}>
                {renderContent()}
            </View>
        </View>
    );
};
