import { View, Text ,StyleSheet,ScrollView,TouchableOpacity, TextInput} from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CategoriCard from '../../components/CategoriCard';
import Logo from '../../assets/fast-food.png'
import burger from '../../assets/burger.png'
import Noodles from '../../assets/Noodles.png'
import Pizza from '../../assets/pizza.png'
import rice from '../../assets/rice.png'
import fried_chicken from '../../assets/fried_chicken.png'
import Drinks from '../../assets/drink.jpg'
import FoodCard from '../../components/FoodCard';
import TopRateCard from '../../components/TopRateCard';

const HomeScreen = () => {
  const {userId} = useAuth();
  const router = useRouter();
  const count = 2;
  const [search,setSearch] = useState();

  const data = [
  { id: 1, name: 'Burger',img :burger },
  { id: 2, name: 'Fried Chicken',img : fried_chicken},
  { id: 3, name: 'Pizza', img: Pizza },
  { id: 4, name: 'Noodles',img: Noodles },
  { id: 5, name: 'Rice Meals',img: rice },
  { id: 6, name: 'Drinks',img: Drinks }
];

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
    img_url:Logo,
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


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }}>

        <View style={styles.header}>
          <View style={{display:'flex',justifyContent:'center'}}>
            <Text style={{ fontSize: 32, color: '#000000b8' ,fontWeight:"bold"}}>
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
              <Text style={{color:'#ffffff',fontSize:8}}>{count}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.contenSearch} onPress={()=>router.push('/SearchScreen')}>
          <TouchableOpacity>
            <Ionicons name="search" size={23} color="#2521213c"></Ionicons>
          </TouchableOpacity>
          <TextInput  
              value={search}
              placeholder="Search dishes ..."
              onChangeText={(e) => setSearch(e)}
              style={styles.input}>
          </TextInput>
        </TouchableOpacity>

        <View style={styles.contentCategory}>
          <View>
            <Text style={{fontSize:18,color:'#000000be'}}>Categories</Text>
          </View>
          
          <View style={{marginTop:22}}>
            <CategoriCard data={data}></CategoriCard>
          </View>

        </View>

        <View style={styles.contentCategory}>
          <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Text style={{fontSize:18,color:'#000000be'}}>Top Rate</Text>
            <TouchableOpacity onPress={()=> router.push('/TopRateScreen')} style={{display:'flex',flexDirection:'row',gap:5,alignItems:'center'}} >
              <Text style={{fontSize:18,color:'#000000be'}}>See All</Text>
              <Ionicons name="chevron-forward" size={18} color='#000000be'></Ionicons>
            </TouchableOpacity>
          </View>
          
          <View style={{marginTop:22}}>
            <TopRateCard data={fakeData}></TopRateCard>
          </View>

        </View>

        <View style={styles.contentCategory}>

          <Text style={{fontSize:18,color:'#000000be'}}>All Fast Food</Text>
        
          <View style={{marginTop:22}}>
            <FoodCard data={fakeData}></FoodCard>
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
        backgroundColor:"#FFFFFf",
        marginBottom: -36
    },
    button: {
    backgroundColor: '#000000cb',
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header :{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  contenCart: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    fontSize: 16,
    color: '#000000c2',
  },
  contenSearch:{
    display:'flex',
    flexDirection:'row',
    gap:8,
    alignItems:'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#96a8be11',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
    marginTop:22
  },
  contentCategory:{
    display:'flex',
    flexDirection:'column',
    marginTop:22
  }
}); 