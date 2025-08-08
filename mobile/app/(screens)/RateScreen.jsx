import React, { useEffect, useContext, useState, useRef } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform,Alert } from 'react-native';
import Logo from '../../assets/fast-food.png'
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { API_URL } from '@env'

const ProductReviewScreen = () => {

    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const router = useRouter();
    const { userId } = useAuth();
    const { data } = useLocalSearchParams();
    const _data_ = JSON.parse(data);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const suggestions = [
        "Hương vị thơm ngon",
        "Gia vị vừa miệng",
        "Trình bày đẹp mắt",
        "Thức ăn nóng hổi",
        "Nguyên liệu tươi ngon",
        "Phần ăn đầy đủ",
        "Đảm bảo vệ sinh",
        "Đáng giá với số tiền",
        "Giao đúng món đã đặt",
        "Đóng gói cẩn thận"
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

    const handleSubmit = async () => {

        try {

            const res = await fetch(`${API_URL}/user/review_foods`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clerkId: userId,
                    comment: review,
                    star:rating,
                    item : _data_.order_detail
                }),
            });
            const json = await res.json();
            console.log(json)
            if (json.success) {
                Alert.alert('Hủy đơn hàng thành công');
                props.onUpdate()
                return;
            }

        } catch (error) {
            console.error('Error completing profile:', error);
            Alert.alert('Đã xảy ra lỗi');
        }
    };



    const ratingTexts = ["Tệ", "Không hài lòng", "Bình thường", "Hài lòng", "Tuyệt vời"];


    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Ionicons name={i <= rating ? 'star' : 'star-outline'} size={20} color={'#ffe600ff'} />
                </TouchableOpacity>
            );
        }
        return (
            <View style={styles.starsContainer}>
                {stars}
                {rating > 0 && <Text style={styles.ratingText}>{ratingTexts[rating - 1]}</Text>}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>

            {showHeader && (
                <View style={styles.header}>
                    <View>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 22, color: '#000000d5', fontWeight: 'bold' }}>Xác nhận đơn hàng</Text>
                </View>
            )}

            <KeyboardAvoidingView
                style={styles.buttonContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    onScroll={handleScroll}>

                    {_data_.order_detail.map((item) => (
                        <TouchableOpacity key={item.food_id} style={styles.info} onPress={() => router.push(
                            {
                                pathname: '/FoodDetail',
                                params: { foodId: item.food_id }
                            }
                        )}>

                            <Image source={Logo} style={styles.image} resizeMode='cover'></Image>
                            <Text style={styles.quantity}>{item.quantity} x</Text>
                            <Text style={styles.name}>{item.food_name}</Text>
                            <Text style={styles.price}>{(item.unit_price * 1).toLocaleString('VND')}</Text>

                        </TouchableOpacity>
                    ))}


                    <View style={styles.ratingSection}>
                        <Text style={styles.qualityLabel}>Mức độ hài lòng:</Text>
                        <View style={{ width: '100%', alignItems: 'center', marginTop: 12 }}>
                            {renderStars()}
                        </View>
                    </View>


                    <View style={styles.reviewInputWrapper}>
                        <View style={styles.reviewInputContainer}>
                            <Text style={styles.reviewPlaceholderLabel}>Chất lượng sản phẩm:</Text>
                            <View style={styles.separator} />
                            <TextInput
                                style={styles.textInput}
                                multiline
                                placeholder="Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé!"
                                value={review}
                                onChangeText={(e) => setReview(e)}
                                placeholderTextColor="#c7c7c7"
                            />
                        </View>
                    </View>

                    <View style={styles.container}>
                        {suggestions.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => setReview(item)} style={styles.tag}>
                                <Text style={styles.tagText}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Gửi</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#ffffff",
        marginBottom: -36
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
    ratingSection: {
        backgroundColor: '#FFFFFF',
        padding: 5,
        flexDirection: 'colum',
        marginTop: 22
    },
    qualityLabel: {
        fontSize: 16,
        color: '#333',
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    },

    ratingText: {
        fontSize: 14,
        color: '#EE4D2D',
        fontWeight: 'bold',
        marginLeft: 8,
        marginTop: 4
    },
    incentiveTextContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    incentiveText: {
        fontSize: 13,
        color: '#888'
    },
    mediaUploadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#FFFFFF',
    },
    uploadButton: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#EE4D2D',
        borderStyle: 'dashed',
        borderRadius: 8,
        width: '48%',
        height: 90,
        backgroundColor: '#FFF7F5'
    },
    cameraIcon: {
        fontSize: 28,
        color: '#EE4D2D'
    },
    uploadButtonText: {
        marginTop: 8,
        fontSize: 14,
        color: '#333',
    },
    reviewInputWrapper: {
        backgroundColor: '#FFFFFF',
        marginTop: 12,
    },
    reviewInputContainer: {
        backgroundColor: '#F9F9F9',
        borderRadius: 4,
        padding: 10,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    reviewPlaceholderLabel: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20
    },
    textInput: {
        height: 186,
        textAlignVertical: 'top',
        fontSize: 15,
        color: '#333',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
    button: {
        backgroundColor: '#96a8be11',
        borderRadius: 25,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        flex: 1
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff'
    },
    submitButton: {
        backgroundColor: '#EE4D2D',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        borderWidth: 1,
        padding: 5,
        marginTop: 22,
        borderColor: '#cecece86',
        borderRadius: 5,
        marginBottom: 22
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color: '#000',
        fontSize: 15,
    },
});

export default ProductReviewScreen;