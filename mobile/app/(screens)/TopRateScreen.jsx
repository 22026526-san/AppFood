import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { API_URL } from '@env'
import Logo from '../../assets/fast-food.png'
import TopRateList from '../../components/TopRateList';
import LoadingScreen from '../../components/LoadingScreen';

const TopRateScreen = () => {

    const router = useRouter();
    const [data, setData] = useState([]);

    const topRateAll = async () => {
        try {

            const res = await fetch(`${API_URL}/food/get_alltoprate`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await res.json();
            if (result.success) {
                setData(result.message);
            }

        } catch (err) {
            console.error('Lỗi khi lấy thông tin food:', err);
        }
    };
    useEffect(() => {
        topRateAll()
    }, []);


    if (!data.length) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }}>

                <View style={styles.header}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
                        <View style={styles.card}>
                            <Text style={{ fontSize: 14, color: '#000000d2', fontWeight: 'bold' }}>Top Rate</Text>
                            <Ionicons name="caret-down" color={'#ff5e00b0'} size={14}></Ionicons>
                        </View>
                    </View>

                    <View>
                        <TouchableOpacity onPress={() => router.push('/SearchScreen')} style={styles.buttonSearch}><Ionicons name="search" size={20} color="#ffffffd5" /></TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginTop: 22 }}>
                    <TopRateList data={data}></TopRateList>
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
    contentCategory: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 22
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

export default TopRateScreen