import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { API_URL } from '@env'
import TopRateCard from '../../components/TopRateCard';
import Logo from '../../assets/fast-food.png'
import FoodCard from '../../components/FoodCard';

const SearchScreen = () => {

  const router = useRouter();
  const [search, setSearch] = useState();
  const count = 2;

  const fakeData = [
    {
      food_id: 1,
      food_name: 'Cheese Burger',
      img_url: Logo,
      price: '$5.99'
    },
    {
      food_id: 2,
      food_name: 'Fried Chicken',
      img_url: Logo,
      price: '$7.49'
    },
    {
      food_id: 3,
      food_name: 'Pepperoni Pizza',
      img_url: Logo,
      price: '$8.99'
    },
    {
      food_id: 4,
      food_name: 'Hotdog Classic',
      img_url: Logo,
      price: '$4.50'
    },
    {
      food_id: 5,
      food_name: 'French Fries',
      img_url: Logo,
      price: '$3.99'
    },
    {
      food_id: 6,
      food_name: 'Coca Cola',
      img_url: Logo,
      price: '$1.99'
    }
  ];

  const keyword = [
    { id: 1, name: 'Burger' },
    { id: 2, name: 'Fried Chicken' },
    { id: 3, name: 'Pizza' },
    { id: 4, name: 'Noodles & Pasta' },
    { id: 5, name: 'Rice Meals' },
    { id: 6, name: 'Drinks' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }}>

        <View style={styles.header}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
            <View style={{ alignItems: 'center' }} >
              <Text style={{ fontSize: 22, color: '#000000d2', fontWeight: 'bold' }}>Search</Text>
            </View>
          </View>

          <View style={styles.contenCart}>
            <TouchableOpacity onPress={() => router.push('/CartScreen')} style={styles.buttonSearch}><Ionicons name="bag-outline" size={22} color="#ffffffd5" /></TouchableOpacity>
            <View style={{
              position: 'absolute',
              top: 0,
              right: 2,
              backgroundColor: '#FF6B00',
              borderRadius: 20,
              padding: 6,
            }}>
              <Text style={{ color: '#ffffff', fontSize: 8 }}>{count}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contenSearch}>
          <TouchableOpacity>
            <Ionicons name="search" size={23} color="#2521213c"></Ionicons>
          </TouchableOpacity>
          <TextInput
            value={search}
            placeholder="Search dishes ..."
            onChangeText={(e) => setSearch(e)}
            style={styles.input}>
          </TextInput>
        </View>

        <View style={styles.contentCategory}>

          <Text style={{ fontSize: 18, color: '#000000be', marginBottom: 22 }}>Recent Keywords</Text>


          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 5 }}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {keyword.map((item) => (
              <View key={item.id} style={styles.card}>
                <TouchableOpacity onPress={() => setSearch(item.name)}>
                  <Text style={{ fontSize: 15 }}>{item.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>


        </View>

        <View style={styles.contentCategory}>

          <Text style={{ fontSize: 18, color: '#000000be' }}>Popular Fast Food</Text>


          <View style={{ marginTop: 22 }}>
            <TopRateCard data={fakeData}></TopRateCard>
          </View>

        </View>


      </ScrollView>
    </SafeAreaView>
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
    marginTop: 22
  },
  input: {
    fontSize: 16,
    color: '#000000c2',
  },
  contenCart: {
    display: 'flex',
    flexDirection: 'column',
  },
})

export default SearchScreen