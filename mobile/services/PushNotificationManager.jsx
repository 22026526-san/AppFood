import React, { useEffect,useContext } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { API_URL } from '@env';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import {UserContext} from './UserContextAPI';


const PushNotificationManager = () => {
    const { isSignedIn, user } = useUser();
    const { userId } = useAuth();
    const router = useRouter();
    const {role} = useContext(UserContext);

    const registerForPushNotificationsAsync = async () => {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.warn('Permission not granted for notifications');
                return;
            }

            const projectId = Constants.easConfig?.projectId;
            if (!projectId) {
                console.error('No project ID found');
                return;
            }

            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    


            try {
                const res =
                await fetch(`${API_URL}/push_expo_token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: userId, token: token }),
                });

                const result = await res.json();
                
            } catch (err) {
                console.error('Error saving token:', err);
            }

            return token;
        } else {
            console.warn('Must use physical device for Push Notifications');
        }
    };

    useEffect(() => {
        if (userId) {
            registerForPushNotificationsAsync();

            const responseSubscription = Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    
                    if(role === 'manager') {
                        router.push("/(adminTabs)/NoticeScreen");
                    }
                    else
                    router.push("/(tabs)/NoticeScreen");
                }
            );

            
            return () => {
                responseSubscription.remove();
            };
        }
    }, [userId]);

    return null;
};

export default PushNotificationManager;
