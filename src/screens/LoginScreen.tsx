import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '../services/authService';
import styles from '../styles/globalStyles';
import { AuthContext } from '../context/AuthContext';

function LoginScreen({ navigation }) {
        const [form, setForm] = useState({ email: '', password: '' });
        const [errors, setErrors] = useState({ email: '', password: '' });
        const { login } = useContext(AuthContext);

        const handleChange = (key: string, value: string) => {
                setForm((prev) => ({ ...prev, [key]: value }));
                setErrors((prev) => ({ ...prev, [key]: '' }));
        };

        const handleSubmit = async () => {
                try {
                        if (!form.email || !form.password) {
                                return setErrors({
                                        email: !form.email ? 'Email is required' : '',
                                        password: !form.password ? 'Password is required' : '',
                                });
                        }

                        const res = await auth.loginUser(form);

                        if (res.token && res.user) {
                                login(res.token, res.user);
                                Alert.alert('Login successful');
                                // No manual navigation needed if AppNavigator renders the drawer after login
                        } else {
                                Alert.alert('Login failed', res.message || 'Invalid credentials');
                        }
                } catch (err) {
                        console.error('Login error:', err);
                        Alert.alert('Unexpected error occurred');
                }
        };

        return (
                <View style={styles.midContainer}>
                        <Text style={styles.title}>Login to NCA Bookie</Text>

                        <Text>Email Address</Text>
                        <TextInput
                                placeholder="e.g. user@church.org"
                                value={form.email}
                                onChangeText={(text) => handleChange('email', text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                        />
                        {errors.email ? <Text style={{ color: 'red' }}>{errors.email}</Text> : null}

                        <Text>Password</Text>
                        <TextInput
                                placeholder="Enter your password"
                                value={form.password}
                                onChangeText={(text) => handleChange('password', text)}
                                secureTextEntry
                                autoCapitalize="none"
                                style={styles.input}
                        />
                        {errors.password ? <Text style={{ color: 'red' }}>{errors.password}</Text> : null}

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.link}>Don't have an account? Register</Text>
                        </TouchableOpacity>
                </View>
        );
}

export default LoginScreen;
