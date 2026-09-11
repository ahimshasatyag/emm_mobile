import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Image
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Printer } from 'lucide-react-native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useCustomerInvoice } from '../hooks/useCustomerInvoice';
import { ErrorState } from '../../../components/shared/ErrorState';
import { theme } from '../../../theme/theme';
import { formatTerbilang } from '../../../utils/helpers/terbilang';

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

const fmtNum = (val: number, isUSD: boolean) => {
    if (isUSD) {
        return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return val.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ─── Styles ─────────────────────────────────────────────────────────────────

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
    logoRight: { fontSize: 10, color: '#555' },
    title: { fontSize: 18, fontWeight: '900' as const, marginBottom: 10, textAlign: 'center' as const },
    infoTable: { marginHorizontal: 16, marginBottom: 16 },
    infoRow: { flexDirection: 'row' as const, marginBottom: 3 },
    infoLabel: { width: 140, fontSize: 12, color: '#333' },
    infoValue: { fontSize: 12, color: '#111', flex: 1 },
    sectionLabel: { fontSize: 12, fontWeight: '700' as const, marginBottom: 2, paddingHorizontal: 16 },
    buyerName: { fontSize: 13, fontWeight: '800' as const, paddingHorizontal: 16 },
    buyerAddress: { fontSize: 12, color: '#444', paddingHorizontal: 16 },
    tableContainer: { marginHorizontal: 16, borderWidth: 1, borderColor: '#000', marginTop: 8 },
    tableHeader: { flexDirection: 'row' as const, borderBottomWidth: 1, borderColor: '#000', backgroundColor: '#f5f5f5' },
    tableRow: { flexDirection: 'row' as const, borderBottomWidth: 1, borderColor: '#ddd' },
    thNo: { width: 36, borderRightWidth: 1, borderColor: '#000', padding: 5, textAlign: 'center' as const, fontSize: 11, fontWeight: '700' as const },
    thDeskripsi: { flex: 1, borderRightWidth: 1, borderColor: '#000', padding: 5, textAlign: 'center' as const, fontSize: 11, fontWeight: '700' as const },
    thQty: { width: 80, borderRightWidth: 1, borderColor: '#000', padding: 5, textAlign: 'center' as const, fontSize: 11, fontWeight: '700' as const },
    thHarga: { width: 120, borderRightWidth: 1, borderColor: '#000', padding: 5, textAlign: 'center' as const, fontSize: 11, fontWeight: '700' as const },
    thSubtotal: { width: 120, padding: 5, textAlign: 'center' as const, fontSize: 11, fontWeight: '700' as const },
    tdNo: { width: 36, borderRightWidth: 1, borderColor: '#ddd', padding: 5, textAlign: 'center' as const, fontSize: 11 },
    tdDeskripsi: { flex: 1, borderRightWidth: 1, borderColor: '#ddd', padding: 5, fontSize: 11 },
    tdQty: { width: 80, borderRightWidth: 1, borderColor: '#ddd', padding: 5, textAlign: 'center' as const, fontSize: 11 },
    tdHarga: { width: 120, borderRightWidth: 1, borderColor: '#ddd', padding: 5, fontSize: 11 },
    tdSubtotal: { width: 120, padding: 5, fontSize: 11 },
    currencyAmount: { flexDirection: 'row' as const, justifyContent: 'space-between' as const },
    summaryRow: { flexDirection: 'row' as const, borderTopWidth: 1, borderColor: '#000' },
    summaryLabel: { flex: 1, borderRightWidth: 1, borderColor: '#000', padding: 5, textAlign: 'right' as const, fontSize: 11, fontWeight: '700' as const },
    summaryValue: { width: 120, padding: 5, fontSize: 11 },
    footerSection: { paddingHorizontal: 16, marginTop: 16 },
    footerText: { fontSize: 12, marginBottom: 2 },
    footerBold: { fontWeight: '700' as const },
    signSection: { marginTop: 24, paddingHorizontal: 16 },
    signName: { fontSize: 12, fontWeight: '700' as const },
    signRole: { fontSize: 11, color: '#444' },
    signCompany: { fontSize: 12, fontWeight: '800' as const },
};

// ─── Screen ─────────────────────────────────────────────────────────────────

export const CustomerInvoiceInvDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id, id_invoice_dtl } = route.params;

    const { detail, loadingDetail, error, getDetail } = useCustomerInvoice();

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
                <HeaderNavigator title="PRINT INVOICE" showBackButton onBackPress={() => navigation.goBack()} />
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
        const currLabel = isUSD ? 'USD' : 'RP';
        const hasPPN = String(detail.flag_ppn) === '1';
        const ppnPersen = Number(detail.nppn_amount) || 0;

        const items: any[] = detail.barang || detail.items || [];
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

        // Find the specific payment detail
        const allPayments: any[] = detail.invoice_dtl || detail.payments || [];
        const currentPayment = allPayments.find((p: any) => String(p.id_invoice_dtl) === String(id_invoice_dtl));

        const namaAtas = hasPPN ? 'PT EKAMAJU MESININDO' : 'KARNO HALIM';
        const noRekening = hasPPN ? '168-3100-980' : '168-302-0625';
        
        const namaPenanda = hasPPN ? 'Karno Halim' : 'Erawati';
        const jabatanPenanda = hasPPN ? 'Direktur' : 'Manager Accounting Finance';

        const tglInvoice = currentPayment ? (currentPayment.date_cair ? currentPayment.date_cair : currentPayment.date_draft) : null;

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
                <View style={S.infoTable}>
                    <View style={S.infoRow}>
                        <Text style={S.infoLabel}>NOMOR INVOICE</Text>
                        <Text style={S.infoValue}>: {detail.code_invoice}</Text>
                    </View>
                    <View style={S.infoRow}>
                        <Text style={S.infoLabel}>TANGGAL INVOICE</Text>
                        <Text style={S.infoValue}>: {tglInvoice ? fmtDate(tglInvoice) : '-'}</Text>
                    </View>
                    <View style={S.infoRow}>
                        <Text style={S.infoLabel}>SALES CONTRACT NO</Text>
                        <Text style={S.infoValue}>: {detail.code_so}</Text>
                    </View>
                    <View style={S.infoRow}>
                        <Text style={S.infoLabel}>NO PO</Text>
                        <Text style={S.infoValue}>: {detail.no_po_cust || '-'}</Text>
                    </View>
                </View>

                {/* Buyer */}
                <View style={{ marginTop: 12, marginBottom: 8 }}>
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
                                    <Text style={{ fontSize: 11 }}>{fmtNum(item.hargaSatuan, isUSD)}</Text>
                                </View>
                            </View>
                            <View style={S.tdSubtotal}>
                                <View style={S.currencyAmount}>
                                    <Text style={{ fontSize: 11 }}>{currLabel}</Text>
                                    <Text style={{ fontSize: 11 }}>{fmtNum(item.lineTotal, isUSD)}</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    {/* SUBTOTAL */}
                    <View style={S.summaryRow}>
                        <Text style={S.summaryLabel}>SUBTOTAL</Text>
                        <View style={S.summaryValue}>
                            <View style={S.currencyAmount}>
                                <Text style={{ fontSize: 11 }}>{currLabel}</Text>
                                <Text style={{ fontSize: 11 }}>{fmtNum(subTotal, isUSD)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* PPN */}
                    {hasPPN && (
                        <View style={S.summaryRow}>
                            <Text style={S.summaryLabel}>PPN {ppnPersen}%</Text>
                            <View style={S.summaryValue}>
                                <View style={S.currencyAmount}>
                                    <Text style={{ fontSize: 11 }}>{currLabel}</Text>
                                    <Text style={{ fontSize: 11 }}>{fmtNum(ppnAmount, isUSD)}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* TOTAL */}
                    <View style={S.summaryRow}>
                        <Text style={[S.summaryLabel, { fontWeight: '700' }]}>TOTAL</Text>
                        <View style={S.summaryValue}>
                            <View style={S.currencyAmount}>
                                <Text style={{ fontSize: 11 }}>{currLabel}</Text>
                                <Text style={{ fontSize: 11 }}>{fmtNum(total, isUSD)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Current Payment Ref */}
                    {currentPayment && (
                        <View style={S.summaryRow}>
                            <Text style={[S.summaryLabel, { fontWeight: '900', textAlign: 'right' }]}>
                                {currentPayment.payment_ref}
                            </Text>
                            <View style={S.summaryValue}>
                                <View style={S.currencyAmount}>
                                    <Text style={{ fontSize: 11, fontWeight: '700' }}>{currLabel}</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '700' }}>{fmtNum(Number(currentPayment.v_amount), isUSD)}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Amount Texts */}
                <View style={[S.footerSection, { marginTop: 12 }]}>
                    <Text style={S.footerText}>
                        <Text style={S.footerBold}>JUMLAH INVOICE INI</Text>: Rp. {fmtNum(total, false)}
                    </Text>
                    <Text style={S.footerText}>
                        <Text style={S.footerBold}>TERBILANG</Text>: {isUSD ? 'USD ' : ''}{formatTerbilang(total)}
                    </Text>
                </View>

                {/* Bank Info */}
                <View style={[S.footerSection, { marginTop: 12 }]}>
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

                {/* Signature */}
                <View style={S.signSection}>
                    <Text style={[S.footerText, { fontWeight: '700' as const, marginBottom: 48 }]}>
                        PIHAK PENJUAL
                    </Text>
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
                title="PRINT INVOICE"
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
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {renderContent()}
            </View>
        </View>
    );
};
