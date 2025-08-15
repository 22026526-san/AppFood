import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TextInput, Alert, RefreshControl ,ActivityIndicator} from 'react-native'
import React, { useEffect, useContext, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { API_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';

const CategoryScreen = () => {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [category, setCategory] = useState('');
    const [img, setImg] = useState(new FormData());
    const [isLoading,setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
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

    const pickImage = async () => {

        if (!category) {
            Alert.alert("Vui lòng nhập category");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {

            const imageAsset = result.assets[0];
            const fileName = imageAsset.uri.split('/').pop();
            const fileType = imageAsset.type || 'image/jpeg';

            const formData = new FormData();
            formData.append("image", {
                uri: imageAsset.uri,
                name: fileName,
                type: fileType
            });
            formData.append('categoryName', category)
            setImg(formData);
            Alert.alert('Thêm ảnh thành công')
        }
    }
    const handleSave = async () => {

        setIsLoading(true)
        try {

            const res = await fetch(`${API_URL}/admin/insert_category`, {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: img
            });
            const json = await res.json();
            console.log(json)
            if (json.success) {
                setIsLoading(false)
                Alert.alert('Category đã được thêm thành công');
                return;
            }
            setIsLoading(false)
            Alert.alert('Đã xảy ra lỗi trong quá trình thực thi');
        } catch (error) {
            console.error('Error completing error:', error);
        }
    };

    const handleDelete = async (id) => {


        try {

            const res = await fetch(`${API_URL}/admin/delete_category`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cateId: id
                })
            });
            const json = await res.json();
            console.log(json)
            if (json.success) {
                Alert.alert('Xóa thành công');
                return;
            }
            Alert.alert('Đã xảy ra lỗi trong quá trình thực thi');
        } catch (error) {
            console.error('Error completing error:', error);
        }
    };

    const getCategory = async () => {
        try {

            const res = await fetch(`${API_URL}/food/get_category`, {
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
            console.error('Lỗi khi lấy thông tin food list:', err);
        }
    };
    useEffect(() => {
        getCategory()
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getCategory();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            {showHeader && (
                <View style={styles.header}>
                    <View>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 22, color: '#000000d5', fontWeight: 'bold' }}>Categories</Text>
                </View>
            )}
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20, }} onScroll={handleScroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={styles.cateContainer}>
                    {data.map((item) => (
                        <View key={item.category_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <View style={styles.card}>
                                <Image source={{ uri: item.category_img }} style={{ width: 100, height: 100 }} resizeMode='cover'></Image>
                            </View>
                            <Text style={styles.name}>{item.category_name}</Text>
                            <TouchableOpacity style={{
                                position: 'absolute',
                                top: 8,
                                right: 6,
                            }} onPress={() => handleDelete(item.category_id)}>
                                <Ionicons name="trash-outline" size={16} color={'#cacacaff'} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <KeyboardAvoidingView
                style={styles.buttonContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    <View style={{ marginBottom: 12 }}>
                        <View style={styles.input}>
                            <TextInput
                                value={category}
                                placeholder="Enter new category"
                                onChangeText={(e) => setCategory(e)}
                                style={{ width: '96%' }}
                            />
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={pickImage}>
                                <Ionicons name="camera-outline" size={18} color={'orange'} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity activeOpacity={0.7} style={styles.buttonSubmit} onPress={handleSave}>
                            <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {isLoading && (
                <View style={{ position: 'absolute',top: '50%', left: '52%', transform: [{ translateX: -25 }, { translateY: -25 }]}}>
                    <ActivityIndicator size="large" color="#1f1f20ff" />
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
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
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
    buttonContainer: {
        minHeight: '22%',
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
    cateContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 36,
        padding: 5,
        marginTop: 22,
        borderColor: '#cecece86',
        borderRadius: 5,
        marginBottom: 22,
        justifyContent: 'center'
    },
    input: {
        fontSize: 16,
        color: '#000000c2',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#96a8be2f',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffffff',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#888888ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 120,
        height: 120
    },
    name: {
        fontSize: 18,
        color: '#000000d2',
    }
})

export default CategoryScreen