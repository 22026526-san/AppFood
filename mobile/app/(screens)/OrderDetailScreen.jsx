import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React, { useEffect, useContext, useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@env'
import Logo from '../../assets/fast-food.png'
import { useAuth } from '@clerk/clerk-expo';
import { UserContext } from '../../services/UserContextAPI';
import { useDispatch } from 'react-redux';
import { re_orders } from '../../redux/cartAction';

const OrderDetailScreen = () => {
    const router = useRouter();
    const dispatch = useDispatch()
    const { data, discount, action } = useLocalSearchParams();
    const _data_ = JSON.parse(data);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const { phone, name } = useContext(UserContext);

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

    const TotalPrice = (products) => {
        return products.reduce((total, product) => {
            return total + (product.unit_price * product.quantity);
        }, 0);
    };

    const handleSubmit = async (id, status) => {

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
                    name : name
                }),
            });
            const json = await res.json();

            if (json.success) {
                Alert.alert('Hủy đơn hàng thành công');
                return;
            }

        } catch (error) {
            console.error('Error completing profile:', error);
            Alert.alert('Đã xảy ra lỗi');
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {showHeader && (
                <View style={styles.header}>
                    <View>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 22, color: '#000000d5', fontWeight: 'bold' }}>Chi tiết đơn hàng</Text>
                </View>
            )}
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }} onScroll={handleScroll}>

                {_data_.address && (
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22 }}>
                            <Ionicons name="location" size={16} color={'orange'}></Ionicons>
                            <Text style={{ fontSize: 16, color: '#828282ff' }}>Từ</Text>
                        </View>

                        <View style={{ flexDirection: 'column', gap: 8, marginTop: 8 }}>
                            <Text style={{ fontSize: 16, color: '#171717ff', fontWeight: 'bold' }}>Đồ ăn | Fast Food - Đồ ăn nhanh Gà rán, Pizza, Hamburger - Xuân Thủy , Cầu Giấy</Text>
                            <Text style={{ fontSize: 14, color: '#828282ff' }}>Số 144 đường Xuân Thủy, Quận Cầu Giấy, Hà Nội</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22 }}>
                            <Ionicons name="location" size={16} color={'green'}></Ionicons>
                            <Text style={{ fontSize: 16, color: '828282ff' }}>Đến</Text>
                        </View>

                        <View>
                            <Text style={{ fontSize: 16, color: '#171717ff', fontWeight: 'bold', marginTop: 8 }}>{_data_.address}</Text>
                            <Text style={{ fontSize: 14, color: '#828282ff', marginTop: 8 }}>{name} - {phone}</Text>
                        </View>
                    </>
                )}

                {_data_.table_number && (
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22 }}>
                            <Ionicons name="location" size={16} color={'orange'}></Ionicons>
                            <Text style={{ fontSize: 16, color: '#828282ff' }}>Từ</Text>
                        </View>

                        <View style={{ flexDirection: 'column', gap: 8, marginTop: 8 }}>
                            <Text style={{ fontSize: 16, color: '#171717ff', fontWeight: 'bold' }}>Đồ ăn | Fast Food - Đồ ăn nhanh Gà rán, Pizza, Hamburger - Xuân Thủy , Cầu Giấy</Text>
                            <Text style={{ fontSize: 14, color: '#828282ff' }}>Số 144 đường Xuân Thủy, Quận Cầu Giấy, Hà Nội</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22 }}>
                            <Ionicons name="location" size={16} color={'green'}></Ionicons>
                            <Text style={{ fontSize: 16, color: '#828282ff' }}>Đến</Text>
                        </View>

                        <Text style={{ fontSize: 16, color: '#171717ff', fontWeight: 'bold', marginTop: 8 }}>Bàn số {_data_.table_number}</Text>

                        <Text style={{ fontSize: 14, color: '#828282ff', marginTop: 8 }}>{name} - {phone}</Text>
                    </>
                )}

                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 22 }}>
                    <Ionicons name='alert-circle-outline' color={"#c8c7c7ff"} size={18} />
                    <Text style={{ fontSize: 16, color: '#000000d5' }}>Chi tiết đơn hàng :</Text>
                </View>

                {_data_.order_detail.map((item) => (
                    <TouchableOpacity key={item.food_id} style={styles.info} onPress={() => router.push(
                        {
                            pathname: '/FoodDetail',
                            params: { foodId: item.food_id }
                        }
                    )}>

                        <Image source={
                            item.image_url
                                ? { uri: item.image_url }
                                : Logo
                        } style={styles.image} resizeMode='cover'></Image>
                        <Text style={styles.quantity}>{item.quantity} x</Text>
                        <Text style={styles.name}>{item.food_name}</Text>
                        <Text style={styles.price}>{(item.unit_price * 1).toLocaleString('VND')}</Text>

                    </TouchableOpacity>
                ))}

                <View style={{ marginTop: 22 }}>

                    <View style={styles.row}>
                        <Text style={styles.label}>Tổng ({_data_.order_detail.length} món)</Text>
                        <Text style={styles.value}>{(TotalPrice(_data_.order_detail)).toLocaleString('VND')}</Text>
                    </View>


                    <View style={styles.row}>
                        <Text style={styles.label}>Phí giao hàng </Text>
                        <Text style={styles.value}>0</Text>
                    </View>

                    <View style={styles.row}>

                        <Text style={styles.label}>Voucher </Text>

                        <Text style={styles.value}>{(discount == 0 ? 0 : - discount).toLocaleString('VND')}</Text>
                    </View>

                    {/* Đường kẻ */}
                    <View style={styles.separator} />

                    <View style={styles.row}>
                        <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                        <Text style={styles.totalValue}>{(TotalPrice(_data_.order_detail) - discount).toLocaleString('VND')}</Text>
                    </View>

                    <View style={{ width: '100%', alignItems: 'flex-end' }}>
                        <Text style={styles.footer}>Đã bao gồm thuế</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }}>
                        <Text style={styles.footer}>Mã đơn hàng</Text>
                        <Text style={styles.footer}>#{_data_.created_at.slice(11, 19).split(":").reverse()}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }}>
                        <Text style={styles.footer}>Thời gian đặt hàng</Text>
                        <Text style={styles.footer}>{_data_.created_at.slice(0, 10)} {_data_.created_at.slice(11, 16)}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }}>
                        <Text style={styles.footer}>Thanh toán</Text>
                        <Text style={styles.footer}>{_data_.payment_method === 'cod' ? 'Tiền mặt' : 'Online'}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }}>
                        <Text style={styles.footer}>Trạng thái</Text>
                        <Text style={styles.footer}>{_data_.status_payment === 'no' ? 'Chưa thanh toán' : 'Đã thanh toán'}</Text>
                    </View>
                </View>

            </ScrollView>
            {action === 'track_order' && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.buttonSubmit} onPress={() => { handleSubmit(_data_.order_id, _data_.status) }}>
                        <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            {action === 're_order' && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.buttonSubmit} onPress={() => { { dispatch(re_orders(_data_.order_detail)), router.push('/CartScreen') } }}>
                        <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>Re-Orders</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
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
        gap: 8,
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
    textInput: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        fontSize: 16,
        color: '#000000c2',
        paddingVertical: 8,
        paddingHorizontal: 12,
        textAlignVertical: 'top'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        gap: 5,
        borderColor: '#0808081b',
        borderWidth: 1
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 6,
        marginRight: 8
    },
    info: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        marginTop: 12
    },
    quantity: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    name: {
        fontSize: 14,
        flexWrap: 'wrap',
        maxWidth: '57%',
        minWidth: '56%'
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000'
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        color: '#555',
        fontSize: 14,
    },
    value: {
        color: '#000',
        fontSize: 14,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
    },
    footer: {
        fontSize: 12,
        color: '#999',
        marginTop: 4
    },
    buttonContainer: {
        minHeight: '10%',
        width: '100%',
        backgroundColor: '#ffffffff',
        display: 'flex',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    buttonSubmit: {
        backgroundColor: '#ff6a00d9',
        borderRadius: 12,
        marginTop: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderColor: '#ffffffff',
        borderWidth: 2,
        width: '100%',
        marginBottom: 10
    },
})

export default OrderDetailScreen