import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { register } from '../utils/api';

export default function RegisterScreen({ navigation }) {
        const [form, setForm] = useState({ name: '', email: '', password: '' });

        const handleChange = (key, value) => setForm({ ...form, [key]: value });

        const handleSubmit = async () => {
                const res = await register(form);
                if (res.message === 'User registered successfully.') {
                        Alert.alert('Success', 'Account created');
                        navigation.navigate('Login');
                } else {
                        Alert.alert('Error', res.message || 'Something went wrong');
                }
        };

        return (
                <View style={{ padding: 20 }}>
                        <TextInput placeholder="Name" onChangeText={(text) => handleChange('name', text)} />
                        <TextInput placeholder="Email" onChangeText={(text) => handleChange('email', text)} keyboardType="email-address" />
                        <TextInput placeholder="Password" secureTextEntry onChangeText={(text) => handleChange('password', text)} />
                        <Button title="Register" onPress={handleSubmit} />
                        <Text onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
                </View>
        );
}
