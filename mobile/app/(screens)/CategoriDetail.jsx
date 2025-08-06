import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useContext, useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@env'
import TopRateCard from '../../components/TopRateCard';
import Logo from '../../assets/fast-food.png'
import FoodCard from '../../components/FoodCard';
import LoadingScreen from '../../components/LoadingScreen';

const CategoriDetail = () => {

    const router = useRouter();
    const { cate_id, cate_name } = useLocalSearchParams();
    const [dataCateTop, setDataCateTop] = useState([]);
    const [dataCateAll, setDataCateAll] = useState([]);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);

    const handleScroll = (event) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const currentY = contentOffset.y;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (currentY > lastScrollY.current && currentY > 50) {
            setShowHeader(false);
        } else if (currentY < lastScrollY.current && !isCloseToBottom) {
            setShowHeader(true);
        }
        lastScrollY.current = currentY;
    };

    useEffect(() => {
        const foodInfo = async () => {
            try {

                const res = await fetch(`${API_URL}/food/get_food_with_category`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        categoryId: cate_id,
                    }),
                });

                const result = await res.json();
                if (result.success) {
                    setDataCateAll(result.message.cateAll);
                    setDataCateTop(result.message.cateRate);
                }

            } catch (err) {
                console.error('Lỗi khi lấy thông tin food:', err);
            }
        };
        if (cate_id) {
            foodInfo();
        }
    }, [cate_id]);

    if (!dataCateAll.length || !dataCateTop.length) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            {showHeader && (
                <View style={styles.header}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
                        <View style={styles.card}>
                            <Text style={{ fontSize: 14, color: '#000000d2', fontWeight: 'bold' }}>{cate_name}</Text>
                            <Ionicons name="caret-down" color={'#ff5e00b0'} size={14}></Ionicons>
                        </View>
                    </View>

                    <View>
                        <TouchableOpacity style={styles.buttonSearch} onPress={() => router.push({
                            pathname: '/SearchScreen',
                            params: { data_search: [], text_search: '' }
                        })} ><Ionicons name="search" size={20} color="#ffffffd5" /></TouchableOpacity>
                    </View>
                </View>
            )}
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20, marginBottom: 20 }} onScroll={handleScroll}>

                <View style={styles.contentCategory}>

                    <Text style={{ fontSize: 18, color: '#000000be' }}>Popular {cate_name}</Text>


                    <View style={{ marginTop: 22 }}>
                        <TopRateCard data={dataCateTop}></TopRateCard>
                    </View>

                </View>

                <View style={styles.contentCategory}>

                    <Text style={{ fontSize: 18, color: '#000000be' }}>All {cate_name}</Text>


                    <View style={{ marginTop: 22 }}>
                        <FoodCard data={dataCateAll}></FoodCard>
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
    contentCategory: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 22
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 10
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