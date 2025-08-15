import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useContext, useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { API_URL } from '@env'
import VoucherCard from '../../components/VoucherCard';
import { useAuth } from '@clerk/clerk-expo';

const VoucherScreen = () => {

  const router = useRouter();
  const [data, setData] = useState([]);
  const { userId } = useAuth();
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

  const setVouchers = async () => {
    try {

      const res = await fetch(`${API_URL}/user/get_vouchers`, {
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
      console.error('Lỗi khi cập nhật vouchers:', err);
    }
  };

  useEffect(() => {
    setVouchers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await setVouchers();
    setRefreshing(false);
  };


  if (data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>

            <Text style={{ fontSize: 22, color: '#000000d2', fontWeight: 'bold' }}>Vouchers</Text>

          </View>

          <View>
            <TouchableOpacity style={styles.buttonSearch} onPress={() => router.push({
              pathname: '/SearchScreen',
              params: { data_search: [], text_search: '' }
            })}><Ionicons name="search" size={20} color="#ffffffd5" /></TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>

          <View style={{ marginTop: 286, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#ff5e00b0' }} >There are no vouchers in your collection.</Text>
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

            <Text style={{ fontSize: 22, color: '#000000d2', fontWeight: 'bold' }}>Vouchers</Text>

          </View>

          <View>
            <TouchableOpacity style={styles.buttonSearch} onPress={() => router.push({
              pathname: '/SearchScreen',
              params: { data_search: [], text_search: '' }
            })}><Ionicons name="search" size={20} color="#ffffffd5" /></TouchableOpacity>
          </View>
        </View>
      )}
      <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }} onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        <View style={{ marginTop: 22 }}>
          <VoucherCard data={data}></VoucherCard>
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

export default VoucherScreen