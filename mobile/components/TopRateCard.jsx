import { View, Text, ScrollView, StyleSheet, TouchableOpacity ,Image} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const TopRateCard = (props) => {

    const router = useRouter();
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 5 }}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {props.data.map((item) => (
                <TouchableOpacity key={item.food_id} style={styles.card} onPress={()=> router.push({
                    pathname: '/FoodDetail',
                    params: {foodId : item.food_id}
                })}>
                    <View style={{width:'120',height:'120'}}>
                        <Image source={item.img_url} style={{ width: '100%', height: '100%' }}resizeMode="cover"/>
                    </View>
                    <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.food_name}</Text>
                    <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}> 
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center',gap:2}}>
                            <Text>4.7</Text>
                            <Ionicons name="star-outline" color={'#ffb804cd'} size={15}></Ionicons>
                        </View>
                        <Text>{item.price}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 26,
        shadowColor: '#888888ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        display:'flex',
        flexDirection:'column',
        width:'146',
        height:'192'
    },
    name: {
        fontSize: 16,
        color: '#000000d6',
        marginBottom:8,
        fontWeight:'bold'
    }
});

export default TopRateCard