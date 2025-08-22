import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView, Platform, Alert, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_URL } from "@env";
import { useRouter } from "expo-router";
const DashboardScreen = () => {
  const [stats, setStats] = useState(null);
  const [bestFoods, setBestFoods] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const router = useRouter();

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(lastDayOfMonth);

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
    setShowStartDatePicker(false);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    if (currentDate < startDate) {
      setEndDate(startDate);
      Alert.alert("Lỗi", "Ngày kết thúc không được trước ngày bắt đầu.");
    } else {
      setEndDate(currentDate);
    }
    setShowEndDatePicker(false);
  };

  const fetchData = async () => {
    try {

      const res = await fetch(`${API_URL}/admin/get_dash_board`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: startDate,
          end: endDate
        }),
      });
      const json = await res.json();

      if (json.success) {
        setStats(json.message.stats);
        setBestFoods(json.message.bestFoods);
        setRecentOrders(json.message.recentOrders);
        setDataOrder(json.message.stats.order);
        return;
      }
      Alert.alert('Đã xảy ra lỗi trong quá trình thực thi');
    } catch (error) {
      console.error('Error completing error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderCard = (icon, title, value, desc, color) => (
    <View style={styles.card}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      {desc && <Text style={styles.cardDesc}>{desc}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10, padding: 5 }}>

          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => { setShowStartDatePicker(!showStartDatePicker); setShowEndDatePicker(false); }}
            >
              <Ionicons name='calendar-outline' size={18} />
            </TouchableOpacity>


            <Text style={{ fontSize: 16 }}>
              {
                `${startDate.toLocaleDateString()}`
              }
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>
              {
                `${endDate.toLocaleDateString()}`
              }
            </Text>
            <TouchableOpacity
              onPress={() => { setShowEndDatePicker(!showEndDatePicker); setShowStartDatePicker(false); }}
            >
              <Ionicons name='calendar-outline' size={18} />
            </TouchableOpacity>
          </View>

        </View>

        {showStartDatePicker && (
          <DateTimePicker
            testID="startDatePicker"
            value={startDate}
            mode="date"
            is24Hour={true}
            display="inline"
            onChange={onStartDateChange}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            testID="endDatePicker"
            value={endDate}
            mode="date"
            is24Hour={true}
            display="inline"
            onChange={onEndDateChange}
            minimumDate={startDate}
          />
        )}


        <View style={styles.row}>
          <TouchableOpacity onPress={() => router.push('(adminScreens)/UsersScreen')} style={{ width: '50%' }}>
            {renderCard("people", "Người dùng hoạt động", stats?.activeUsers || 0, "Online", "#007bff")}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{ width: '50%' }}>
            {renderCard("checkbox-outline", "Tổng đơn hàng", stats?.totalOrders || 0, ``, "#28a745")}
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          {renderCard("cash-outline", "Tổng doanh thu", `${(stats?.revenue * 1).toLocaleString('VND')}`, ``, "#f39c12")}
          {renderCard("cart-outline", "Đơn hàng trung bình", `${(stats?.avgOrder * 1).toLocaleString('VND')}`, "Giá trị TB mỗi đơn", "#9b59b6")}
        </View>

        <Text style={styles.sectionTitle}>Món ăn bán chạy nhất</Text>
        <FlatList
          data={bestFoods}
          scrollEnabled={false}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem} key={item.food_id}>
              <TouchableOpacity onPress={() => router.push({ params: { foodId: item.food_id }, pathname: '(adminScreens)/FoodDetailScreen' })}>
                <Text style={styles.foodName}>{item.food_name}</Text>
              </TouchableOpacity>
              <Text style={styles.foodQty}>{item.sold}</Text>
            </View>
          )}
        />


        <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
        <FlatList
          data={recentOrders}
          scrollEnabled={false}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem} key={item.order_id}>
              <Text style={styles.orderUser}>{item.user_name}</Text>
              <Text style={styles.orderPrice}>{(item.total_price * 1).toLocaleString('VND')}</Text>
              <Text
                style={[
                  styles.orderStatus,
                  item.status === "completed"
                    ? styles.success
                    : item.status === "canceled"
                      ? styles.cancel
                      : styles.pending,
                ]}
              >
                {item.status}
              </Text>
            </View>
          )}
        />
      </ScrollView>
      {modalVisible && (
        <View style={{ padding: 20 }}>

          <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalWrapper}>
              <View style={styles.modalContainer}>
                <ScrollView style={{ width: '88%' }}>
                  {dataOrder.length !== 0 ? dataOrder.map((item) => (

                    <View style={styles.orderItem} key={item.order_id}>
                      <Text style={styles.orderUser}>{item.user_name}</Text>
                      <Text style={styles.orderPrice}>{(item.total_price * 1).toLocaleString('VND')}</Text>
                      <Text
                        style={[
                          styles.orderStatus,
                          item.status === "completed"
                            ? styles.success
                            : item.status === "canceled"
                              ? styles.cancel
                              : styles.pending,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  )) : <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có đơn hàng nào trong khoảng thời gian này.</Text>}
                </ScrollView>
                <TouchableOpacity onPress={() => {
                  setModalVisible(false);
                }} style={styles.clearButton}>
                  <Text style={{ fontSize: 13, color: '#f4511e' }}>Hủy</Text>
                </TouchableOpacity>

              </View>
            </View>
          </Modal>

        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 15 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 12,
    padding: 15,
    elevation: 3,
  },
  cardTitle: { fontSize: 14, color: "#555", marginTop: 5 },
  cardValue: { fontSize: 20, fontWeight: "bold", marginVertical: 5 },
  cardDesc: { fontSize: 12, color: "#888" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 15 },
  chart: { borderRadius: 12 },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  foodName: { fontSize: 14 },
  foodQty: { fontSize: 14, fontWeight: "bold" },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  orderUser: { fontSize: 14, flex: 1 },
  orderPrice: {
    fontSize: 14,
    fontWeight: "bold"
  },
  orderStatus: {
    fontSize: 12,
    marginLeft: 10
  },
  success: { color: "green" },
  pending: { color: "orange" },
  cancel: { color: "red" },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    width: '88%',
    maxHeight: '80%',
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#f4511e',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
});

export default DashboardScreen;
