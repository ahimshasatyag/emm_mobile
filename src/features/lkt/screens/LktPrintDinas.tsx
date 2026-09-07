import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { ToastMessages, ToastType } from '../../../components/ui/ToastMessages';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderNavigator } from '../../../components/layouts/HeaderNavigator';
import { useLkt } from '../hooks/useLkt';
import { formatDate } from '../../../utils/helpers/date';
import { api } from '../../../services/api/api';
import * as Print from 'expo-print';
import { Printer } from 'lucide-react-native';
import { theme } from '../../../theme/theme';

const API_URL = api.defaults.baseURL?.replace('/api', '') || 'http://192.168.1.127:8001';

export default function LktPrintDinas() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lktCode } = route.params || {};
    const { currentLkt, loadLktDetail, isLoading } = useLkt();
    const dispatch = useDispatch();
    const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({ visible: false, type: 'success', message: '' });

    useEffect(() => {
        if (lktCode) {
            loadLktDetail(lktCode);
        }
    }, [lktCode]);

    if (isLoading || !currentLkt) {
        return (
            <View className="flex-1 bg-gray-50">
                <HeaderNavigator title="MEMUAT DATA..." showBackButton onBackPress={() => navigation.goBack()} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </View>
        );
    }

    // Process technicians
    let primaryTechnician = '-';
    let secondaryTechnicians = '-';

    if (currentLkt.realisasi_list && currentLkt.realisasi_list.length > 0) {
        // Collect all distinct names
        const names = currentLkt.realisasi_list
            .filter(r => r.f_cancel !== 1)
            .flatMap(r => r.teknisi_list?.map(t => t.nm_karyawan) || []);

        const uniqueNames = Array.from(new Set(names.filter(Boolean)));

        if (uniqueNames.length > 0) {
            primaryTechnician = uniqueNames[0];
            if (uniqueNames.length > 1) {
                secondaryTechnicians = uniqueNames.slice(1).join(', ');
            }
        } else {
            primaryTechnician = currentLkt.nm_karyawan || '-';
        }
    } else {
        primaryTechnician = currentLkt.nm_karyawan || '-';
    }

    // Determine Warranty status for Cost (dummy logic if waranty_end is missing)
    const isWaranty = true; // Replace with proper check if data available
    const fundingSource = isWaranty ? 'Internal Kantor (IT, EMM)' : 'Ditanggung Customer';

    const handlePrint = async () => {
        if (!currentLkt) return;

        try {
            const html = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Pengajuan Anggaran Perjalanan Dinas Luar</title>
    <style>
        body { padding: 20px; font-family: Arial, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .table-bordered th, .table-bordered td { border: 1px solid black; padding: 5px; font-size: 12px; }
        .table-content td { border: 1px solid black; padding: 5px; font-size: 12px; }
        .logo { width: 50px; height: auto; }
        h5 { font-size: 14px; margin-top: 5px; margin-bottom: 5px; font-weight: bold; }
        .ttd { width: 100%; text-align: center; border-collapse: collapse; border: none; }
        .ttd td { padding: 20px; text-align: center; vertical-align: bottom; border: none; }
    </style>
</head>
<body>
    <table class="table-content">
        <tr>
            <td rowspan="4" style="text-align: center; width: 100px;"><img src="${API_URL}/assets/images/Logo.jpg" alt="Logo" class="logo"></td>
            <td colspan="2" style="text-align: center;"><b>PENGAJUAN ANGGARAN PERJALANAN DINAS LUAR</b></td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: center;"><small><b>${currentLkt.cst_code}</b></small></td>
        </tr>
        <tr>
            <td>Nomor: </td>
            <td>Tanggal: ${currentLkt.csr_date ? formatDate(currentLkt.csr_date) : '-'}</td>
        </tr>
        <tr>
            <td>Yang Mengajukan: ${currentLkt.nm_karyawan}</td>
            <td>Dept/Divisi: After Sales</td>
        </tr>
    </table>

    <h5>I. Karyawan yang akan melakukan perjalanan dinas luar</h5>
    <table class="table-bordered">
        <tr>
            <th style="width: 40%; text-align: left;">Nama</th>
            <td>${primaryTechnician}</td>
        </tr>
        <tr>
            <th style="text-align: left;">Departemen/Divisi</th>
            <td>After Sales</td>
        </tr>
        <tr>
            <th style="text-align: left;">Sebutkan nama karyawan lainnya apabila yang melakukan perjalanan lebih dari satu</th>
            <td>${secondaryTechnicians}</td>
        </tr>
    </table>

    <h5>II. Tujuan Perjalanan Dinas Luar</h5>
    <table class="table-bordered">
        <tr>
            <th style="width: 40%; text-align: left;">A. Tujuan Perjalanan</th>
            <td>Perkenalan Produk / Negosiasi / Perbaikan Mesin / Pemasangan Mesin Baru <br>Lainnya (sebutkan):<br>....................................................................</td>
        </tr>
        <tr>
            <th style="text-align: left;">B. Customer Yang Dikunjungi</th>
            <td>${currentLkt.nm_customers}</td>
        </tr>
    </table>

    <h5>III. Waktu dan Metode Perjalanan Dinas Luar</h5>
    <table class="table-bordered">
        <tr>
            <th style="width: 25%; text-align: left;">Tanggal Perjalanan</th>
            <td style="width: 25%;">${currentLkt.csr_date ? formatDate(currentLkt.csr_date) : '-'}</td>
            <th style="width: 25%; text-align: left;">Estimasi Lama Perjalanan</th>
            <td style="width: 25%;">${currentLkt.estimation_day} Hari</td>
        </tr>
        <tr>
            <th style="text-align: left;">A. Tujuan Perjalanan</th>
            <td colspan="3">Perjalanan darat (Kendaraan Kantor) / Kereta Api / Bus Umum / Pesawat / Kapal Laut <br>Lainnya (sebutkan): <br>....................................................................</td>
        </tr>
    </table>

    <h5>III. Biaya Perjalanan Dinas Luar</h5>
    <table class="table-bordered">
        <tr>
            <th style="width: 40%; text-align: left;">Biaya Perjalanan Dinas Berasal Dari</th>
            <td><b>${fundingSource}</b><br>Lainnya (sebutkan): <br>....................................................................</td>
        </tr>
    </table>

    <h5>IV. Pengajuan Anggaran</h5>
    <table class="table-bordered text-center">
        <thead>
            <tr>
                <th>No</th>
                <th>Deskripsi Pengeluaran</th>
                <th>KTS</th>
                <th>Harga Satuan</th>
                <th>Jumlah</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>1</td><td></td><td></td><td></td><td></td></tr>
            <tr><td>2</td><td></td><td></td><td></td><td></td></tr>
            <tr><td>3</td><td></td><td></td><td></td><td></td></tr>
            <tr>
                <td colspan="4" style="text-align: right;"><strong>Sub Total</strong></td>
                <td></td>
            </tr>
        </tbody>
    </table>

    <h5>V. Catatan Lain</h5>
    <p>&nbsp; ${currentLkt.lap_kerusakan || '-'}</p>

    <table class="ttd">
        <tr>
            <td><p>Diajukan Oleh:</p><br><br><br><p>_____________________</p></td>
            <td><p>Diketahui Oleh:</p><br><br><br><p>_____________________</p></td>
            <td><p>Disetujui Oleh:</p><br><br><br><p>_____________________</p></td>
        </tr>
    </table>
</body>
</html>
            `;
            await Print.printAsync({ html });

            const shortLktCode = lktCode ? lktCode.slice(-5) : '-';

        } catch (error) {
            setToast({ visible: true, type: 'error', message: 'Gagal mencetak dokumen' });
            console.error(error);
        }
    };

    return (
        <View className="flex-1 bg-gray-100">
            <ToastMessages
                visible={toast.visible}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
            <HeaderNavigator
                title="CETAK SURAT DINAS"
                showBackButton
                onBackPress={() => navigation.goBack()}
                rightComponent={
                    <TouchableOpacity onPress={handlePrint} className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
                        <Printer size={20} color="white" />
                    </TouchableOpacity>
                }
            />

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    {/* Paper Canvas */}
                    <View className="bg-white p-6" style={{ width: 800, minHeight: 800, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>

                        {/* Header Table */}
                        <View className="border border-black mb-4">
                            <View className="flex-row">
                                <View className="w-24 border-r border-black items-center justify-center py-2">
                                    <Image source={{ uri: `${API_URL}/assets/images/Logo.jpg` }} style={{ width: 40, height: 40 }} resizeMode="contain" />
                                </View>
                                <View className="flex-1">
                                    <View className="border-b border-black py-2 items-center justify-center">
                                        <Text className="font-bold text-xs text-black">PENGAJUAN ANGGARAN PERJALANAN DINAS LUAR</Text>
                                    </View>
                                    <View className="border-b border-black py-1 items-center justify-center">
                                        <Text className="font-bold text-xs text-black">{currentLkt.cst_code}</Text>
                                    </View>
                                    <View className="flex-row">
                                        <View className="flex-1 border-r border-black p-2">
                                            <Text className="text-xs text-black">Nomor: </Text>
                                        </View>
                                        <View className="flex-1 p-2">
                                            <Text className="text-xs text-black">Tanggal: {currentLkt.csr_date ? formatDate(currentLkt.csr_date) : '-'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className="border-t border-black flex-row">
                                <View className="flex-1 border-r border-black p-2">
                                    <Text className="text-xs text-black">Yang Mengajukan: {currentLkt.nm_karyawan}</Text>
                                </View>
                                <View className="flex-1 p-2">
                                    <Text className="text-xs text-black">Dept/Divisi: After Sales</Text>
                                </View>
                            </View>
                        </View>

                        {/* Section I */}
                        <Text className="font-bold text-xs text-black mb-1">I. Karyawan yang akan melakukan perjalanan dinas luar</Text>
                        <View className="border-t border-l border-black mb-4">
                            <View className="flex-row border-b border-black">
                                <View className="w-1/3 border-r border-black p-2 bg-gray-100">
                                    <Text className="font-bold text-xs text-black">Nama</Text>
                                </View>
                                <View className="flex-1 border-r border-black p-2">
                                    <Text className="text-xs text-black">{primaryTechnician}</Text>
                                </View>
                            </View>
                            <View className="flex-row border-b border-black">
                                <View className="w-1/3 border-r border-black p-2 bg-gray-100">
                                    <Text className="font-bold text-xs text-black">Departemen/Divisi</Text>
                                </View>
                                <View className="flex-1 border-r border-black p-2">
                                    <Text className="text-xs text-black">After Sales</Text>
                                </View>
                            </View>
                            <View className="flex-row border-b border-black">
                                <View className="w-1/3 border-r border-black p-2 bg-gray-100">
                                    <Text className="font-bold text-xs text-black">Sebutkan nama karyawan lainnya apabila yang melakukan perjalanan lebih dari satu</Text>
                                </View>
                                <View className="flex-1 border-r border-black p-2 justify-center">
                                    <Text className="text-xs text-black">{secondaryTechnicians}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Section II */}
                        <Text className="font-bold text-xs text-black mb-1">II. Tujuan Perjalanan Dinas Luar</Text>
                        <View className="border-t border-l border-black mb-4">
                            <View className="flex-row border-b border-black">
                                <View className="w-1/3 border-r border-black p-2 bg-gray-100">
                                    <Text className="font-bold text-xs text-black">A. Tujuan Perjalanan</Text>
                                </View>
                                <View className="flex-1 border-r border-black p-2">
                                    <Text className="text-xs text-black">Perkenalan Produk / Negosiasi / Perbaikan Mesin / Pemasangan Mesin Baru</Text>
                                    <Text className="text-xs text-black mt-1">Lainnya (sebutkan):</Text>
                                    <Text className="text-xs text-black">....................................................................</Text>
                                </View>
                            </View>
                            <View className="flex-row border-b border-black">
                                <View className="w-1/3 border-r border-black p-2 bg-gray-100">
                                    <Text className="font-bold text-xs text-black">B. Customer Yang Dikunjungi</Text>
                                </View>
                                <View className="flex-1 border-r border-black p-2 justify-center">
                                    <Text className="text-xs text-black">{currentLkt.nm_customers}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Section III (Waktu) */}
                        <Text className="font-bold text-xs text-black mb-1">III. Waktu dan Metode Perjalanan Dinas Luar</Text>
                        <View className="border-t border-l border-black mb-4">
                            <View className="flex-row border-b border-black">
                                <View className="flex-1 border-r border-black p-2 bg-gray-100">
                                    <Text className="font-bold text-xs text-black">Tanggal Perjalanan</Text>
                                </View>
                                <View className="flex-1 border-r border-black p-2">
                                    <Text className="text-xs text-black">{currentLkt.csr_date ? formatDate(currentLkt.csr_date) : '-'}</Text>
                                </View>
                                <View className="flex-1 border-r border-black p-2 bg-gray-100">
                                    <Text className="font-bold text-xs text-black">Estimasi Lama Perjalanan</Text>
                                </View>
                                <View className="flex-1 border-r border-black p-2">
                                    <Text className="text-xs text-black">{currentLkt.estimation_day} Hari</Text>
                                </View>
                            </View>
                            <View className="flex-row border-b border-black">
                                <View className="w-1/4 border-r border-black p-2 bg-gray-100">
                                    <Text className="font-bold text-xs text-black">A. Tujuan Perjalanan</Text>
                                </View>
                                <View className="flex-1 border-r border-black p-2">
                                    <Text className="text-xs text-black">Perjalanan darat (Kendaraan Kantor) / Kereta Api / Bus Umum / Pesawat / Kapal Laut</Text>
                                    <Text className="text-xs text-black mt-2">Lainnya (sebutkan):</Text>
                                    <Text className="text-xs text-black">....................................................................</Text>
                                </View>
                            </View>
                        </View>

                        {/* Section III (Biaya) - Note: Original HTML repeated III */}
                        <Text className="font-bold text-xs text-black mb-1">III. Biaya Perjalanan Dinas Luar</Text>
                        <View className="border-t border-l border-black mb-4">
                            <View className="flex-row border-b border-black">
                                <View className="w-1/3 border-r border-black p-2 bg-gray-100">
                                    <Text className="font-bold text-xs text-black">Biaya Perjalanan Dinas Berasal Dari</Text>
                                </View>
                                <View className="flex-1 border-r border-black p-2">
                                    <Text className="text-xs text-black mb-2 font-bold">{fundingSource}</Text>
                                    <Text className="text-xs text-black">Lainnya (sebutkan):</Text>
                                    <Text className="text-xs text-black">....................................................................</Text>
                                </View>
                            </View>
                        </View>

                        {/* Section IV */}
                        <Text className="font-bold text-xs text-black mb-1">IV. Pengajuan Anggaran</Text>
                        <View className="border-t border-l border-black mb-4">
                            <View className="flex-row border-b border-black bg-gray-100">
                                <View className="w-10 border-r border-black p-2 items-center"><Text className="font-bold text-xs text-black">No</Text></View>
                                <View className="flex-1 border-r border-black p-2 items-center"><Text className="font-bold text-xs text-black">Deskripsi Pengeluaran</Text></View>
                                <View className="w-16 border-r border-black p-2 items-center"><Text className="font-bold text-xs text-black">KTS</Text></View>
                                <View className="w-24 border-r border-black p-2 items-center"><Text className="font-bold text-xs text-black">Harga Satuan</Text></View>
                                <View className="w-24 border-r border-black p-2 items-center"><Text className="font-bold text-xs text-black">Jumlah</Text></View>
                            </View>
                            {[1, 2, 3].map((row) => (
                                <View key={row} className="flex-row border-b border-black">
                                    <View className="w-10 border-r border-black p-2 items-center"><Text className="text-xs text-black">{row}</Text></View>
                                    <View className="flex-1 border-r border-black p-2"><Text className="text-xs text-black"></Text></View>
                                    <View className="w-16 border-r border-black p-2"><Text className="text-xs text-black"></Text></View>
                                    <View className="w-24 border-r border-black p-2"><Text className="text-xs text-black"></Text></View>
                                    <View className="w-24 border-r border-black p-2"><Text className="text-xs text-black"></Text></View>
                                </View>
                            ))}
                            <View className="flex-row border-b border-black">
                                <View className="flex-1 border-r border-black p-2 items-end">
                                    <Text className="font-bold text-xs text-black">Sub Total</Text>
                                </View>
                                <View className="w-24 border-r border-black p-2"><Text className="text-xs text-black"></Text></View>
                            </View>
                        </View>

                        {/* Section V */}
                        <Text className="font-bold text-xs text-black mb-1">V. Catatan Lain</Text>
                        <Text className="text-xs text-black mb-8 px-2">{currentLkt.lap_kerusakan || '-'}</Text>

                        {/* Signatures */}
                        <View className="flex-row justify-between pt-4">
                            <View className="items-center w-1/3">
                                <Text className="text-xs text-black text-center mb-16">Diajukan Oleh:</Text>
                                <Text className="text-xs text-black">_____________________</Text>
                            </View>
                            <View className="items-center w-1/3">
                                <Text className="text-xs text-black text-center mb-16">Diketahui Oleh:</Text>
                                <Text className="text-xs text-black">_____________________</Text>
                            </View>
                            <View className="items-center w-1/3">
                                <Text className="text-xs text-black text-center mb-16">Disetujui Oleh:</Text>
                                <Text className="text-xs text-black">_____________________</Text>
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </ScrollView>
        </View>
    );
}
