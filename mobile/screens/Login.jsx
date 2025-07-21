import React from 'react'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import SocialLoginButton from "../components/SocialLoginButton";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const navigation = useNavigation()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  const onSignInPress = async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
    <View style={styles.container}>
      <View style={{ minHeight:'30%', backgroundColor: '#ffffff04', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#efeae7ff', fontSize: 36, fontWeight: 'bold' }}>Log In</Text>
        <Text style={{ color: '#efeae7ff', fontSize: 16, marginTop: 10 }}>Please login to your existing account</Text>
      </View>
      <View style={styles.containerInput}>
        <View style={styles.inputContainer}>
          <Text style={{ color: '#000000c2', fontSize: 16, marginBottom: 8 }}>EMAIL</Text>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Example@gmail.com"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={{ color: '#000000c2', fontSize: 16, marginBottom: 8 }}>PASSWORD</Text>
          <View style={{ position: "relative", display: 'flex', justifyContent: 'space-between' ,justifyContent: 'center' }}>
            <TextInput
              value={password}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              onChangeText={(password) => setPassword(password)}
              style={styles.input}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} style={{color:'#0000008e'}} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ padding: 10, position: "relative" }}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
            <Text style={{ position: "absolute", right: 0, color: '#ff6a00ff' }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 10, position: "relative" }}>
          <TouchableOpacity onPress={onSignInPress} activeOpacity={0.7} style={styles.buttonSubmit}>
            <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>LOGIN</Text>
          </TouchableOpacity>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center', color: '#0000005e' }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={{ color: '#ff6a00ff' }}>Sign up</Text>
          </TouchableOpacity>
        </View>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
          <Text style={{ color: '#0000005e' }}>OR</Text>
        </View>
        <SocialLoginButton />
      </View>
    </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff6a00d9',
  },
  containerInput: {
    minHeight: '70%',
    backgroundColor: '#ffffffff',
    width: '100%',
    padding: 36,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36
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
  },
  eyeButton: {
    position: "absolute",
    right: 5,
    padding: 4,
    display: 'flex',
    justifyContent: 'center',
  },
});
