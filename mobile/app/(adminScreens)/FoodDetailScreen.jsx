import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, FlatList } from 'react-native'
import React, { useEffect, useContext, useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@env'
import Logo from "../../assets/fast-food.png";
import LoadingScreen from '../../components/LoadingScreen';
import { useDispatch } from 'react-redux';
import { addFoodToCart } from '../../redux/cartAction';
import { useAuth } from '@clerk/clerk-expo';
import AdminReviewCard from '../../components/AdminReviewCard';


const FoodDetailScreen = () => {

    const router = useRouter();
    const { userId } = useAuth();
    const { foodId } = useLocalSearchParams();
    const [dataFood, setDataFood] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const [dataReview, setDataReview] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStar, setSelectedStar] = useState(null);
    const [dataFill, setDataFill] = useState([]);
    const starOptions = [
        { id: '5', stars: 5 },
        { id: '4', stars: 4 },
        { id: '3', stars: 3 },
        { id: '2', stars: 2 },
        { id: '1', stars: 1 },
    ];

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

    const renderStarOption = ({ item }) => (
        <TouchableOpacity
            style={styles.option}
            onPress={() => setSelectedStar(item.stars)}
        >
            <View style={styles.radioCircle}>
                {selectedStar === item.stars && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.count}>{item.stars}</Text>
            <View style={styles.starRow}>
                {Array.from({ length: item.stars }).map((_, i) => (
                    <Ionicons key={i} name="star" color="#f5a623" size={16} style={{ marginRight: 2 }} />
                ))}
            </View>
        </TouchableOpacity>
    );

    const foodInfo = async () => {
        try {

            const res = await fetch(`${API_URL}/food/get_info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    foodId: foodId,
                    clerkId: userId,
                }),
            });

            const result = await res.json();
            
            if (result.success) {
                setDataFood(result.message.foodInfo);
                setDataReview(result.message.review);
                setDataFill(result.message.review);
            }

        } catch (err) {
            console.error('Lỗi khi lấy thông tin food:', err);
        }
    };

    useEffect(() => {
        foodInfo();
    }, [foodId]);


    if (!dataFood.length) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>

            {showHeader && (
                <View style={styles.header}>
                    <View style={{ display: 'flex', gap: '8', flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
                        <Text style={{ fontSize: 22, color: '#000000d5', fontWeight: 'bold' }}>Food Details</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push({
                        pathname: '/EditFoodScreen',
                        params: { data: JSON.stringify(dataFood) }
                    })}>
                        <Text style={{ fontSize: 20, color: '#ff6a00b9', textDecorationLine: 'underline' }}>Edit</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }} onScroll={handleScroll}>

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

                    {dataReview.length !== 0 && (
                        <>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000000c8' }}>Reviews</Text>
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Ionicons name="caret-down" color={'#ff5e00b0'} size={18} />
                                </TouchableOpacity>
                            </View>

                            {dataFill.length === 0 && (
                                <View style={{ height: 86, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>Chưa có đánh giá nào</Text>
                                </View>
                            )}

                            {dataFill.length !== 0 && (
                                <AdminReviewCard data={dataFill} onUpdate={foodInfo} />
                            )}
                        </>
                    )}


                </View>

            </ScrollView>

            {modalVisible && (
                <View style={{ padding: 20 }}>

                    <Modal visible={modalVisible} animationType="slide" transparent>
                        <View style={styles.modalWrapper}>
                            <View style={styles.modalContainer}>
                                <FlatList
                                    data={starOptions}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderStarOption}
                                />

                                <View style={styles.buttonRow}>
                                    <TouchableOpacity onPress={() => {
                                        setSelectedStar(null);
                                        setModalVisible(false);
                                        setDataFill(dataReview);
                                    }} style={styles.clearButton}>
                                        <Text style={{ color: '#f4511e' }}>Bỏ lọc</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { setModalVisible(false), setDataFill(dataReview.filter((i) => i.star === selectedStar)) }} style={styles.okButton}>
                                        <Text style={{ color: 'white' }}>Đồng ý</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </View>
            )}
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
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 10
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
        marginTop: 58,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    button: {
        backgroundColor: '#96a8be11',
        borderRadius: 25,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 8
    },
    radioCircle: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#f4511e',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRb: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#f4511e',
    },
    starRow: {
        flexDirection: 'row',
        marginRight: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    clearButton: {
        borderWidth: 1,
        borderColor: '#f4511e',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    okButton: {
        backgroundColor: '#f4511e',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
})
export default FoodDetailScreen