import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { API_URL } from '@env'
import FoodCard from '../../components/FoodCard';
import { useAuth } from '@clerk/clerk-expo';


const FavouriteScreen = () => {

  const router = useRouter();
  const [data, setData] = useState([]);
  const { userId } = useAuth();



  const setFavourite = async () => {
    try {

      const res = await fetch(`${API_URL}/user/set_favourite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: userId,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setData(result.message[0]);
      }

    } catch (err) {
      console.error('Lỗi khi cập nhật favourite:', err);
    }
  };

  useEffect(() => {
    setFavourite();
  });


  if (data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}>
          <View style={styles.header}>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>

              <Text style={{ fontSize: 22, color: '#000000d2', fontWeight: 'bold' }}>Favourite</Text>


            </View>

            <View>
              <TouchableOpacity onPress={() => router.push('/SearchScreen')} style={styles.buttonSearch}><Ionicons name="search" size={20} color="#ffffffd5" /></TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 286, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#ff5e00b0' }} >There are no food in your collection.</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, minHeight: '70%' }}>
        <View style={styles.header}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
            <View style={styles.card}>
              <Text style={{ fontSize: 14, color: '#000000d2', fontWeight: 'bold' }}>Favourite</Text>
              <Ionicons name="caret-down" color={'#ff5e00b0'} size={14}></Ionicons>
            </View>
          </View>

          <View>
            <TouchableOpacity onPress={() => router.push('/SearchScreen')} style={styles.buttonSearch}><Ionicons name="search" size={20} color="#ffffffd5" /></TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 22 }}>
          <FoodCard data={data}></FoodCard>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: '#96a8be11',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonSearch: {
    backgroundColor: '#000000d4',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    backgroundColor: '#ffffffff',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    borderColor: '#0808081b',
    borderWidth: 1
  },
})


export default FavouriteScreen