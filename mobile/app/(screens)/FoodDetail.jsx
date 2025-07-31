import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@env'
import Logo from "../../assets/fast-food.png";
import LoadingScreen from '../../components/LoadingScreen';


const FoodDetail = () => {

    const router = useRouter();
    const { foodId } = useLocalSearchParams();
    const [quantity, setQuantity] = useState(1);
    const [dataFood, setDataFood] = useState([])

    useEffect(() => {
        const foodInfo = async () => {
            try {

                const res = await fetch(`${API_URL}/food/get_info`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        foodId: foodId,
                    }),
                });

                const result = await res.json();
                if (result.success) {
                    setDataFood(result.message);
                }

            } catch (err) {
                console.error('Lỗi khi lấy thông tin food:', err);
            }
        };
        if (foodId) {
            foodInfo();
        }
    }, [foodId]);


    if (!dataFood.length) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, minHeight: '88%' }}>

                <View style={styles.header}>
                    <View style={{ display: 'flex', gap: '8', flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
                        <Text style={{ fontSize: 22, color: '#000000d5', fontWeight: 'bold' }}>Details</Text>
                    </View>
                    <TouchableOpacity style={styles.button}><Ionicons name="heart" size={22} color="#c8c8c8d5" /></TouchableOpacity>
                </View>

                <View style={styles.foodCard}>
                    <Image source={Logo} style={styles.Img}></Image>
                </View>

                <View>

                    <Text style={{ fontSize: 26, fontWeight: 'bold', marginTop: 22, color: '#000000c8' }}>{dataFood[0].food_name}</Text>



                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 10 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                            <Text style={{ fontSize: 16 }}>{dataFood[0].food_rate}</Text>
                            <Ionicons name="star-outline" color={'#ff7104dd'} size={16}></Ionicons>
                            <Text style={{ fontSize: 16 }}>{`(${dataFood[0].sum_rate})`}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                            <Text style={{ fontSize: 16 }}>Free</Text>
                            <Ionicons name="car-outline" color={'#ff7104dd'} size={20}></Ionicons>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                            <Text style={{ fontSize: 16 }}>20min</Text>
                            <Ionicons name="time-outline" color={'#ff7104dd'} size={20}></Ionicons>
                        </View>
                    </View>

                    <Text style={{ fontSize: 26, marginTop: 10, color: '#ff7104dd' }}>{(dataFood[0].price * quantity).toLocaleString('VND')}</Text>

                    <View style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '22' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000c8' }}>Description</Text>
                        <Text style={{ fontSize: 16, color: '#38383899' }}>{dataFood[0].description}</Text>
                    </View>

                </View>

            </ScrollView>
            <View style={styles.buttonContainer}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={[styles.buttonn, styles.minusButton]}
                        onPress={() => setQuantity(prev => Math.max(prev - 1, 1))}
                    >
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20 }}>{quantity}</Text>

                    <TouchableOpacity
                        style={[styles.buttonn, styles.plusButton]}
                        onPress={() => setQuantity(prev => prev + 1)}
                    >
                        <Text style={[styles.buttonText, { color: 'white' }]}>+</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity style={styles.addToCartButton}>
                        <Text style={styles.addToCartText}>Add To Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffffff",
        marginBottom: -36
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 6,
        gap: 8,
        backgroundColor: "#ffffffff",
        elevation: 2, // Shadow Android
        shadowColor: '#000', // Shadow iOS
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buttonContainer: {
        minHeight: '12%',
        width: '100%',
        backgroundColor: '#ffffffff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    buttonCard: {
        backgroundColor: '#000000d4',
        borderRadius: 25,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Img: {
        width: 220,
        height: 220,
        resizeMode: 'contain',
        position: 'absolute',
        top: -68,
    },
    foodCard: {
        width: '100%',
        height: 160,
        backgroundColor: '#FFA94D',
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 68,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    buttonn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    minusButton: {
        backgroundColor: '#E5E5E5',
    },
    plusButton: {
        backgroundColor: '#ff4b4bbf',
    },
    addToCartButton: {
        backgroundColor: '#FF4B4B',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#96a8be11',
        borderRadius: 25,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default FoodDetail