import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useContext } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@env'
import TopRateCard from '../../components/TopRateCard';
import Logo from '../../assets/fast-food.png'
import FoodCard from '../../components/FoodCard';

const CategoriDetail = () => {

    const router = useRouter();
    const { cate_id, cate_name } = useLocalSearchParams();

    const fakeData = [
      {
        food_id: 1,
        food_name: 'Cheese Burger',
        img_url: Logo,
        price: '$5.99'
      },
      {
        food_id: 2,
        food_name: 'Fried Chicken',
        img_url: Logo,
        price: '$7.49'
      },
      {
        food_id: 3,
        food_name: 'Pepperoni Pizza',
        img_url: Logo,
        price: '$8.99'
      },
      {
        food_id: 4,
        food_name: 'Hotdog Classic',
        img_url:Logo,
        price: '$4.50'
      },
      {
        food_id: 5,
        food_name: 'French Fries',
        img_url: Logo,
        price: '$3.99'
      },
      {
        food_id: 6,
        food_name: 'Coca Cola',
        img_url: Logo,
        price: '$1.99'
      }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }}>

                <View style={styles.header}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
                        <View style={styles.card}>
                            <Text style={{ fontSize: 14, color: '#000000d2', fontWeight: 'bold' }}>{cate_name}</Text>
                            <Ionicons name="caret-down" color={'#ff5e00b0'} size={14}></Ionicons>
                        </View>
                    </View>

                    <View>
                        <TouchableOpacity onPress={() => router.push('/SearchScreen')} style={styles.buttonSearch}><Ionicons name="search" size={20} color="#ffffffd5" /></TouchableOpacity>
                    </View>
                </View>

                <View style={styles.contentCategory}>
                    
                    <Text style={{ fontSize: 18, color: '#000000be' }}>Popular {cate_name}</Text>
    

                    <View style={{ marginTop: 22 }}>
                        <TopRateCard data={fakeData}></TopRateCard>
                    </View>

                </View>

                <View style={styles.contentCategory}>
                    
                    <Text style={{ fontSize: 18, color: '#000000be' }}>All {cate_name}</Text>
    

                    <View style={{ marginTop: 22 }}>
                        <FoodCard data={fakeData}></FoodCard>
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
    contentCategory:{
    display:'flex',
    flexDirection:'column',
    marginTop:22
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    button: {
        backgroundColor: '#96a8be11',
        borderRadius: 25,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonSearch: {
        backgroundColor: '#000000d4',
        borderRadius: 25,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImgUser: {
        borderRadius: 50,
        width: 86,
        height: 86
    },
    contentUser: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        marginTop: 20
    },
    contentNav: {
        backgroundColor: '#96a8be11',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ffffff',
        marginTop: 20,

    },
    icon: {
        backgroundColor: '#ffffffff',
        borderRadius: 25,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 12,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        borderColor: '#0808081b',
        borderWidth: 1
    },
})

export default CategoriDetail