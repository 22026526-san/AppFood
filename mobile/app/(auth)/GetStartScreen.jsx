import { View, Text,StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import Logo from '../../assets/fast-food.png'

const GetStartScreen = () => {

  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#ff6a00bd'}}>
      <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center' ,marginTop: 50}}>
        <Image style={{ width: '100%', aspectRatio: 2 / 5 }}
          resizeMode="contain"
          source={Logo}/>
      </View>
      <View style={{ flex: 0.4 , alignItems: 'center',marginTop :-68}}>
        <Text style = {{color:'#efeae7ff', fontSize:36,fontWeight:'bold'}} >FAST<Ionicons name='restaurant' color={'#efeae7ff'} size={26}/>FOOD</Text>
        <View style={{ alignItems: 'center',marginTop: 8}}>
          <Text style = {{color:'#efeae7ff', fontSize:12}}>Get all your loved foods in one once place,</Text>
          <Text style = {{color:'#efeae7ff', fontSize:12}}>you yust flace the oror we do the rest</Text>
        </View>
        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => router.push('/Login')}>
          <Text style={styles.buttonText}>GET START</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {  
    backgroundColor: '#ff6a0084',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 30,
    width: 200,
    alignItems: 'center',
    borderColor: '#ffffffff',
    borderWidth: 2
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f6f6f6ff",
    textAlign: "center",
  },
})
export default GetStartScreen