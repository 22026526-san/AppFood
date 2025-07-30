import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect,useContext } from 'react'
import { useUser } from '@clerk/clerk-react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useClerk } from '@clerk/clerk-expo'
import { useAuth } from '@clerk/clerk-expo';
import { UserContext } from '../../services/UserContextAPI';
import {API_URL} from '@env'

const ProfileScreen = () => {
  const { user } = useUser()
  const router = useRouter();
  const { signOut } = useClerk();
  const { userId } = useAuth();
  const { setName,setPhone, setUser,name,phone, imgUser,setImgUser } = useContext(UserContext)

  const handleSignOut = async () => {
    try {
      await signOut()
      // router.replace('/(auth)/Login')
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  useEffect(() => {
    const userInfo = async () => {
      try {

        const res = await fetch(`${API_URL}/user/user_info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkId: userId,
          }),
        });

        const result = await res.json();
        
        setPhone(result.user.phone)
        setUser(result.user.user_id)
        setName(result.user.user_name)
        setImgUser(result.user.img)
        
      } catch (err) {
        console.error('Lỗi khi lấy thông tin user:', err);
      }
    };
    if (userId) {
      userInfo();
    }
  }, [ userId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingLeft: 20, paddingRight: 20 }}>
        <View style={styles.header}>
          <View>
            <TouchableOpacity onPress={() => router.back()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
          </View>
          <Text style={{ fontSize: 22, color: '#000000d5',fontWeight:'bold' }}>Profile</Text>
        </View>


        <View style={styles.contentUser}>
          <View>
            <Image style={styles.ImgUser} source={{ uri: imgUser ? imgUser : user.imageUrl, resizeMode: 'cover' }} ></Image>
          </View>
          <View style={{ display: 'flex', flexDirection: 'column', gap: 5, justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, color: '#000000d5', fontWeight: 'bold' }}>
              {name}
            </Text>
            <Text style={{ fontSize: 12, color: '#00000053' }}>{phone}</Text>
          </View>
        </View>

        <View style={styles.contentNav}>
          <TouchableOpacity onPress={() => router.push('/EditProfileScreen')} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="person-outline" style={[{ color: '#eb4d0fe9' }, styles.icon]} size={20}></Ionicons>
              <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.54)' }}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </TouchableOpacity>
        </View>

        <View style={styles.contentNav}>
          <TouchableOpacity onPress={()=>router.push('/CartScreen')} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="cart-outline" style={[{ color: '#0fceebbb' }, styles.icon]} size={20}></Ionicons>
              <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.54)' }}>Cart</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>router.push('/FavouriteScreen')} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '16' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="heart-outline" style={[{ color: '#eb0fc65f' }, styles.icon]} size={20}></Ionicons>
              <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.54)' }}>Favourite</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>router.push('/NoticeScreen')} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '16' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="notifications-outline" style={[{ color: '#ebca0f98' }, styles.icon]} size={20}></Ionicons>
              <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.54)' }}>Notification</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '16' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="ticket-outline" style={[{ color: '#1aeb0f79' }, styles.icon]} size={20}></Ionicons>
              <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.54)' }}>Vouchers</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '16' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="bag-add-outline" style={[{ color: '#0f25eb79' }, styles.icon]} size={20}></Ionicons>
              <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.54)' }}>Orders</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </TouchableOpacity>
        </View>

        <View style={styles.contentNav}>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="help-circle-outline" style={[{ color: '#eb4d0fe9' }, styles.icon]} size={20}></Ionicons>
              <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.54)' }}>FAQs</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '16' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="settings-outline" style={[{ color: '#6b0feb7e' }, styles.icon]} size={20}></Ionicons>
              <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.54)' }}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.contentNav} onPress={handleSignOut}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="log-out-outline" style={[{ color: '#eb0f0fe9' }, styles.icon]} size={20}></Ionicons>
              <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.54)' }}>Log Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </View>
        </TouchableOpacity>
        <View style={{marginBottom:22}}/>
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
    width: 86,
    height: 86
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
  }
})

export default ProfileScreen