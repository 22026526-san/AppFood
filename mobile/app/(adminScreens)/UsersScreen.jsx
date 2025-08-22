import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput, Image, Modal ,Alert} from 'react-native'
import React, { useEffect, useContext, useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { API_URL } from '@env'
import { useAuth } from '@clerk/clerk-expo';
import imageUser from '../../assets/img_user.png'


const VoucherScreen = () => {

    const router = useRouter();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState(data);
    const [search, setSearch] = useState('');
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState("none");
    const [dataItem, setDataItem] = useState([]);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

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

    const getUsers = async () => {

        try {

            const res = await fetch(`${API_URL}/admin/get_users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await res.json();
            
            if (result.success) {
                setData(result.user);
                setFilteredData(result.user);
            }

        } catch (err) {
            console.error('Lỗi:', err);
        }
    };

    const handleOnPress = async (active, Id) => {

        try {

            const res = await fetch(`${API_URL}/admin/user_active`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: Id,
                    active: active
                }),
            });
            const json = await res.json();
        
            if (json.success) {
                Alert.alert('Thành công');
                return;
            }
            Alert.alert('Đã xảy ra lỗi trong quá trình thực thi');
        } catch (error) {
            console.error('Error completing error:', error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getUsers();
        setSearch('');
        setSearchText('');
        setSortOrder("none");
        setRefreshing(false);
    };

    const handleSearch = async () => {
        setSearch(searchText);
        const result = data.filter((user) =>
            user.user_name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(result);
        setSortOrder("none");
    };

    const handleSort = () => {
        let sorted = [...filteredData];

        if (sortOrder === "none" || sortOrder === "desc") {
            sorted.sort((a, b) =>
                a.user_name.localeCompare(b.user_name, "vi", { sensitivity: "base" })
            );
            setSortOrder("asc");
        } else if (sortOrder === "asc") {
            sorted.sort((a, b) =>
                b.user_name.localeCompare(a.user_name, "vi", { sensitivity: "base" })
            );
            setSortOrder("desc");
        }

        setFilteredData(sorted);
    };


    if (data.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>

                        <Text style={{ fontSize: 22, color: '#000000d2', fontWeight: 'bold' }}>Users</Text>

                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>

                    <View style={{ marginTop: 286, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, color: '#ff5e00b0' }} >There are no Users in your app.</Text>
                    </View>

                </ScrollView>
            </SafeAreaView>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            {showHeader && (
                <View style={styles.header}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>

                        <Text style={{ fontSize: 22, color: '#000000d2', fontWeight: 'bold' }}>Users</Text>

                    </View>
                </View>
            )}
            <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }} onScroll={handleScroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>

                <View style={styles.contenSearch} onPress={() => router.push({
                    pathname: '/SearchScreen',
                    params: { data_search: [], text_search: search }
                })}>
                    <TouchableOpacity onPress={handleSearch}>
                        <Ionicons name="search" size={23} color="#2521213c"></Ionicons>
                    </TouchableOpacity>
                    <TextInput
                        value={searchText}
                        placeholder="Search dishes ..."
                        onChangeText={(e) => setSearchText(e)}
                        style={styles.input}>
                    </TextInput>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, padding: 5 }}>
                    {search && (
                        <Text style={{ fontSize: 16, color: '#00000084' }}>Kết quả cho: {search}</Text>
                    )}
                    {!search && (
                        <Text style={{ fontSize: 16, color: '#00000084' }}>All</Text>
                    )}
                    <TouchableOpacity onPress={handleSort}>
                        <Ionicons name="swap-vertical-outline" size={18} color="#727272d2" />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 8 }}>
                    {filteredData.map((item) => (
                        <View key={item.user_id} style={styles.card}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Image source={
                                    item.img
                                        ? { uri: item.img }
                                        : imageUser
                                } style={styles.img} resizeMode="cover" ></Image>
                                <View>
                                    <Text style={{ fontSize: 16, color: '#1d1d1dff' }}>{item.user_name}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => { setDataItem(item); setModalVisible(true) }}>
                                <Ionicons name="eye-outline" size={24} color="#8e8e8eff" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

            </ScrollView>
            {modalVisible && (
                <View style={{ padding: 20 }}>

                    <Modal visible={modalVisible} animationType="slide" transparent>
                        <View style={styles.modalWrapper}>


                            {dataItem && (
                                <View style={styles.modalContainer}>
                                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Image source={
                                            dataItem.img
                                                ? { uri: dataItem.img }
                                                : imageUser
                                        } style={{ width: 66, height: 66, borderRadius: 25, marginTop: 12 }} resizeMode="cover" ></Image>
                                        <Text style={{ fontSize: 16, color: '#000000d2', marginTop: 12 }}>Name: {dataItem.user_name}</Text>
                                        <Text style={{ fontSize: 16, color: '#000000d2', marginTop: 12 }}>Email: {dataItem.email}</Text>
                                        <Text style={{ fontSize: 16, color: '#000000d2', marginTop: 12 }}>Phone: {dataItem.phone}</Text>
                                        <Text style={{ fontSize: 16, color: '#000000d2', marginTop: 12 }}>create: {dataItem.created_at.slice(0, 10)}</Text>
                                    </View>
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity onPress={() => {
                                            setModalVisible(false);
                                        }} style={styles.clearButton}>
                                            <Text style={{ color: '#f4511e' }}>Hủy</Text>
                                        </TouchableOpacity>

                                        {dataItem.user_active === 1 ? (
                                            <TouchableOpacity style={styles.okButton} onPress={() => 
                                                handleOnPress(0, dataItem.user_id)}>
                                                <Text style={{ color: 'white' }}>Chặn</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity style={styles.okButton} onPress={() => 
                                                handleOnPress(1, dataItem.user_id)}>
                                                <Text style={{ color: 'white' }}>Bỏ Chặn</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}

                        </View>
                    </Modal>

                </View>
            )}
        </SafeAreaView >
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
    contenSearch: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#96a8be11',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ffffff',
        marginTop: 12
    },
    input: {
        fontSize: 16,
        color: '#000000c2',
        width: '100%',
    },
    img: {
        width: 46,
        height: 46,
        borderRadius: 16,
        marginTop: 3,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        borderColor: '#0808081b',
        borderWidth: 1,
        marginBottom: 22,
        justifyContent: 'space-between'
    },
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        width: '80%'
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

export default VoucherScreen