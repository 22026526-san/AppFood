import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TextInput, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useContext, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { API_URL } from '@env'
import DateTimePicker from '@react-native-community/datetimepicker';


const CategoryScreen = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const generateRandomCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCode(randomCode);
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
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
  };
  const handleSave = async () => {

    try {

      const res = await fetch(`${API_URL}/admin/insert_voucher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          description: description,
          maxDiscount: maxDiscount,
          discountPercent : discountPercent,
          startDate : startDate,
          endDate : endDate
        }),
      });
      const json = await res.json();
      console.log(json)
      if (json.success) {
        Alert.alert('Voucher đã được thêm thành công');
        return;
      }
      Alert.alert('Đã xảy ra lỗi trong quá trình thực thi');
    } catch (error) {
      console.error('Error completing error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <View>
          <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
        </View>
        <Text style={{ fontSize: 22, color: '#000000d5', fontWeight: 'bold' }}>New Voucher</Text>
      </View>


      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff', paddingRight: 20, paddingLeft: 20 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={{ marginBottom: 12, marginTop: 22 }}>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mã Voucher *</Text>
              <View style={styles.inputWithButtonContainer}>
                <TextInput
                  style={styles.inputFlex}
                  placeholder="Ví dụ: TET2025"
                  value={code}
                  onChangeText={setCode}
                />
                <TouchableOpacity style={styles.generateButton} onPress={generateRandomCode}>
                  <Text style={styles.generateButtonText}>Tạo mã</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Mô tả chi tiết về voucher..."
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Phần trăm giảm *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="%"
                  keyboardType="numeric"
                  value={discountPercent}
                  onChangeText={setDiscountPercent}
                />
              </View>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Giảm tối đa *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="VNĐ"
                  keyboardType="numeric"
                  value={maxDiscount}
                  onChangeText={setMaxDiscount}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ngày bắt đầu</Text>
              <View style={styles.dateInput}>
                <Text style={styles.dateText}>{startDate.toLocaleDateString('vi-VN')}</Text>
                <TouchableOpacity onPress={() => setShowStartDatePicker(!showStartDatePicker)}>
                  <Ionicons name='calendar-outline' size={18}/>
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

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ngày kết thúc</Text>
              <View style={styles.dateInput}>
                <Text style={styles.dateText}>{endDate.toLocaleDateString('vi-VN')}</Text>
                <TouchableOpacity onPress={() => setShowEndDatePicker(!showEndDatePicker)}>
                  <Ionicons name='calendar-outline' size={18}/>
                </TouchableOpacity>
              </View>
            </View>
            
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

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity activeOpacity={0.7} style={styles.buttonSubmit} onPress={handleSave}>
          <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>Save</Text>
        </TouchableOpacity>
      </View>

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
  buttonContainer: {
    minHeight: '12%',
    width: '100%',
    backgroundColor: '#ffffffff',
    display: 'flex',
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'flex-end'
  },
  buttonSubmit: {
    backgroundColor: '#ff6a00d9',
    borderRadius: 12,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderColor: '#ffffffff',
    borderWidth: 2,
    width: '100%',
    marginBottom: 10
  },
  input: {
    fontSize: 16,
    color: '#000000c2',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#96a8be2f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffffff',
    width: '100%'
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#495057',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputWithButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFlex: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#495057',
  },
  generateButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#007bff',
    borderWidth: 1,
    borderColor: '#007bff',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  flex1: {
    flex: 1,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#495057',
  },
  iconText: {
    fontSize: 20,
  },
  buttonn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default CategoryScreen