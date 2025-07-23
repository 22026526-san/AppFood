import React, { useCallback } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSSO } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native'
import * as AuthSession from 'expo-auth-session'

export default function SocialLoginButton() {

  const { startSSOFlow } = useSSO()
  const navigation = useNavigation()

  const handleOAuthSignIn = useCallback(async (provider) => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        native: 'my-app://',
      })

      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: `oauth_${provider}`,
        redirectUrl,
      })

      if (createdSessionId) {
        if (signUp.createdSessionId) {
        navigation.navigate('CompleteProfile', {
          createdSessionId
        });
        return; 
      }
        setActive({ session: createdSessionId })
      } else {
        console.log('SSO signIn or signUp object:', signIn || signUp)
      }
    } catch (err) {
      console.error('OAuth sign-in error:', JSON.stringify(err, null, 2))
    }
  }, [])

  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <TouchableOpacity
        style={{
          backgroundColor: '#ffffffff',
          padding: 12,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'row'
        }}
        onPress={() => handleOAuthSignIn('google')}
      >
        <Ionicons name="logo-google" size={46} color="#e23929ff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#ffffffff',
          padding: 12,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'row'
        }}
        onPress={() => handleOAuthSignIn('facebook')}
      >
        <Ionicons name="logo-facebook" size={46} color="#1977F3" />
      </TouchableOpacity>
    </View>
  )
}