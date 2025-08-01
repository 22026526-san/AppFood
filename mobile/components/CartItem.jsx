import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {addItemToCart ,removeFromCart, removeCart} from '../redux/cartAction';
import { useDispatch } from 'react-redux';
import Logo from '../assets/fast-food.png'

const CartItem = (props) => {

    const router = useRouter();
    const dispatch = useDispatch();

    return (
        <>
            {props.data.map((item,index) => (
                <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, width: '100%' }}>
                    <TouchableOpacity style={styles.card} onPress={() => router.push(
                        {
                            pathname: '/FoodDetail',
                            params: { foodId: item.food_id }
                        }
                    )}>
                        <Image source={Logo} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    </TouchableOpacity>

                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 120, width: 200 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between',alignItems:'center'}}>
                            <View style={{width:168}}>
                                <Text style={{ fontSize: 18, color: '#ffffff' }}>{item.food_name}</Text>
                            </View>
                            <TouchableOpacity style={[styles.buttonn, styles.minusButton]} onPress={()=>{dispatch(removeCart(item.food_id))}}>
                                <Text style={{color:'orange'}}>x</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, color: '#ffffff' }} >{(item.price*1).toLocaleString('VND')}</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={[styles.buttonn, styles.minusButton]}
                                    onPress={() => dispatch(removeFromCart(item))}
                                >
                                    <Text style={{ color: '#ffffff' }}>-</Text>
                                </TouchableOpacity>

                                <Text style={{ fontSize: 18, color: '#ffffff' }}>{item.quantity}</Text>

                                <TouchableOpacity
                                    style={[styles.buttonn, styles.plusButton]}
                                    onPress={() => dispatch(addItemToCart(item))}
                                >
                                    <Text style={{ color: 'white' }}>+</Text>
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