import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const CartItem = (props) => {

    const router = useRouter();
    const [quantity, setQuantity] = useState(2);

    return (
        <>
            {props.data.map((item) => (
                <View key={item.food_id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 22, marginTop: 22, width: '100%' }}>
                    <TouchableOpacity style={styles.card} onPress={() => router.push(
                        {
                            pathname: '/FoodDetail',
                            params: { foodId: item.food_id }
                        }
                    )}>
                        <Image source={item.img_url} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    </TouchableOpacity>

                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 120, width: 197 }}>
                        <Text style={{ fontSize: 18, color: '#ffffff' }}>{item.food_name}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, color: '#ffffff' }} >{item.price}</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={[styles.buttonn, styles.minusButton]}
                                    onPress={() => setQuantity(prev => Math.max(prev - 1, 1))}
                                >
                                    <Text style={[styles.buttonText, { color: '#ffffff' }]}>-</Text>
                                </TouchableOpacity>

                                <Text style={{ fontSize: 18, color: '#ffffff' }}>{quantity}</Text>

                                <TouchableOpacity
                                    style={[styles.buttonn, styles.plusButton]}
                                    onPress={() => setQuantity(prev => prev + 1)}
                                >
                                    <Text style={[styles.buttonText, { color: 'white' }]}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            ))}
        </>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#313141bb',
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'row',
        width: 120,
        height: 120,
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    name: {
        fontSize: 16,
        color: '#000000d6',
        marginBottom: 8,
        fontWeight: 'bold'
    },
    buttonn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 32,
    },
    minusButton: {
        backgroundColor: '#313141bb',
    },
    plusButton: {
        backgroundColor: '#313141bb',
    },
});

export default CartItem