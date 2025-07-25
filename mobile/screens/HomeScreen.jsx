import { View, Text ,StyleSheet,ScrollView,TouchableOpacity, TextInput} from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CategoriCard from '../components/CategoriCard';

const HomeScreen = () => {
  const {userId} = useAuth();
  const navigation = useNavigation();
  const count = 2;
  const [search,setSearch] = useState();

  const data = [
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
          <View style={{display:'flex',justifyContent:'center'}}>
            <Text style={{ fontSize: '32', color: '#000000b8' ,fontWeight:"bold"}}>
              Fast Food
            </Text>
          </View>
          <View style={styles.contenCart}>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.button}><Ionicons name="bag-outline" size={32} color="#ffffffd5" /></TouchableOpacity>
            <View style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: '#FF6B00',
                borderRadius: 20,
                padding: 6,
              }}>
              <Text style={{color:'#ffffff',fontSize:'12'}}>{count}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contenSearch}>
          <View>
            <Ionicons name="search" size={23} color="#2521213c"></Ionicons>
          </View>
          <TextInput  
              value={search}
              placeholder="Search dishes ..."
              onChangeText={(e) => setSearch(e)}
              style={styles.input}>
          </TextInput>
        </View>

        <View style={styles.contentCategory}>
          <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Text style={{fontSize:'18',color:'#000000a9'}}>All Categories</Text>
            <View style={{display:'flex',flexDirection:'row',gap:5,alignItems:'center'}}>
              <Text style={{fontSize:'18',color:'#000000a9'}}>See All</Text>
              <Ionicons name="chevron-forward" size={18} color='#000000a9'></Ionicons>
            </View>
          </View>
          
          <View style={{marginTop:22}}>
            <CategoriCard data={data}></CategoriCard>
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