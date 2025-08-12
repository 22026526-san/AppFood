import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native'
import React, { useEffect, useContext, useRef, useState } from 'react'
import { useRouter } from 'expo-router';
import { API_URL } from '@env'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FoodListCard from '../../components/FoodListCard';

const FoodListScreen = () => {
  const [data, setData] = useState([]);
  const [dataFill, setDataFill] = useState([]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [cate_selected, setCate_seleced] = useState(0);
  const [sort_selected, setSort_seleced] = useState('food_rate');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await foodList();
    setCate_seleced(0);
    setRefreshing(false);
  };

  function sortFoods(foods, sortBy) {
    return foods.sort((a, b) => {
      if (sortBy === 'food_rate') {
        return b.food_rate - a.food_rate;
      }
      if (sortBy === 'created_at') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });
  }

  const fillCate = (sortBy) => {
    if (sortBy === 0) {
      setDataFill(sortFoods(data, sort_selected))
    }
    else {
      const _data_ = data.filter(i => i.category_id === sortBy)
      setDataFill(sortFoods(_data_, sort_selected))
    }
  }

  const category = [
    { id: 0, name: 'All' },
    { id: 1, name: 'Burger' },
    { id: 2, name: 'Fried Chicken' },
    { id: 3, name: 'Pizza' },
    { id: 4, name: 'Noodles & Pasta' },
    { id: 5, name: 'Rice Meals' },
    { id: 6, name: 'Drinks' }
  ];

  const foodList = async () => {
    try {

      const res = await fetch(`${API_URL}/admin/get_food_list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      
      if (result.success) {
        setData(result.message);
        setDataFill(result.message);
      }

    } catch (err) {
      console.error('Lỗi khi lấy thông tin food list:', err);
    }
  };
  useEffect(() => {
    foodList()
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <View>
            <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
          </View>
          <Text style={{ fontSize: 22, color: '#000000d5', fontWeight: 'bold' }}>My Food List</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }} onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        <View>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 5 }}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {category.map((item) => (
              <View key={item.id} style={item.id === cate_selected ? styles.cardSelected : styles.card}>
                <TouchableOpacity onPress={() => { setCate_seleced(item.id); fillCate(item.id) }}>
                  <Text style={{ fontSize: 15 }}>{item.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View style={styles.separator} />
        </View>

        <View style={{ marginTop: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, color: '#0000005b' }}>Total {dataFill.length} items</Text>
          <Ionicons name="reorder-two-sharp" size={22} color={'#0000005b'} onPress={()=>setShowSortMenu(!showSortMenu)}></Ionicons>
        </View>

        {showSortMenu && (
          <View style={styles.sortMenu}>
            <TouchableOpacity style={styles.option} onPress={() => {setSort_seleced('food_rate');setDataFill(sortFoods([...dataFill],'food_rate'))}}>
              <Text style={styles.sortOption}>Theo đánh giá</Text>
              <Ionicons name="checkmark-sharp" color={sort_selected === 'food_rate' ? 'orange':'#ffffff'} size={16}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => {setSort_seleced('created_at');setDataFill(sortFoods([...dataFill],'created_at'))}}>
              <Text style={styles.sortOption}>Mới nhất</Text>
              <Ionicons name="checkmark-sharp" color={sort_selected === 'created_at' ? 'orange':'#ffffff'} size={16}/>
            </TouchableOpacity>
          </View>
        )}

       
        <FoodListCard data={dataFill}/>
        
        <View style={{marginBottom:36}} />
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
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  card: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d8d8d8ff',
    marginRight: 8
  },
  cardSelected: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ff7300ff',
    marginRight: 8
  },
  separator: {
    height: 1,
    backgroundColor: '#d8d8d8ff',
    marginLeft: -20,
    marginRight: -20,
    marginTop: -5
  },
  sortMenu: {
    position: 'absolute',
    right: 22,
    top: 80, 
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8, 
    shadowOpacity: 0.2,
    shadowRadius: 4,
    gap:8,
    zIndex: 999
  },
  sortOption: {
    fontSize: 14,
    color: '#333',
  },
  option:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    gap:5
  }
});

export default FoodListScreen