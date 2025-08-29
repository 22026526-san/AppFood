import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image,Alert } from 'react-native'
import React, { useState, useEffect, useContext, use } from 'react'
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Logo from '../assets/orders.png'
import {API_URL} from '@env'
import { UserContext } from '../services/UserContextAPI';


const OnCard = (props) => {

    const router = useRouter();
    const { userId } = useAuth();
    const {name} = useContext(UserContext);

    const TotalPrice = (products) => {
        return products.reduce((total, product) => {
            return total + (product.unit_price * product.quantity);
        }, 0);
    };

    const handleSubmit = async (id,status) => {
        
        if (status === 'on delivery') {
            Alert.alert('Đơn hàng đang được giao. Không thể hủy');
            return;
        }
        try {

            const res = await fetch(`${API_URL}/user/cancel_orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: id,
                    name : name,
                }),
            });
            const json = await res.json();

            if (json.success) {
                Alert.alert('Hủy đơn hàng thành công');
                props.onUpdate()
                return;
            }

        } catch (error) {
            console.error('Error completing profile:', error);
            Alert.alert('Đã xảy ra lỗi');
        }
    };

    return (
        <>
            {props.data.map((item) => (
                <View key={item.order_id} style={styles.container}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>Food</Text>
                        <Text style={{ fontSize: 18, color: 'orange' }}>{item.status}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.card}>
                        <Image
                            source={Logo}
                            style={styles.image}
                            resizeMode="cover"
                        />

                        <View style={styles.info}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.foodName}>Fast Food</Text>
                                <Text style={styles.orderId}>#{item.created_at.slice(11, 19).split(":").reverse()}</Text>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                                <Text style={styles.price}>{(item.total_price * 1).toLocaleString('VND')}</Text>
                                <Text style={styles.items}>|</Text>
                                <Text style={styles.items}>{item.order_detail.length} Items</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.trackBtn} onPress={() => router.push({
                            pathname: '/OrderDetailScreen',
                            params: { data: JSON.stringify(item), discount: TotalPrice(item.order_detail) - item.total_price, action : 'track_order' }
                        })}>
                            <Text style={styles.trackText}>Track Order</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => handleSubmit(item.order_id,item.status)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginTop: 32
    },
    card: {
        backgroundColor: "#fff",
        display: 'flex',
        flexDirection: 'row'

    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 10,
    },
    info: {
        flex: 1,
        marginLeft: 10,
        gap: 12,
        justifyContent: 'center'
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    foodName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    orderId: {
        fontSize: 12,
        color: "#888",
    },
    price: {
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 4,
    },
    items: {
        fontSize: 12,
        color: "#aaa",
    },
    buttonRow: {
        flexDirection: "row",
        marginTop: 12,
        gap: 10,
        width: '100%',
        justifyContent: 'space-between'
    },
    trackBtn: {
        backgroundColor: "#FF6B00",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center'
    },
    trackText: {
        color: "#fff",
        fontWeight: "bold",
    },
    cancelBtn: {
        borderWidth: 1,
        borderColor: "#FF6B00",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center'
    },
    cancelText: {
        color: "#FF6B00",
        fontWeight: "bold",
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
});

export default OnCard