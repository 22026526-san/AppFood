import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'expo-router';
import Logo from '../assets/orders.png'
import { UserContext } from '../services/UserContextAPI';
import {API_URL} from '@env'

const NoticeCard = (props) => {
    const router = useRouter();
    const { role } = useContext(UserContext);

    const handleClick = async (id) => {
        try {
            const res = await fetch(`${API_URL}/user/update_notices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    noticeId : id
                }),
            });

            const result = await res.json();

            if (result.success) {
                props.onUpdate();
                return;
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            {props.data.map((item) => (
                <View key={item.id} style={{ backgroundColor: item.is_read === 1 ? '#fff' : '#a5acca49', paddingRight: 12, paddingLeft: 12, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%' }}>
                    <Image source={Logo} style={{ width: 62, height: 62, borderRadius: 36 }} resizeMode="cover" />
                    <TouchableOpacity style={{ width: '80%', flexDirection: 'column' }}
                        onPress={() => {
                            if (role === 'manager') {
                                if (item.router === 'Voucher') {
                                    handleClick(item.id);
                                    router.push('(adminScreens)/VoucherScreen');
                                } else if (item.router === 'Order') {
                                    handleClick(item.id);
                                    router.push('(adminScreens)/OrdersScreen');
                                } else {
                                    handleClick(item.id);
                                    router.push({
                                        pathname: '(adminScreens)/FoodDetailScreen',
                                        params: { foodId: item.router }
                                    });
                                }
                            } else {
                                if (item.router === 'Voucher') {
                                    handleClick(item.id);
                                    router.push('(screens)/VoucherScreen');
                                } else if (item.router === 'Order') {
                                    handleClick(item.id);
                                    router.push('(tabs)/OrderScreen');
                                } else {
                                    handleClick(item.id);
                                    router.push({
                                        pathname: '/FoodDetail',
                                        params: { foodId: item.router }
                                    });
                                }
                            }
                        }}>

                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>{item.title}</Text>
                        <Text style={{ fontSize: 14, color: '#555' }}>{item.message}</Text>
                        <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{item.created_at.slice(0, 10).split("-").reverse().join("-")}</Text>


                    </TouchableOpacity>
                </View>
            ))}
        </>

    )
}

export default NoticeCard