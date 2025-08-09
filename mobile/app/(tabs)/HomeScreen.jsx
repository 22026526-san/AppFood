import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, RefreshControl } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CategoriCard from '../../components/CategoriCard';
import burger from '../../assets/burger.png'
import Noodles from '../../assets/Noodles.png'
import Pizza from '../../assets/pizza.png'
import rice from '../../assets/rice.png'
import fried_chicken from '../../assets/fried_chicken.png'
import Drinks from '../../assets/drink.jpg'
import FoodCard from '../../components/FoodCard';
import TopRateCard from '../../components/TopRateCard';
import { API_URL } from '@env'
import LoadingScreen from '../../components/LoadingScreen';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [dataCard, setDataCard] = useState([]);
  const [dataRate, setDataRate] = useState([]);
  const CartFood = useSelector((state) => state.cart.items);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const currentY = contentOffset.y;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (currentY > lastScrollY.current && currentY > 50) {
      setShowHeader(false);
    } else if (currentY < lastScrollY.current && !isCloseToBottom) {
      setShowHeader(true);
    }
    lastScrollY.current = currentY;
  };

  const data = [
    { id: 1, name: 'Burger', img: burger },
    { id: 2, name: 'Fried Chicken', img: fried_chicken },
    { id: 3, name: 'Pizza', img: Pizza },
    { id: 4, name: 'Noodles', img: Noodles },
    { id: 5, name: 'Rice Meals', img: rice },
    { id: 6, name: 'Drinks', img: Drinks }
  ];

  const apiFoodCard = async () => {
    try {

      const res = await fetch(`${API_URL}/food/get_foodcard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      if (result.success) {
        setDataCard(result.message.allDishes);
        setDataRate(result.message.topRate)
      }

    } catch (err) {
      console.error('Lỗi khi lấy thông tin food_card:', err);
    }
  };

  useEffect(() => {
    apiFoodCard()
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await apiFoodCard();
    setRefreshing(false);
  };

  const handleSearch = async () => {

    try {

      const res = await fetch(`${API_URL}/food/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: search,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        Alert.alert('Không tìm thấy sản phẩm');
        return;
      }

      router.push({
        pathname: '/SearchScreen',
        params: { data_search: JSON.stringify(json.message), text_search: search }
      })


    } catch (error) {
      console.error('Error completing:', error);
      Alert.alert('Đã xảy ra lỗi');
    }
  };


  if (!dataRate.length || !dataCard.length) {
    return <LoadingScreen />;
  }


  return (
    <SafeAreaView style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <View style={{ display: 'flex', justifyContent: 'center' }}>
            <Text style={{ fontSize: 32, color: '#000000b8', fontWeight: "bold" }}>
              Fast Food
            </Text>
          </View>
          <View style={styles.contenCart}>
            <TouchableOpacity onPress={() => router.push('/CartScreen')} style={styles.button}><Ionicons name="bag-outline" size={22} color="#ffffffd5" /></TouchableOpacity>
            <View style={{
              position: 'absolute',
              top: 0,
              right: 2,
              backgroundColor: '#FF6B00',
              borderRadius: 20,
              padding: 6,
            }}>
              <Text style={{ color: '#ffffff', fontSize: 8 }}>{CartFood.length}</Text>
            </View>
          </View>
        </View>
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }} onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        <View style={styles.contenSearch} onPress={() => router.push({
          pathname: '/SearchScreen',
          params: { data_search: [], text_search: search }
        })}>
          <TouchableOpacity onPress={handleSearch}>
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
          <View>
            <Text style={{ fontSize: 18, color: '#000000be' }}>Categories</Text>
          </View>

          <View style={{ marginTop: 22 }}>
            <CategoriCard data={data}></CategoriCard>
          </View>

        </View>

        <View style={styles.contentCategory}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#000000be' }}>Top Rate</Text>
            <TouchableOpacity onPress={() => router.push('/TopRateScreen')} style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }} >
              <Text style={{ fontSize: 18, color: '#000000be' }}>See All</Text>
              <Ionicons name="chevron-forward" size={18} color='#000000be'></Ionicons>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 22 }}>
            <TopRateCard data={dataRate}></TopRateCard>
          </View>

        </View>

        <View style={styles.contentCategory}>

          <Text style={{ fontSize: 18, color: '#000000be' }}>All Fast Food</Text>

          <View style={{ marginTop: 22 }}>
            <FoodCard data={dataCard}></FoodCard>
          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFf",
    marginBottom: -36
  },
  button: {
    backgroundColor: '#000000cb',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10
  },
  contenCart: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    fontSize: 16,
    color: '#000000c2',
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
    marginTop: 12
  },
  contentCategory: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 22
  }
}); 