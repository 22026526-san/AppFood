import React,{ useCallback } from 'react' 
import { Text, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSSO } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'

export default function SocialLoginButton() {

const { startSSOFlow } = useSSO()

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
      setActive({ session: createdSessionId })
    } else {
      console.log('SSO signIn or signUp object:', signIn || signUp)
    }
  } catch (err) {
    console.error('OAuth sign-in error:', JSON.stringify(err, null, 2))
  }
}, [])

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        style={{
          backgroundColor: '#ffffffff',
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
        }}
        onPress={() => handleOAuthSignIn('google')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Login with Google <Ionicons name="logo-google" size={24} color="#DB4437" />;</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#ffffffff',
          padding: 12,
          borderRadius: 8,
        }}
        onPress={() => handleOAuthSignIn('facebook')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Login with Facebook <Ionicons name="logo-facebook" size={24} color="#1977F3" />;</Text>
      </TouchableOpacity>
    </View>
  )
}
