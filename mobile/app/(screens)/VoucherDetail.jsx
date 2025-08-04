import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,Alert } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import voucher_logo from '../../assets/vouchers.png'

const VoucherDeatil = () => {

    const router = useRouter();

    const { data } = useLocalSearchParams();
    const voucher = JSON.parse(data);


    const copyToClipboard = async () => {
        try {
            await Clipboard.setStringAsync(voucher.code);
            Alert.alert('Sao chép mã thành công');
        } catch (e) {
            console.log(e)
            Alert.alert('Đã có lỗi xảy ra khi sao chép mã.');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, minHeight: '88%' }}>

                <View style={styles.header}>

                    <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
                    <Text style={{ fontSize: 22, color: '#000000d5', fontWeight: 'bold' }}>Voucher Details</Text>

                </View>

                <View style={styles.headerr}>
                    <Image
                        source={voucher_logo} 
                        style={styles.voucherImage}
                        resizeMode="cover"
                    />

                    <View style={styles.voucherInfo}>
                        <Text style={styles.discountText}>{voucher.description}</Text>
                        <Text style={styles.conditionText}>Áp dụng cho mọi đơn hàng</Text>

                        <View style={styles.reminderRow}>
                            <Ionicons name='time-outline' color={'#FFF'} size={15} />
                            <Text style={styles.reminderText}>Có hiệu lực:  khi sử dụng</Text>
                        </View>
                    </View>
                </View>

                {/* Body */}
                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Hạn sử dụng mã</Text>
                    <Text style={styles.sectionText}>{new Date(voucher.start_date).toLocaleDateString('vi-VN')} - {new Date(voucher.end_date).toLocaleDateString('vi-VN')}</Text>

                    <Text style={styles.sectionTitle}>Ưu đãi</Text>
                    <Text style={styles.sectionText}>
                        Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé! Giảm {voucher.discount_percent}% Giảm tối đa {(voucher.max_discount*1).toLocaleString('VND')} VND
                    </Text>

                    <Text style={styles.sectionTitle}>Áp dụng cho sản phẩm</Text>
                    <Text style={styles.sectionText}>
                        Áp dụng trên App cho toàn bộ sản phẩm và một số người dùng tham gia chương trình khuyến mãi 1 lần.
                    </Text>
                    <Text style={styles.sectionText}>
                        • Những sản phẩm bị hạn chế chạy khuyến mại theo quy định của Nhà nước sẽ không được hiển thị nếu nằm trong danh sách sản phẩm đã chọn.
                        <Text style={styles.linkText}> Tìm hiểu thêm.</Text>
                    </Text>

                    <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                    <Text style={styles.sectionText}>Mọi hình thức thanh toán</Text>

                    <View style={{display:'flex',flexDirection:'row',gap:12,alignItems:'center'}}>
                        <Text style={styles.sectionTitle}>Mã Code: </Text>
                        <Text style={{color:'orange',fontSize:14,marginTop:12}}>
                            {voucher.code}
                        </Text>
                        <TouchableOpacity style={{alignItems:'center',marginTop:10}} onPress={copyToClipboard}>
                            <Ionicons name="copy-outline" size={18} color="orange" />
                        </TouchableOpacity>
                    </View>
                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffffff",
        marginBottom: -36
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },

    button: {
        backgroundColor: '#96a8be11',
        borderRadius: 25,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerr: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#FF6600',
        marginTop:22,
        borderRadius: 8,
    },
    voucherImage: {
        width: 80,
        height: 80,
        borderRadius: 6,
        marginRight: 10,
        backgroundColor: '#FFF3E0',
    },
    voucherInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    discountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    conditionText: {
        fontSize: 14,
        color: '#FFF',
    },
    contentTag: {
        backgroundColor: '#FFF',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        marginVertical: 4,
    },
    contentTagText: {
        fontSize: 12,
        color: '#FF6600',
        fontWeight: '500',
    },
    reminderRow: {
        flexDirection: 'row',
        gap:3,
        alignItems: 'center',
    },
    reminderText: {
        fontSize: 12,
        color: '#FFF',
    },
    reminderButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    reminderButtonText: {
        fontSize: 12,
        color: '#000',
    },
    body: {
        padding: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 4,
    },
    sectionText: {
        fontSize: 13,
        color: '#444',
        marginBottom: 6,
        lineHeight: 18,
    },
    linkText: {
        color: '#1E90FF',
    },
})

export default VoucherDeatil