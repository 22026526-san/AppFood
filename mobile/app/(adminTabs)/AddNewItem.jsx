import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { API_URL } from '@env'
import * as ImagePicker from 'expo-image-picker';

const EditFoodScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('')
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [data_cate, setDataCategory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getCategory = async () => {
    try {

      const res = await fetch(`${API_URL}/food/get_category`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();

      if (result.success) {
        setDataCategory(result.message);
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin food list:', err);
    }
  };
  useEffect(() => {
    getCategory()
  }, []);

  const updateCategoryById = (data, id) => {
    const found = data.find(item => item.category_id === id);
    if (found) {
      setCategory(found.category_name);
    } else {
      setCategory('');
    }
  };

  const renderStarOption = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => setCategoryId(item.category_id)}
    >
      <View style={styles.radioCircle}>
        {categoryId === item.category_id && <View style={styles.selectedRb} />}
      </View>
      <Text style={styles.count}>{item.category_name}</Text>
    </TouchableOpacity>
  );

  const pickAndUploadImage = async () => {

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {

      const imageAsset = result.assets[0];
      const fileName = imageAsset.uri.split('/').pop();
      const fileType = imageAsset.type || 'image/jpeg';

      const formData = new FormData();
      formData.append("image", {
        uri: imageAsset.uri,
        name: fileName,
        type: fileType
      });

      try {

        setIsLoading(true);

        const response = await fetch(`${API_URL}/admin/foodImg_update`, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setImg(data.img)
          Alert.alert(data.message);
          return;
        }
        Alert.alert(data.message);
      } catch (err) {
        console.error("Upload lỗi:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAdd = async () => {

    try {

      const res = await fetch(`${API_URL}/admin/insert_food`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          categoryId: categoryId,
          price: price,
          img: img
        }),
      });
      const json = await res.json();
      console.log(json)
      if (json.success) {
        Alert.alert('Món ăn đã được thêm thành công');
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
        <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>
          <View>
            <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
          </View>
          <Text style={{ fontSize: 22, color: '#000000d5', fontWeight: 'bold' }}>Add Food</Text>
        </View>
        <TouchableOpacity onPress={handleAdd}>
          <Text style={{ fontSize: 20, color: '#ff6a00b9', textDecorationLine: 'underline' }}>Add</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff', paddingRight: 20, paddingLeft: 20 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <View style={{ width: '100%', flexDirection: 'column', gap: 16 }}>
            <Text style={styles.label}>Tên Món Ăn *</Text>
            <TextInput
              style={styles.input}
              placeholder="Bacon Burger,Hawaiian Pizza..."
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column', width: '48%', gap: 16 }}>
              <Text style={styles.label}>Loại Món Ăn *</Text>
              <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, styles.input]}>
                <Text style={{ fontSize: 16, color: '#495057' }}>{category}</Text>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-vertical-outline" color={'#9b9b9bff'} size={16} onPress={() => setModalVisible(true)} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'column', width: '48%', gap: 16 }}>
              <Text style={styles.label}>Giá Bán *</Text>
              <TextInput
                style={styles.input}
                placeholder="VND"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mô tả đầy đủ về món ăn, bao gồm các thành phần, hương vị......"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 22, alignItems: 'center' }}>

            <View style={{ flexDirection: 'column', gap: 16 }}>
              <Text style={styles.label}>Hình Ảnh Món Ăn</Text>
              <View style={styles.imagePickerContainer}>
                {img ? (
                  <Image source={{ uri: img }} style={styles.imagePreview} />
                ) : (
                  <View style={styles.imagePreviewPlaceholder}>
                    <Ionicons name="image" size={40} color="#ccc" />
                    <Text style={styles.imagePreviewText}>Xem trước</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{ flexDirection: 'column', gap: 8, width: '40%' }}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <Text style={styles.imagePickerButtonText}>Tải ảnh lên</Text>
                <TouchableOpacity onPress={pickAndUploadImage}>
                  <Ionicons name='camera-outline' size={16} color="#fe7f00ff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.imageHint}>Tối đa 5MB, định dạng JPG, PNG</Text>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {modalVisible && (
        <View style={{ padding: 20 }}>

          <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalWrapper}>
              <View style={styles.modalContainer}>
                <FlatList
                  data={data_cate}
                  keyExtractor={(item) => item.category_id}
                  renderItem={renderStarOption}
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={() => {
                    setCategoryId('');
                    setModalVisible(false);
                    updateCategoryById(data_cate, 0)
                  }} style={styles.clearButton}>
                    <Text style={{ color: '#f4511e' }}>Hủy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => { setModalVisible(false), updateCategoryById(data_cate, categoryId) }} style={styles.okButton}>
                    <Text style={{ color: 'white' }}>Chọn</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

        </View>
      )}

      {isLoading && (
        <View style={{ position: 'absolute', top: '50%', left: '52%', transform: [{ translateX: -25 }, { translateY: -25 }] }}>
          <ActivityIndicator size="large" color="#1f1f20ff" />
        </View>
      )}
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
    justifyContent:'space-between',
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#495057',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#495057',
    marginTop: 22,
    fontWeight: '500',
  },

  imagePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  imagePickerButtonText: {
    color: '#6c757d',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  imagePreviewPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  imagePreviewText: {
    color: '#adb5bd'
  },
  imageHint: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 20,
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
});

export default EditFoodScreen