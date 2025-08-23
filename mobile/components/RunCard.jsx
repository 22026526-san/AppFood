import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import Logo from '../assets/orders.png'
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env'
import { useRouter } from 'expo-router';

const RunCard = (props) => {


  const dataStatus = [{ id: 1, name: 'pending' }, { id: 2, name: 'preparing' }, { id: 3, name: 'on delivery' }];
  const [status, setStatus] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState('');
  const router = useRouter();

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => setStatus(item.name)}
    >
      <View style={styles.radioCircle}>
        {status === item.name && <View style={styles.selectedRb} />}
      </View>
      <Text style={styles.count}>{item.name}</Text>
    </TouchableOpacity>
  );

  const TotalPrice = (products) => {
    return products.reduce((total, product) => {
      return total + (product.unit_price * product.quantity);
    }, 0);
  };

  const handleSubmit = async (status, selectedId) => {

    try {

      const res = await fetch(`${API_URL}/admin/update_status_orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: selectedId,
          status: status
        }),
      });
      const json = await res.json();

      if (json.success) {
        setModalVisible(false);
        Alert.alert('Cập nhật thành công');
        props.onUpdate()
        return;
      }

    } catch (error) {
      console.error('Error completing profile:', error);
      Alert.alert('Đã xảy ra lỗi');
    }
  };


  return (
    <>
      {props.data.map((item) => (
        <View key={item.order_id}>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => router.push({
              pathname: '/OrdersDetailScreen',
              params: { data: JSON.stringify(item), discount: TotalPrice(item.order_detail) - item.total_price }
            })}>
              <Image source={Logo} style={styles.image} />
            </TouchableOpacity>


            <View style={styles.content}>
              <Text style={styles.name}>Fast Food</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.category}>#{item.status}</Text>
                <TouchableOpacity onPress={() => { setStatus(item.status), setModalVisible(true), setSelectedId(item.order_id) }}>
                  <Ionicons name="caret-down" color={'#ff5e00b0'} size={14}></Ionicons>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
                <Text style={styles.id}>ID: {item.created_at.slice(11, 19).split(":").reverse()}</Text>
                <Text style={styles.id}>- {item.order_detail.length} items</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <Text style={styles.price}>{(item.total_price * 1).toLocaleString('VND')}</Text>

                <View style={styles.buttons}>
                  <TouchableOpacity style={styles.doneBtn} onPress={() => handleSubmit('completed', item.order_id)}>
                    <Text style={styles.doneText}>Done</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cancelBtn} onPress={() => handleSubmit('canceled', item.order_id)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          {modalVisible && (
            <View style={{ padding: 20 }}>

              <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalWrapper}>
                  <View style={styles.modalContainer}>
                    <FlatList
                      data={dataStatus}
                      keyExtractor={(item) => item.id}
                      renderItem={renderOption}
                    />

                    <View style={styles.buttonRow}>
                      <TouchableOpacity onPress={() => {
                        setModalVisible(false);
                      }} style={styles.clearButton}>
                        <Text style={{ color: '#f4511e' }}>Thoát</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => handleSubmit(status, selectedId)} style={styles.okButton}>
                        <Text style={{ color: 'white' }}>Chọn</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

            </View>
          )}
        </View>
      ))}

    </>

  )
};

export default RunCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 22,
    alignItems: 'center',
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  category: {
    color: '#ff8000ff',
    fontSize: 12,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  id: {
    fontSize: 12,
    color: '#999',
    marginVertical: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  doneBtn: {
    backgroundColor: '#FF7A00',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  doneText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#FF7A00',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  cancelText: {
    color: '#FF7A00',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#898989ff',
    marginVertical: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#f4511e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f4511e',
  },
  starRow: {
    flexDirection: 'row',
    marginRight: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#f4511e',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  okButton: {
    backgroundColor: '#f4511e',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
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
    width: '80%'
  },
});
