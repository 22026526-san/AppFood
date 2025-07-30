import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@env'
import Logo from "../../assets/fast-food.png";
import CartItem from '../../components/CartItem';

const CartScreen = () => {

  const router = useRouter();
  const [voucher, setVoucher] = useState('')

  const TotalPrice = (products) => {
    return products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  };

  const dataCart = [
    {
      "food_id": 1,
      "food_name": "Pizza Calzone European",
      "price": 64000,
      "quantity": 2,
      "img_url": Logo
    },
    {
      "food_id": 2,
      "food_name": "Pepperoni Cheese Pizza",
      "price": 59000,
      "quantity": 1,
      "img_url": Logo
    },
    {
      "food_id": 3,
      "food_name": "Margherita Classic Pizza",
      "price": 55000,
      "quantity": 3,
      "img_url": Logo
    }
  ]

  if (dataCart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#ffffffff" /></TouchableOpacity>
            <Text style={{ fontSize: 22, color: '#ffffffff', fontWeight: 'bold' }}>Cart</Text>
          </View>

          <View style={{ marginTop: 286, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 22, color: '#ffffffff' }} >There are no food in the cart.</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, minHeight: '70%' }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#ffffffff" /></TouchableOpacity>
          <Text style={{ fontSize: 22, color: '#ffffffff', fontWeight: 'bold' }}>Cart</Text>
        </View>

        <CartItem data={dataCart}></CartItem>

      </ScrollView>

      <KeyboardAvoidingView
        style={styles.buttonContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={{ marginBottom: 12 }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#3838385f' }}>Voucher</Text>
              <TouchableOpacity>
                <Text style={{ fontSize: 16, color: '#ff6a00b9', textDecorationLine: 'underline' }}>Apply</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={voucher}
              placeholder="Enter voucher"
              onChangeText={(e) => setVoucher(e)}
              style={styles.input}
            />
          </View>

          <View>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#3838385f' }}>Total: </Text>
              <Text style={{ fontSize: 26 }}>{TotalPrice(dataCart).toLocaleString('VND')}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.buttonSubmit}>
              <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>ORDER</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    marginBottom: -36
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  buttonContainer: {
    minHeight: '30%',
    width: '100%',
    backgroundColor: '#ffffffff',
    display: 'flex',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonCard: {
    backgroundColor: '#000000d4',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Img: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    position: 'absolute',
    top: -68,
  },
  foodCard: {
    width: '100%',
    height: 160,
    backgroundColor: '#FFA94D',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 68,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    fontSize: 16,
    color: '#000000c2',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#96a8be2f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffffff',
    width: '100%'
  },
  buttonSubmit: {
    backgroundColor: '#ff6a00d9',
    borderRadius: 12,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderColor: '#ffffffff',
    borderWidth: 2,
    width: '100%',
  },
  button: {
    backgroundColor: '#313141bb',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

export default CartScreen