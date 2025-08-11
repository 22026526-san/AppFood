import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

const NoticeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>NoticeScreen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
  },
});

export default NoticeScreen