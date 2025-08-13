import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

const EditFoodScreen = () => {
  const router = useRouter();

  const { data } = useLocalSearchParams();
  const data_food = JSON.parse(data);

  return (
    <View>
      <Text>EditFoodScreen</Text>
    </View>
  )
}

export default EditFoodScreen