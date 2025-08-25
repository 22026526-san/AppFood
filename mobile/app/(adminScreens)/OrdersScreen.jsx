import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, Platform } from 'react-native'
import React, { useEffect, useContext, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { API_URL } from '@env'
import RunCard from '../../components/RunCard';
import UnRunCard from '../../components/UnRunCard';
import DateTimePicker from '@react-native-community/datetimepicker';

const OrderScreen = () => {

  const { userId } = useAuth();
  const router = useRouter();
  const [dataRun, setDataRun] = useState([])
  const [dataCom, setDataCom] = useState([])
  const [dataCan, setDataCan] = useState([])
  const [data, setData] = useState([]);
  const [showHeader, setShowHeader] = useState(true);
  const [isRunning, setIsRunning] = useState(true);
  const [isCompeleted, setIsCompeleted] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const lastScrollY = useRef(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [text, setText] = useState('All');
  const [date, setDate] = useState(new Date());
  const [dateChange, setDateChange] = useState('');
  const [dataAll, setDataAll] = useState([])


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

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    setText(currentDate.toLocaleDateString());
    const formattedDate = currentDate.toISOString().split('T')[0];
    setDateChange(formattedDate);
    setShowDatePicker(false);
  };

  const orders = async () => {
    try {

      const res = await fetch(`${API_URL}/admin/get_orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      if (result.success) {
        setDataAll(result.message);
        setDataRun(result.message.filter(order =>
          order.status !== 'completed' && order.status !== 'canceled'
        ));

        setDataCom(result.message.filter(order =>
          order.status === 'completed'));

        setDataCan(result.message.filter(order =>
          order.status === 'canceled'));
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin orders:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await orders();
    setText('All');
    setRefreshing(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toISOString().split('T')[0];
  };

  useEffect(() => {
    orders();
  }, []);

  useEffect(() => {

    setDataRun(dataAll.filter(order =>
      formatDate(order.created_at) === dateChange && order.status !== 'completed' && order.status !== 'canceled'
    ));

    setDataCom(dataAll.filter(order =>
      formatDate(order.created_at) === dateChange && order.status === 'completed'));

    setDataCan(dataAll.filter(order =>
      formatDate(order.created_at) === dateChange && order.status === 'canceled'));
  }, [dateChange]);

  useEffect(() => {
    if (isRunning && dataRun) {
      setData(dataRun);
    }
  }, [dataRun, isRunning])

  useEffect(() => {
    if (isCanceled && dataCan) {
      setData(dataCan);
    }
  }, [dataCan, isCanceled])

  useEffect(() => {
    if (isCompeleted && dataCom) {
      setData(dataCom);
    }
  }, [dataCom, isCompeleted])

  if (data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {showHeader && (
          <View style={styles.header}>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>

              <Text style={{ fontSize: 22, color: '#000000d2', fontWeight: 'bold' }}>Orders</Text>

            </View>
          </View>
        )}
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', marginTop: 12, marginBottom: 10 }}>
          <TouchableOpacity style={{ width: '33.3%', borderBottomColor: isRunning ? 'orange' : '#ccccccff', padding: 12, alignItems: 'center', borderBottomWidth: 1 }} onPress={() => { setIsRunning(true), setIsCanceled(false), setIsCompeleted(false), setData(dataRun) }}>
            <Text style={{ color: isRunning ? 'orange' : '#ccccccff', fontSize: 16 }}>Running</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '33.3%', borderBottomColor: isCompeleted ? 'orange' : '#ccccccff', padding: 12, alignItems: 'center', borderBottomWidth: 1 }} onPress={() => { setIsRunning(false), setIsCanceled(false), setIsCompeleted(true), setData(dataCom) }}>
            <Text style={{ color: isCompeleted ? 'orange' : '#ccccccff', fontSize: 16 }}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '33.3%', borderBottomColor: isCanceled ? 'orange' : '#ccccccff', padding: 12, alignItems: 'center', borderBottomWidth: 1 }} onPress={() => { setIsRunning(false), setIsCanceled(true), setIsCompeleted(false), setData(dataCan) }}>
            <Text style={{ color: isCanceled ? 'orange' : '#ccccccff', fontSize: 16 }}>Canceled</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20 }}>
          <TouchableOpacity
            onPress={() => { setShowDatePicker(!showDatePicker) }}
          >
            <Ionicons name='calendar-outline' size={18} />
          </TouchableOpacity>


          <Text style={{ fontSize: 16 }}>
            {text}
          </Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>

          {showDatePicker && (
          <DateTimePicker
            testID="DatePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="inline"
            onChange={onDateChange}
          />
        )}

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
        </View>
      )}

      <View style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', marginTop: 12, marginBottom: 10 }}>
        <TouchableOpacity style={{ width: '33.3%', borderBottomColor: isRunning ? 'orange' : '#ccccccff', padding: 12, alignItems: 'center', borderBottomWidth: 1 }} onPress={() => { setIsRunning(true), setIsCanceled(false), setIsCompeleted(false), setData(dataRun) }}>
          <Text style={{ color: isRunning ? 'orange' : '#ccccccff', fontSize: 16 }}>Running</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '33.3%', borderBottomColor: isCompeleted ? 'orange' : '#ccccccff', padding: 12, alignItems: 'center', borderBottomWidth: 1 }} onPress={() => { setIsRunning(false), setIsCanceled(false), setIsCompeleted(true), setData(dataCom) }}>
          <Text style={{ color: isCompeleted ? 'orange' : '#ccccccff', fontSize: 16 }}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '33.3%', borderBottomColor: isCanceled ? 'orange' : '#ccccccff', padding: 12, alignItems: 'center', borderBottomWidth: 1 }} onPress={() => { setIsRunning(false), setIsCanceled(true), setIsCompeleted(false), setData(dataCan) }}>
          <Text style={{ color: isCanceled ? 'orange' : '#ccccccff', fontSize: 16 }}>Canceled</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingRight: 20 }}>
        <TouchableOpacity
          onPress={() => { setShowDatePicker(!showDatePicker) }}
        >
          <Ionicons name='calendar-outline' size={18} />
        </TouchableOpacity>


        <Text style={{ fontSize: 16 }}>
          {text}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }} onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        {showDatePicker && (
          <DateTimePicker
            testID="DatePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="inline"
            onChange={onDateChange}
          />
        )}

        {isCanceled && (
          <View>
            <UnRunCard data={data} />
          </View>
        )}

        {isCompeleted && (
          <View>
            <UnRunCard data={data} />
          </View>
        )}

        {isRunning && (
          <View>
            <RunCard data={data} onUpdate={orders} />
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