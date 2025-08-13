import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {API_URL} from '@env'

import imageUser from '../assets/img_user.png'

const AdminReviewCard = (props) => {

    const handleDeleteReview = async (id) => {

        try {

            const res = await fetch(`${API_URL}/admin/delete_review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reviewId: id
                }),
            });
            const json = await res.json();

            if (json.success) {
                Alert.alert('Xóa thành công');
                props.onUpdate()
                return;
            }
            Alert.alert('Đã xảy ra lỗi trong quá trình thực thi');
        } catch (error) {
            console.error('Error completing error:', error);
        }
    };

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
                        <TouchableOpacity onPress={()=> handleDeleteReview(item.review_id)}>
                            <Ionicons name='trash-outline' size={12} color={'#c2c2c2ff'} />
                        </TouchableOpacity>
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
        gap: 8,
        justifyContent: 'space-between'
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

export default AdminReviewCard