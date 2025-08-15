import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Logo from '../assets/logo_food.png'
import { useRouter } from 'expo-router';

const FoodListCard = (props) => {
  const router = useRouter();
  return (
    <>
      {props.data.map((item) => (
        <View key={item.food_id} style={{ flexDirection: 'row', gap: 5, Width: '100%', marginTop: 22 }}>
          <Image source={
            item.image_url
              ? { uri: item.image_url }
              : Logo
          } style={styles.img} resizeMode="cover" ></Image>
          <View style={{ flexDirection: 'column', justifyContent: 'space-between', minWidth: '72%', padding: 3 }}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={{ fontSize: 14, color: '#272727ff', fontWeight: 'bold' }}>{item.food_name}</Text>
              <TouchableOpacity>
                <Ionicons name="trash-outline" size={14} color={'#cacacaff'} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#ff510037', borderRadius: 15, padding: 5 }}>
                <Text style={{ fontSize: 14, color: '#ff6200ff' }}>{item.category_name}</Text>
              </View>
              <Text tyle={{ fontSize: 14, color: '#272727ff' }}>{(item.price * 1).toLocaleString('VND')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Ionicons name='star' size={14} color={'#ff8e0eff'} />
                  <Text style={{ fontSize: 14, color: '#da5a14ff' }}>{item.food_rate}</Text>
                </View>
                <Text style={{ fontSize: 14, color: '#959595ff' }}>({item.sum_rate} reviews)</Text>
              </View>
              <TouchableOpacity onPress={() => router.push({
                pathname: '/(adminScreens)/FoodDetailScreen',
                params: { foodId: item.food_id }
              })}>
                <Ionicons name="arrow-forward-outline" color={'#b5b5b5ff'} size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </>
  )
}
const styles = StyleSheet.create({
  img: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: '#f96b0dad'
  }
})
export default FoodListCard