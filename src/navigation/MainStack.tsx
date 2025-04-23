import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoomsScreen from '../screens/RoomsScreen';
import BookingScreen from '../screens/BookingScreen';

export type MainStackParamList = {
        Rooms: undefined;
        Booking: { room: any }; // optionally use Room type here
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
        return (
                <Stack.Navigator>
                        <Stack.Screen name="Rooms" component={RoomsScreen} />
                        <Stack.Screen name="Booking" component={BookingScreen} />
                </Stack.Navigator>
        );
}
