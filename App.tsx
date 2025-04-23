import { registerRootComponent } from 'expo';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading'; // if not installed: npm i expo-app-loading

const loadFonts = () => {
        return Font.loadAsync({
                'Mulish-Regular': require('./assets/fonts/Mulish-Italic-VariableFont_wght.ttf'),
                'Mulish-Bold': require('./assets/fonts/Mulish-VariableFont_wght.ttf'),
        });
};

function App() {
        const [fontsLoaded, setFontsLoaded] = React.useState(false);

        if (!fontsLoaded) {
                return (
                        <AppLoading
                                startAsync={loadFonts}
                                onFinish={() => setFontsLoaded(true)}
                                onError={console.warn}
                        />
                );
        }

        return <AppNavigator />;
}

export default registerRootComponent(App);
