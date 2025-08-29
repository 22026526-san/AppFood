import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React, { useEffect, useContext, useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@env'
import Logo from '../../assets/fast-food.png'
import { useAuth } from '@clerk/clerk-expo';
import { useSelector } from 'react-redux';
import { UserContext } from '../../services/UserContextAPI';


const OrderOptionsScreen = () => {
    const router = useRouter();
    const { userId } = useAuth();
    const { discount, voucher } = useLocalSearchParams();
    const [showHeader, setShowHeader] = useState(true);
    const [text, setText] = useState('')
    const [type, setType] = useState('')
    const [payment, setPayment] = useState('cod')
    const lastScrollY = useRef(0);
    const [atHome, setHome] = useState(false);
    const [atStore, setStore] = useState(false);
    const [onl, setOnl] = useState(false);
    const CartFood = useSelector((state) => state.cart.items)
    const {name} = useContext(UserContext)

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
            return total + (product.price * product.quantity);
        }, 0);
    };

    const handleSubmit = async () => {

        try {

            const res = await fetch(`${API_URL}/user/order_foods`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clerkId : userId,
                    order_type : type,
                    text : text,
                    discount : discount,
                    payment : payment,
                    voucher : voucher,
                    name : name
                }),
            });
            const json = await res.json();
            console.log(json)

            if (!json.success) {
                Alert.alert('Đặt hàng không thành công');
                return;
            }

            Alert.alert('Đặt hàng thành công')

            router.push('/OrderScreen')


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
                    <Text style={{ fontSize: 22, color: '#000000d5', fontWeight: 'bold' }}>Xác nhận đơn hàng</Text>
                </View>
            )}
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }} onScroll={handleScroll}>

                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 10 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name='alert-circle-outline' color={"#c8c7c7ff"} size={18} />
                        <Text style={{ fontSize: 16, color: '#000000d5' }}>Order :</Text>
                    </View>
                    <TouchableOpacity onPress={() => { setType('at_home'); setStore(false); setHome(true) }} style={styles.card}>
                        <Text style={{ fontSize: 13, color: atHome ? 'orange' : 'black' }}>Tại nhà</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setType('at_store'); setStore(true); setHome(false) }} style={styles.card}>
                        <Text style={{ fontSize: 13, color: atStore ? 'orange' : 'black' }}>Tại quán</Text>
                    </TouchableOpacity>
                </View>

                {atHome && (
                    <View style={styles.textInput}>
                        <Ionicons name='location-outline' size={18} color={'orange'}></Ionicons>
                        <TextInput
                            value={text}
                            placeholder="Nhập địa chỉ của bạn ..."
                            onChangeText={(e) => setText(e)}
                            style={styles.input}
                            multiline={true}
                        ></TextInput>
                    </View>
                )}

                {atStore && (
                    <View style={styles.textInput}>
                        <Ionicons name="tablet-portrait" size={18} color={'orange'}></Ionicons>
                        <TextInput
                            value={text}
                            placeholder="Nhập số bàn của bạn ..."
                            onChangeText={(e) => setText(e)}
                            style={styles.input}
                            multiline={true}
                        ></TextInput>
                    </View>
                )}

                <View style={{ display: 'flex', flexDirection: 'colum', marginTop: 22 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Ionicons name='alert-circle-outline' color={"#c8c7c7ff"} size={18} />
                        <Text style={{ fontSize: 16, color: '#000000d5' }}>Phương thức thanh toán :</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 10 }}>
                        <TouchableOpacity onPress={() => { setPayment('online'); setOnl(true) }} style={styles.card}>
                            <Text style={{ fontSize: 13, color: onl ? 'orange' : 'black' }}>Internet Banking</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setPayment('cod'); setOnl(false) }} style={styles.card}>
                            <Text style={{ fontSize: 13, color: !onl ? 'orange' : 'black' }}>Tiền mặt</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {onl && (
                    <View style={{ marginTop: 12, gap: 5 }}>
                        <Text style={{ color: '#909090ff' }}>Tài khoản ngân hàng : 81615122003 - MB Bank</Text>
                        <Text style={{ color: '#909090ff' }}>(Lưu Ý) : Nội dung chuyển khoản là số điện thoại mà bạn đăng kí cho tài khoản.</Text>
                    </View>
                )}

                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 22 }}>
                    <Ionicons name='alert-circle-outline' color={"#c8c7c7ff"} size={18} />
                    <Text style={{ fontSize: 16, color: '#000000d5' }}>Fast Food :</Text>
                </View>

                {CartFood.map((item) => (
                    <TouchableOpacity key={item.food_id} style={styles.info} onPress={() => router.push(
                        {
                            pathname: '/FoodDetail',
                            params: { foodId: item.food_id }
                        }
                    )}>

                        <Image source={Logo} style={styles.image} resizeMode='cover'></Image>
                        <Text style={styles.quantity}>{item.quantity} x</Text>
                        <Text style={styles.name}>{item.food_name}</Text>
                        <Text style={styles.price}>{(item.price * 1).toLocaleString('VND')}</Text>

                    </TouchableOpacity>
                ))}

                <View style={{ marginTop: 22 }}>

                    <Text style={styles.title}>Chi tiết thanh toán</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Tổng giá món</Text>
                        <Text style={styles.value}>{(TotalPrice(CartFood)).toLocaleString('VND')}</Text>
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
                        <Text style={styles.totalValue}>{(TotalPrice(CartFood) - discount).toLocaleString('VND')}</Text>
                    </View>

                    <Text style={styles.footer}>Đã bao gồm thuế</Text>
                </View>

            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity activeOpacity={0.7} style={styles.buttonSubmit} onPress={handleSubmit}>
                    <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>Đặt đơn</Text>
                </TouchableOpacity>
            </View>
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
        marginTop: 4,
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

export default OrderOptionsScreen