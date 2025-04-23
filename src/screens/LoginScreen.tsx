import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { login } from '../utils/api';

export default function LoginScreen({ navigation }) {
        const [form, setForm] = useState({ email: '', password: '' });

        const handleChange = (key, value) => setForm({ ...form, [key]: value });

        const handleSubmit = async () => {
                const res = await login(form);
                if (res.token) {
                        Alert.alert('Success', 'Logged in');
                        // store token here (AsyncStorage or context)
                        navigation.navigate('Rooms');
                } else {
                        Alert.alert('Error', res.message || 'Login failed');
                }
        };

        return (
                <View style={{ padding: 20 }}>
                        <TextInput placeholder="Email" onChangeText={(text) => handleChange('email', text)} keyboardType="email-address" />
                        <TextInput placeholder="Password" secureTextEntry onChangeText={(text) => handleChange('password', text)} />
                        <Button title="Login" onPress={handleSubmit} />
                        <Text onPress={() => navigation.navigate('Register')}>Don’t have an account? Register</Text>
                </View>
        );
}
