import { View, Text, StyleSheet, ScrollView, TouchableOpacity,Image } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useClerk } from '@clerk/clerk-expo'

const ProfileScreen = () => {
  const {user} = useUser()
  const navigation = useNavigation();
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}><Ionicons name="chevron-back" size={22} color="#000000d5" /></TouchableOpacity>
          </View>
          <Text style={{ fontSize: '22', color: '#000000d5' }}>Profile</Text>
        </View>


        <View style={styles.contentUser}>
          <View>
            <Image style={styles.ImgUser} source={{ uri: user.imageUrl,resizeMode:'cover' }} ></Image>
          </View>
          <View style={{ display: 'flex', flexDirection: 'column', gap:5,justifyContent:'center'}}>
            <Text style={{ fontSize: '26', color: '#000000d5',fontWeight:'bold'}}>
              quang sang
            </Text>
            <Text style={{ fontSize: '12', color: '#00000053' }}>0974583072</Text>
          </View>
        </View>

        <View style={styles.contentNav}>
          <View style={{display:'flex', flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View style={{display:'flex', flexDirection:'row',alignItems:'center',gap:10}}>
              <Ionicons name="person-outline" style={[{ color: '#eb4d0fe9'}, styles.icon]} size={20}></Ionicons>
              <Text style={{fontSize:'16',color:'rgba(0, 0, 0, 0.54)'}}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </View>
        </View>

        <View style={styles.contentNav}>
          <View style={{display:'flex', flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View style={{display:'flex', flexDirection:'row',alignItems:'center',gap:10}}>
              <Ionicons name="cart-outline" style={[{ color: '#0fceebbb'}, styles.icon]} size={20}></Ionicons>
              <Text style={{fontSize:'16',color:'rgba(0, 0, 0, 0.54)'}}>Cart</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </View>
          <View style={{display:'flex', flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:'16'}}>
            <View style={{display:'flex', flexDirection:'row',alignItems:'center',gap:10}}>
              <Ionicons name="heart-outline" style={[{ color: '#eb0fc65f'}, styles.icon]} size={20}></Ionicons>
              <Text style={{fontSize:'16',color:'rgba(0, 0, 0, 0.54)'}}>Favourite</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </View>
          <View style={{display:'flex', flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:'16'}}>
            <View style={{display:'flex', flexDirection:'row',alignItems:'center',gap:10}}>
              <Ionicons name="notifications-outline" style={[{ color: '#ebca0f98'}, styles.icon]} size={20}></Ionicons>
              <Text style={{fontSize:'16',color:'rgba(0, 0, 0, 0.54)'}}>Notification</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </View>
          <View style={{display:'flex', flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:'16'}}>
            <View style={{display:'flex', flexDirection:'row',alignItems:'center',gap:10}}>
              <Ionicons name="bag-add-outline" style={[{ color: '#0f25eb79'}, styles.icon]} size={20}></Ionicons>
              <Text style={{fontSize:'16',color:'rgba(0, 0, 0, 0.54)'}}>Orders</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </View>
        </View>

        <View style={styles.contentNav}>
          <View style={{display:'flex', flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View style={{display:'flex', flexDirection:'row',alignItems:'center',gap:10}}>
              <Ionicons name="help-circle-outline" style={[{ color: '#eb4d0fe9'}, styles.icon]} size={20}></Ionicons>
              <Text style={{fontSize:'16',color:'rgba(0, 0, 0, 0.54)'}}>FAQs</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </View>
          <View style={{display:'flex', flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:'16'}}>
            <View style={{display:'flex', flexDirection:'row',alignItems:'center',gap:10}}>
              <Ionicons name="settings-outline" style={[{ color: '#6b0feb7e'}, styles.icon]} size={20}></Ionicons>
              <Text style={{fontSize:'16',color:'rgba(0, 0, 0, 0.54)'}}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </View>
        </View>

        <TouchableOpacity style={styles.contentNav} onPress={handleSignOut}>
          <View style={{display:'flex', flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View style={{display:'flex', flexDirection:'row',alignItems:'center',gap:10}}>
              <Ionicons name="log-out-outline" style={[{ color: '#eb0f0fe9'}, styles.icon]} size={20}></Ionicons>
              <Text style={{fontSize:'16',color:'rgba(0, 0, 0, 0.54)'}}>Log Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color='rgba(0, 0, 0, 0.23)'></Ionicons>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    padding: 20
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
  ImgUser:{
    borderRadius:50,
    width:86,
    height:86
  },
  contentUser:{
    display:'flex',
    flexDirection:'row',
    gap : 20,
    marginTop:20
  },
  contentNav:{
    backgroundColor:'#96a8be11',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
    marginTop : 20
  },
  icon:{
    backgroundColor: '#ffffffff',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ProfileScreen