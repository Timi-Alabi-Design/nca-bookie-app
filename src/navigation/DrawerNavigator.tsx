import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RoomsScreen from '../screens/RoomsScreen';
import BookingScreen from '../screens/BookingScreen';
import { Button, View, Text } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MyBookingsScreen from '../screens/MyBookingsScreen';



const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
        const { logout, user } = useContext(AuthContext);

        return (
                <Drawer.Navigator
                        screenOptions={{
                                headerRight: () => (
                                        <Button onPress={logout} title="Logout" color="#000" />
                                ),
                                headerLeftContainerStyle: { paddingLeft: 12 },
                        }}
                >
                        <Drawer.Screen
                                name="Rooms"
                                component={RoomsScreen}
                                options={{ title: `Rooms` }}
                        />
                        <Drawer.Screen name="Booking" component={BookingScreen} options={{ drawerItemStyle: { display: 'none' } }} />
                        <Drawer.Screen name="My Bookings" component={MyBookingsScreen} />
                </Drawer.Navigator>
        );
}
