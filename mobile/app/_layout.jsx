import { Stack } from 'expo-router';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { UserProvider } from '../services/UserContextAPI';
import { EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } from '@env'
import { Provider } from 'react-redux';
import { store } from '../redux/store';


const tokenCache = {
    async getToken(key) {
        return SecureStore.getItemAsync(key);
    },
    async saveToken(key, value) {
        return SecureStore.setItemAsync(key, value);
    },
};

export default function RootLayout() {

    return (
        <ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
            <Provider store={store}>
                <UserProvider>
                    <SignedIn>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
                        </Stack>
                    </SignedIn>
                    <SignedOut>
                        <Stack>
                            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        </Stack>
                    </SignedOut>
                </UserProvider>
            </Provider>
        </ClerkProvider>
    );
}
