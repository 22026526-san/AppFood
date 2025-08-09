import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native'
import React, { useEffect, useContext, useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { API_URL } from '@env'
import TopRateCard from '../../components/TopRateCard';
import LoadingScreen from '../../components/LoadingScreen';
import { useSelector } from 'react-redux';
import FoodCard from '../../components/FoodCard';
import { useLocalSearchParams } from 'expo-router';

const SearchScreen = () => {


  const router = useRouter();
  const { data_search, text_search } = useLocalSearchParams();
  const [search, setSearch] = useState();
  const [dataSearch, setDataSearch] = useState([]);
  const CartFood = useSelector((state) => state.cart.items)

  const [data, setData] = useState([]);
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

  const popular = async () => {
    try {

      const res = await fetch(`${API_URL}/food/get_popular`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      if (result.success) {
        setData(result.message);
      }

    } catch (err) {
      console.error('Lỗi khi lấy thông tin food:', err);
    }
  };
  useEffect(() => {
    popular()
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await popular();
    setRefreshing(false);
  };

  useEffect(() => {
    if (data_search.length === 0) {
      setDataSearch(data_search);
      setSearch(text_search);
    } else {
      setDataSearch(JSON.parse(data_search));
      setSearch(text_search);
    }
  }, [data_search]);

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

      setDataSearch(json.message)


    } catch (error) {
      console.error('Error completing:', error);
      Alert.alert('Đã xảy ra lỗi');
    }
  };


  if (!data.length) {
    return <LoadingScreen />;
  }

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
      {showHeader && (
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
              <Text style={{ color: '#ffffff', fontSize: 8 }}>{CartFood.length}</Text>
            </View>
          </View>
        </View>
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }} onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        <View style={styles.contenSearch}>
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

        {dataSearch.length === 0 && (
          <>
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
                <TopRateCard data={data}></TopRateCard>
              </View>

            </View>
          </>
        )}

        {dataSearch.length !== 0 && (
          <View style={styles.contentCategory}>

            <Text style={{ fontSize: 18, color: '#000000be' }}>Kết quả tìm kiếm cho : '{search}'</Text>


            <View style={{ marginTop: 22 }}>
              <FoodCard data={dataSearch}></FoodCard>
            </View>

          </View>
        )}


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
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10
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
    marginTop: 12
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