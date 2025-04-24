import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import DrawerNavigator from './DrawerNavigator';
import { AuthContext } from '../context/AuthContext';

export default function AppNavigator() {
        const { token, loading } = useContext(AuthContext);

        if (loading) return null;

        return (
                <NavigationContainer>
                        {token ? <DrawerNavigator /> : <AuthStack />}
                </NavigationContainer>
        );
}
