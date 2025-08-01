import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, Link } from 'expo-router'
import voucher_logo from '../assets/vouchers.png'

const VoucherCard = (props) => {

    const router = useRouter();

    return (
        <>
            {props.data.map((item) => (
                <View key={item.id} style={{ height: 110, display: 'flex', flexDirection: 'row', marginBottom: 22, gap: 12, padding: 8, borderColor: '#16161634', borderWidth: 1, alignItems: 'center' }}>
                    <Image source={voucher_logo} style={{ width: 88, height: 88 }} resizeMode="cover"></Image>
                    <View style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <View style={{ width: '80%' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Giảm {item.discount_percent}% Giảm tối đa {(item.max_discount * 1).toLocaleString('VND')}</Text>
                            <Text style={{ fontSize: 14 }}>Áp dụng cho mọi đơn hàng</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                            <Ionicons name='time-outline' color={'#343434a5'} size={16} />
                            <Text style={{ color: '#343434a5' }}>Có hiệu lực sau: </Text>
                            <TouchableOpacity onPress={() => router.push({
                                pathname: '/VoucherDetail',
                                params: { data : JSON.stringify(item) }
                            })}>
                                <Text style={{ color: '#1379dfff', textDecorationLine: 'underline' }}>Xem chi tiết</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            ))}
        </>
    )
}

export default VoucherCard