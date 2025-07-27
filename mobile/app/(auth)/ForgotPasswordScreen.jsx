import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import {API_URL} from '@env'


export default function ForgotPasswordScreen({ navigation }) {
  const { signIn, setActive } = useSignIn();
  const [step, setStep] = useState(1)

  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false)

  const sendResetEmail = async () => {
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setStep(2);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', err.errors?.[0]?.message || 'Email không hợp lệ');
    }
  };


  const verifyCode = async () => {
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: otpCode,
      });


      if (result.status === 'needs_new_password') {
        setStep(3);
      } else {
        Alert.alert('Lỗi', 'Hãy thử lại.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Sai mã OTP, vui lòng kiểm tra lại');
    }
  };


  const resetPassword = async () => {
    try {

      const res = await fetch(`${API_URL}/update_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          pass: newPassword
        }),
      });

      const json = await res.json();
      
      if (!json.success) {
        Alert.alert(json.message);
        return;
      }

      await signIn.resetPassword({
        password: newPassword,
      });

      await setActive({ session: signIn.createdSessionId });

    } catch (err) {
      console.error(err);
      Alert.alert('Mật khẩu không an toàn');
    }
  };


  return (
    <View style={{ flex: 1 }}>
      {step === 1 && (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ minHeight: '30%', backgroundColor: '#ffffff04', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#efeae7ff', fontSize: 36, fontWeight: 'bold' }}>Forgot Password</Text>
            <Text style={{ color: '#efeae7ff', fontSize: 16, marginTop: 10 }}>Please sign in to your existing account</Text>
          </View>
          <View style={styles.containerInput}>
            <View style={styles.inputContainer}>
              <TextInput
                value={email}
                placeholder="Enter your Email"
                onChangeText={(email) => setEmail(email)}
                style={styles.input}
              />
            </View>
            <View style={{ padding: 10, position: "relative" }}>
              <TouchableOpacity onPress={sendResetEmail} style={styles.buttonSubmit}>
                <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>SEND</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {step === 2 && (
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
                value={otpCode}
                placeholder="Enter your verification code"
                onChangeText={(otp) => setOtpCode(otp)}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
            <View style={{ padding: 10, position: "relative" }}>
              <TouchableOpacity onPress={verifyCode} style={styles.buttonSubmit}>
                <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>VERIFY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {step === 3 && (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ minHeight: '30%', backgroundColor: '#ffffff04', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#efeae7ff', fontSize: 36, fontWeight: 'bold' }}>Change Password</Text>
            <Text style={{ color: '#efeae7ff', fontSize: 16, marginTop: 10 }}>Please change your password and remember it.</Text>
          </View>
          <View style={styles.containerInput}>
            <View style={styles.inputContainer}>
              <View style={{ position: "relative", display: 'flex', justifyContent: 'space-between', justifyContent: 'center' }}>
                <TextInput
                  value={newPassword}
                  placeholder="Enter password"
                  secureTextEntry={!showPassword}
                  onChangeText={(password) => setNewPassword(password)}
                  style={styles.input}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} style={{ color: '#0000008e' }} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ padding: 10, position: "relative" }}>
              <TouchableOpacity onPress={resetPassword} style={styles.buttonSubmit}>
                <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>CHANGE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
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
  }
});