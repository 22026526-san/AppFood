import { View, Text ,StyleSheet} from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo';

const HomeScreen = () => {
  const {userId} = useAuth();

  return (
    <View style={styles.container}>
      <Text style={{color:'orange'}}>Welcom {userId}</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
}); 