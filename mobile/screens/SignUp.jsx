import React, { useState , useContext } from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import { UserContext } from '../services/UserContextAPI';

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp()

  const [data, setData] = React.useState({
    email: '',
    phone: '',
    username: '',
    password: ''
  });
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [formError, setFormError] = useState({})
  const {setIsSignUp, setUser} = useContext(UserContext)



  const handleChangeData = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Hàm xử lý data
  const validateData = () => {
    const error = {};

    // Kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailPattern.test(data.email)) {
      error.email = 'Email không đúng định dạng';
    }

    // Kiểm tra độ dài số điện thoại
    if (!data.phone || data.phone.length !== 10) {
      error.phone = 'Số điện thoại phải có 10 ký tự';
    }

    // Kiểm tra mật khẩu
    const password = data.password || '';
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).+$/;

    if (!passwordPattern.test(password)) {
      error.password = 'Mật khẩu phải gồm in hoa, ký tự đặc biệt và số';
    }
    setFormError(error)

    return Object.keys(error).length === 0;
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return

    const isValid = validateData();
    if (!isValid) {

      return;
    }
    try {
      //check user 
      const res = await fetch(`${API_URL}/signup_check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: data.phone,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        Alert.alert(json.message);
        return;
      }

      //send otp
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      })


      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err) {
      const errorCode = err.errors?.[0]?.code;
      if (errorCode === 'form_identifier_exists') {
        Alert.alert('Email này đã được đăng ký.');
      } else {
        Alert.alert('Đăng ký thất bại. Vui lòng thử lại.');
      }
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: otp,
      });

      if (signUpAttempt.status === 'complete') {
        // Gửi thông tin user về backend
        const res = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.username,
            email: data.email,
            phone: data.phone,
            password: data.password
          }),
        });

        const json = await res.json();

        if (!json.success) {
          Alert.alert(json.message);
          return;
        }

        await setActive({ session: signUpAttempt.createdSessionId });

        //set Context
        setUser(json.user_id);
        setIsSignUp(true);


      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };


  // otp 
  const [otp, setOtp] = useState('');

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ minHeight: '30%', backgroundColor: '#ffffff04', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#efeae7ff', fontSize: 36, fontWeight: 'bold' }}>Verification</Text>
          <Text style={{ color: '#efeae7ff', fontSize: 16, marginTop: 10 }}>We have send a code to your email</Text>
        </View>
        <View style={styles.containerInput}>
          <View style={styles.inputContainer}>
            <TextInput
              value={otp}
              placeholder="Enter your verification code"
              onChangeText={(otp) => setOtp(otp)}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
          <View style={{ padding: 10, position: "relative" }}>
            <TouchableOpacity onPress={onVerifyPress} style={styles.buttonSubmit}>
              <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>VERIFY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={{ minHeight: '30%', backgroundColor: '#ffffff04', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#efeae7ff', fontSize: 36, fontWeight: 'bold' }}>Sign Up</Text>
            <Text style={{ color: '#efeae7ff', fontSize: 16, marginTop: 10 }}>Please sign up to get started</Text>
          </View>
          <View style={styles.containerInput}>
            <View style={styles.inputContainer}>
              <Text style={{ color: '#000000c2', fontSize: 16, marginBottom: 8, marginLeft: 2 }}>USERNAME</Text>
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
                autoCapitalize="none"
                value={data.email}
                placeholder="Example@gmail.com"
                onChangeText={(text) => handleChangeData('email', text)}
                style={styles.input}
              />
              {formError.email && (
                <Text style={{ color: 'red', marginLeft: 2, marginTop: 2 }}>{formError.email}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={{ color: '#000000c2', fontSize: 16, marginBottom: 8, marginLeft: 2 }}>PASSWORD</Text>
              <View style={{ position: "relative", display: 'flex', justifyContent: 'space-between', justifyContent: 'center' }}>
                <TextInput
                  value={data.password}
                  placeholder="Enter password"
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => handleChangeData('password', text)}
                  style={styles.input}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} style={{ color: '#0000008e' }} />
                </TouchableOpacity>
              </View>
              {formError.password && (
                <Text style={{ color: 'red', marginLeft: 2, marginTop: 2 }}>{formError.password}</Text>
              )}
            </View>
            <View style={{ padding: 10, position: "relative" }}>
              <TouchableOpacity onPress={onSignUpPress} style={styles.buttonSubmit}>
                <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>SIGNUP</Text>
              </TouchableOpacity>
            </View>
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
    minHeight: '100%',
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderColor: '#ffffffff',
    borderWidth: 2,
    width: '100%'
  },
  eyeButton: {
    position: "absolute",
    right: 5,
    padding: 4,
    display: 'flex',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  }, otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
  },
  resend: {
    marginBottom: 20,
    color: 'gray',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});