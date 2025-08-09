import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native'
import React, { useEffect, useContext, useState, useRef } from 'react'
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
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const [refreshing, setRefreshing] = useState(false);

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

    const onRefresh = async () => {
        setRefreshing(true);
        await topRateAll();
        setRefreshing(false);
    };


    if (!data.length) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            {showHeader && (
                <View style={styles.header}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
                        <View style={styles.card}>
                            <Text style={{ fontSize: 14, color: '#000000d2', fontWeight: 'bold' }}>Top Rate</Text>
                            <Ionicons name="caret-down" color={'#ff5e00b0'} size={14}></Ionicons>
                        </View>
                    </View>

                    <View>
                        <TouchableOpacity style={styles.buttonSearch} onPress={() => router.push({
                            pathname: '/SearchScreen',
                            params: { data_search: [], text_search: '' }
                        })}><Ionicons name="search" size={20} color="#ffffffd5" /></TouchableOpacity>
                    </View>
                </View>
            )}
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }} onScroll={handleScroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>

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