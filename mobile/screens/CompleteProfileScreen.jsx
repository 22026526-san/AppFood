import { View, Text, TextInput, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity,ScrollView } from 'react-native'
import React , {useContext } from 'react'
import { useRoute } from '@react-navigation/native';
import { useSignUp } from '@clerk/clerk-expo'
import {API_URL} from '@env'
import { UserContext } from '../services/UserContextAPI';

const CompleteProfileScreen = () => {
    const [name, setName] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const { setActive } = useSignUp()
    const route = useRoute();
    const { createdSessionId } = route.params;
    const {setIsSignUp, setUser} = useContext(UserContext)
    

    const handleSubmit = async () => {

        try {
            
            const res = await fetch(`${API_URL}/signup_oath`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name : name,
                    phone : phone
                }),
            });
            const json = await res.json();
            console.log('Response from server:', json);
            if (!json.success) {
                Alert.alert(json.message);
                return;
            }
            await setActive({ session: createdSessionId });

            //set Context
            setUser(json.user_id);
            setIsSignUp(true);

        } catch (error) {
            console.error('Error completing profile:', error);
            Alert.alert('Đã xảy ra lỗi khi hoàn tất hồ sơ');
        }
    };
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
                    <View style={{ minHeight: '30%', backgroundColor: '#ffffff04', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#efeae7ff', fontSize: 36, fontWeight: 'bold' }}>Complete Profile</Text>
                        <Text style={{ color: '#efeae7ff', fontSize: 16, marginTop: 10 }}>Please provide additional info to finish registration</Text>
                    </View>
                    <View style={styles.containerInput}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={name}
                                placeholder="Enter your name"
                                onChangeText={(name) => setName(name)}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={phone}
                                placeholder="Enter your phone number"
                                onChangeText={(phone) => setPhone(phone)}
                                style={styles.input}
                            />
                        </View>
                        <View style={{ padding: 10, position: "relative" }}>
                            <TouchableOpacity onPress={handleSubmit} style={styles.buttonSubmit}>
                                <Text style={{ color: '#fffffffb', fontWeight: 'bold' }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default CompleteProfileScreen

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
