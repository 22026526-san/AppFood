import { View, Text, ScrollView, StyleSheet, TouchableOpacity,Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const CategoriCard = (props) => {

    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 5 }}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {props.data.map((item) => (
                <View key={item.category_id} style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8, marginRight:22}}>
                    <TouchableOpacity style={styles.card} onPress={() => router.push({
                        pathname: '/CategoriDetail',
                        params: {cate_id : item.category_id, cate_name : item.category_name}
                    })}>
                        <Image source={{uri : item.category_img}} style={{width:100,height:100}} resizeMode='cover'></Image>
                    </TouchableOpacity>
                    <Text style={styles.name}>{item.category_name}</Text>
                </View>
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
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#888888ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width:120,
        height:120
    },
    name: {
        fontSize: 18,
        color: '#000000d2',
    }
});

export default CategoriCard