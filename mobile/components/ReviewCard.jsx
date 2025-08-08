import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { API_URL } from '@env'
import imageUser from '../assets/img_user.png'

const ReviewCard = (props) => {
    return (
        <>
            {props.data.map((item) => (
                <View key={item.review_id}>
                    <View style={styles.separator} />
                    <View style={styles.container}>
                        <Image source={
                            item.img
                                ? { uri: item.img }
                                : imageUser
                        } style={styles.img} resizeMode="cover" ></Image>
                        <View>
                            <Text style={{ fontSize: 12, color: '#353535ff' }}>{item.user_name}</Text>
                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                {[...Array(5)].map((_, i) => (
                                    <Ionicons
                                        key={i}
                                        name={i < item.star ? 'star' : 'star-outline'}
                                        size={13}
                                        color={'#ffe600'}
                                    />
                                ))}
                            </View>
                            <Text style={{ fontSize: 13, color: '#353535ff', marginTop: 8 }}>{item.comment}</Text>
                            <Text style={{ fontSize: 12, color: '#606060ff' }}>{item.created_at.slice(0, 10)} {item.created_at.slice(11, 16)}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flexDirection: 'row',
        gap: 8
    },
    img: {
        width: 22,
        height: 22,
        borderRadius: 16,
        marginTop: 3,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },

})

export default ReviewCard