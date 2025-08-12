import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert,ActivityIndicator } from 'react-native'
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from '@clerk/clerk-react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { API_URL } from '@env'
import { UserContext } from '../../services/UserContextAPI';
import * as ImagePicker from 'expo-image-picker';


const EditProfileScreen = () => {
  const { user } = useUser()
  const router = useRouter();
  const [formError, setFormError] = useState({})
  const { userId } = useAuth();
  const { phone, name, imgUser, setImgUser, setName, setPhone } = useContext(UserContext)
  const [isChange, setChange] = useState(false)
  const [isLoading, setIsLoading] = useState(false);



  const [data, setData] = React.useState({
    phone: phone,
    username: name,
    email: user.primaryEmailAddress?.emailAddress
  });

  const handleChangeData = (field, value) => {
    setChange(true);
    setData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

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

      formData.append("Id", userId);

      try {

        setIsLoading(true);

        const response = await fetch(`${API_URL}/user/img_update`, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        const data = await response.json();
      
        if (data.success) {
          setImgUser(data.img)
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

  const handleSubmit = async () => {

    const isValid = validateData();
    if (!isValid) {
      return;
    }
    try {

      const res = await fetch(`${API_URL}/user/update_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.username,
          phone: data.phone,
          email: data.email,
          clerk_id: userId
        }),
      });
      const json = await res.json();
      console.log('Response from server:', json);
      if (!json.success) {
        Alert.alert(json.message);
        return;
      }

      Alert.alert(json.message);
      setName(data.username)
      setPhone(data.phone)
      setChange(false)
    } catch (error) {
      console.error('Error completing profile:', error);
      Alert.alert('Đã xảy ra lỗi khi cập nhật hồ sơ');
    }
  };

  // Hàm xử lý data
  const validateData = () => {
    const error = {};

    // Kiểm tra độ dài số điện thoại
    if (!data.phone || data.phone.length !== 10) {
      error.phone = 'Số điện thoại phải có 10 ký tự';
    }

    setFormError(error)

    return Object.keys(error).length === 0;
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }}>

        <View style={styles.header}>
          <View>
            <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
          </View>
          <Text style={{ fontSize: 22, color: '#000000d5' ,fontWeight:'bold'}}>Edit Profile</Text>
        </View>

        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <View style={styles.contentIMG}>
            <Image style={styles.ImgUser} source={{ uri: imgUser ? imgUser : user.imageUrl, resizeMode: 'cover' }} ></Image>
            <TouchableOpacity
              onPress={pickAndUploadImage}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#FF6B00',
                borderRadius: 20,
                padding: 6,
              }}
            >
              <Ionicons name="camera-outline" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={{ color: '#000000c2', fontSize: 16, marginBottom: 8, marginLeft: 2 }}>FULL NAME</Text>
          <TextInput
            autoCapitalize="none"
            value={data.username}
            placeholder="Enter user name"
            onChangeText={(text) => handleChangeData('username', text)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer} >
          <Text style={{ color: '#000000c2', fontSize: 16, marginBottom: 8, marginLeft: 2 }}>PHONE</Text>
          <TextInput
            autoCapitalize="none"
            value={data.phone}
            placeholder="Enter phone number"
            onChangeText={(text) => handleChangeData('phone', text)}
            style={styles.input}
          />
          {formError.phone && (
            <Text style={{ color: 'red', marginLeft: 2, marginTop: 2 }}>{formError.phone}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={{ color: '#000000c2', fontSize: 16, marginBottom: 8, marginLeft: 2 }}>EMAIL</Text>
          <TextInput
            editable={false}
            autoCapitalize="none"
            value={data.email}
            placeholder="Example@gmail.com"
            onChangeText={(text) => handleChangeData('email', text)}
            style={styles.input}
          />
        </View>

        <View style={{ padding: 10, position: "relative" }}>
          <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmit} disabled={!isChange}>
            <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>SAVE</Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={{ position: 'absolute', top: '15%', left: '59%', transform: [{ translateX: -25 }, { translateY: -25 }] }}>
            <ActivityIndicator size="large" color="#1f1f20ff" />
          </View>
        )}

      </ScrollView>
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
    gap: 10
  },
  button: {
    backgroundColor: '#96a8be11',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ImgUser: {
    borderRadius: 50,
    width: 100,
    height: 100
  },
  contentUser: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    marginTop: 20
  },
  contentNav: {
    backgroundColor: '#96a8be11',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
    marginTop: 20
  },
  icon: {
    backgroundColor: '#ffffffff',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentIMG: {
    width: 100,
    height: 100,
    display: 'flex',
    flexDirection: 'column'
  },
  buttonSubmit: {
    backgroundColor: '#ff6a00d9',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderColor: '#ffffffff',
    borderWidth: 2,
    width: '100%'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    position: "relative"
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
  },
})

export default EditProfileScreen