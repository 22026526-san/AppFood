import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image,Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Logo from '../assets/orders.png'
import { useDispatch } from 'react-redux';
import { re_orders } from '../redux/cartAction';

const HisCard = (props) => {

  const router = useRouter();
  const dispatch = useDispatch()
  const TotalPrice = (products) => {
    return products.reduce((total, product) => {
      return total + (product.unit_price * product.quantity);
    }, 0);
  };

  return (
    <>
      {props.data.map((item) => (
        <TouchableOpacity key={item.order_id} style={styles.container} onPress={() => {
          router.push({
            pathname: '/OrderDetailScreen',
            params: { data: JSON.stringify(item), discount: TotalPrice(item.order_detail) - item.total_price, action: 're_order' }
          })
        }}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>Food</Text>
            <Text style={{ fontSize: 18, color: item.status === 'completed' ? 'green' : 'red' }}>{item.status}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.card}>
            <Image
              source={Logo}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.info}>
              <View style={styles.rowBetween}>
                <Text style={styles.foodName}>Fast Food</Text>
                <Text style={styles.orderId}>#{item.created_at.slice(0, 10).split("-").reverse()}</Text>
              </View>

              <View style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <Text style={styles.price}>{(item.total_price * 1).toLocaleString('VND')}</Text>
                <Text style={styles.items}>|</Text>
                <Text style={styles.items}>{item.order_detail.length} Items</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => {
              if (item.status === 'canceled') {
                Alert.alert('Vui lòng mua hàng để thực hiện đánh giá.',);
                return;
              }

              router.push({
                pathname: '/RateScreen',
                params: { data: JSON.stringify(item) }
              });
            }}>
              <Text style={styles.cancelText}>Rate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.trackBtn} onPress={() => { { dispatch(re_orders(item.order_detail)), router.push('/CartScreen') } }}>
              <Text style={styles.trackText}>Re-order</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: 32
  },
  card: {
    backgroundColor: "#fff",
    display: 'flex',
    flexDirection: 'row'

  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 10,
    gap: 12,
    justifyContent: 'center'
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderId: {
    fontSize: 12,
    color: "#888",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 4,
  },
  items: {
    fontSize: 12,
    color: "#aaa",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
    width: '100%',
    justifyContent: 'space-between'
  },
  trackBtn: {
    backgroundColor: "#FF6B00",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center'
  },
  trackText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#FF6B00",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center'
  },
  cancelText: {
    color: "#FF6B00",
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
});

export default HisCard