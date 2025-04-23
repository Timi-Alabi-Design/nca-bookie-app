import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import RoomsScreen from '../screens/RoomsScreen';
import BookingScreen from '../screens/BookingScreen';

const Stack = createNativeStackNavigator(); // ✅ This is where 'Stack' is defined

export default function AppNavigator() {
        return (
                <NavigationContainer>
                        <Stack.Navigator initialRouteName="Login">
                                <Stack.Screen name="Login" component={LoginScreen} />
                                <Stack.Screen name="Register" component={RegisterScreen} />
                                <Stack.Screen name="Home" component={HomeScreen} />
                                <Stack.Screen name="Rooms" component={RoomsScreen} />
                                <Stack.Screen name="Booking" component={BookingScreen} />
                        </Stack.Navigator>
                </NavigationContainer>
        );
}
