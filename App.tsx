import { registerRootComponent } from 'expo';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator'; // Adjust path as needed

function App() {
        return <AppNavigator />;
}

export default registerRootComponent(App);
