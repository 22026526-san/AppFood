import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useContext, useRef, useState } from 'react'
import { useUser } from '@clerk/clerk-react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useClerk } from '@clerk/clerk-expo'
import { useAuth } from '@clerk/clerk-expo';
import { UserContext } from '../../services/UserContextAPI';
import { API_URL } from '@env'
import HisCard from '../../components/HisCard';
import OnCard from '../../components/OnCard';

const OrderScreen = () => {

  const { userId } = useAuth();
  const router = useRouter();
  const [dataHis, setDataHis] = useState([])
  const [dataOnGo, setDataOnGO] = useState([])
  const [data, setData] = useState(dataOnGo);
  const [showHeader, setShowHeader] = useState(true);
  const [isOngoing, setIsOngoing] = useState(true);
  const [isHistory, setIsHistory] = useState(false);
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

  const orders = async () => {
    try {

      const res = await fetch(`${API_URL}/user/get_orders`, {
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
        setDataHis(result.message.filter(order =>
          order.status === 'completed' || order.status === 'canceled'
        ));

        setDataOnGO(result.message.filter(order =>
          order.status !== 'completed' && order.status !== 'canceled'
        ));
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin orders:', err);
    }
  };

  useEffect(() => {
    orders();
  }, []);

  useEffect(() => {
    setData(dataOnGo);
  }, [dataOnGo])

  if (data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {showHeader && (
          <View style={styles.header}>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>

              <Text style={{ fontSize: 22, color: '#000000d2', fontWeight: 'bold' }}>Orders</Text>

            </View>

            <View>
              <TouchableOpacity style={styles.buttonSearch} onPress={() => router.push({
                pathname: '/SearchScreen',
                params: { data_search: [], text_search: '' }
              })} ><Ionicons name="search" size={20} color="#ffffffd5" /></TouchableOpacity>
            </View>
          </View>
        )}
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', marginTop: 12, marginBottom: 10 }}>
          <TouchableOpacity style={{ width: '50%', borderBottomColor: isOngoing ? 'orange' : '#ccccccff', padding: 12, alignItems: 'center', borderBottomWidth: 1 }} onPress={() => { setIsHistory(!isHistory), setIsOngoing(!isOngoing), setData(dataOnGo) }}>
            <Text style={{ color: isOngoing ? 'orange' : '#ccccccff', fontSize: 16 }}>Ongoing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '50%', borderBottomColor: isHistory ? 'orange' : '#ccccccff', padding: 12, alignItems: 'center', borderBottomWidth: 1 }} onPress={() => { setIsHistory(!isHistory), setIsOngoing(!isOngoing), setData(dataHis) }}>
            <Text style={{ color: isHistory ? 'orange' : '#ccccccff', fontSize: 16 }}>History</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}>

          <View style={{ marginTop: 286, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#ff5e00b0' }} >Bạn chưa có đơn hàng.</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>

            <Text style={{ fontSize: 22, color: '#000000d2', fontWeight: 'bold' }}>Orders</Text>

          </View>

          <View>
            <TouchableOpacity style={styles.buttonSearch} onPress={() => router.push({
              pathname: '/SearchScreen',
              params: { data_search: [], text_search: '' }
            })} ><Ionicons name="search" size={20} color="#ffffffd5" /></TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', marginTop: 12, marginBottom: 10 }}>
        <TouchableOpacity style={{ width: '50%', borderBottomColor: isOngoing ? 'orange' : '#ccccccff', padding: 12, alignItems: 'center', borderBottomWidth: 1 }} onPress={() => { setIsHistory(!isHistory), setIsOngoing(!isOngoing), setData(dataOnGo) }}>
          <Text style={{ color: isOngoing ? 'orange' : '#ccccccff', fontSize: 16 }}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '50%', borderBottomColor: isHistory ? 'orange' : '#ccccccff', padding: 12, alignItems: 'center', borderBottomWidth: 1 }} onPress={() => { setIsHistory(!isHistory), setIsOngoing(!isOngoing), setData(dataHis) }}>
          <Text style={{ color: isHistory ? 'orange' : '#ccccccff', fontSize: 16 }}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }} onScroll={handleScroll}>

        {isHistory && (
          <View>
            <HisCard data={data} />
          </View>
        )}

        {isOngoing && (
          <View>
            <OnCard data={data} onUpdate={orders} />
          </View>
        )}


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
})

export default OrderScreen