import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const CategoriCard = (props) => {


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 5 }}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {props.data.map((item) => (
                <View key={item.id} style={styles.card}>
                    <TouchableOpacity>
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
        color: '#000000a9',
    }
});

export default CategoriCard