import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Logo from '../assets/fast-food.png'

const TopRateList = (props) => {

    const renderItem = ({ item }) => (
        <TouchableOpacity key={item.food_id} style={styles.card} onPress={() => router.push({
            pathname: '/FoodDetail',
            params: { foodId: item.food_id }
        })}>
            <View style={{ width: '120', height: '120' }}>
                <Image source={Logo} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.food_name}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Text>{item.food_rate}</Text>
                    <Ionicons name="star-outline" color={'#ffb804cd'} size={15}></Ionicons>
                </View>
                <Text>{(item.price * 1).toLocaleString('VND')}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={props.data}
            keyExtractor={(item) => item.food_id.toString()}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={{ padding: 5 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
        />
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginBottom: 22,
        shadowColor: '#888888ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '146',
        height: '196'
    },
    name: {
        fontSize: 18,
        color: '#000000d6',
        marginBottom: 8,
        fontWeight: 'bold'
    }
});

export default TopRateList