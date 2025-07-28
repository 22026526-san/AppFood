import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const CategoriCard = (props) => {

    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 5 }}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {props.data.map((item) => (
                <View key={item.id} style={styles.card}>
                    <TouchableOpacity onPress={() => router.push({
                        pathname: '/CategoriDetail',
                        params: {cate_id : item.id, cate_name : item.name}
                    })}>
                        <Text style={styles.name}>{item.name}</Text>
                    </TouchableOpacity>
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
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#888888ff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    name: {
        fontSize: 18,
        color: '#000000d2',
    }
});

export default CategoriCard