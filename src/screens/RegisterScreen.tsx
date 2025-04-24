import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '../services/authService';
import styles from '../styles/globalStyles';

function RegisterScreen({ navigation }) {
        const [form, setForm] = useState({ name: '', email: '', password: '' });
        const [errors, setErrors] = useState({ name: '', email: '', password: '' });

        const handleChange = (key, value) => {
                setForm((prev) => ({ ...prev, [key]: value }));
                setErrors((prev) => ({ ...prev, [key]: '' }));
        };

        const handleSubmit = async () => {
                let hasError = false;
                let newErrors = { name: '', email: '', password: '' };

                if (!form.name) {
                        newErrors.name = 'Full name is required';
                        hasError = true;
                }
                if (!form.email) {
                        newErrors.email = 'Email is required';
                        hasError = true;
                }
                if (!form.password) {
                        newErrors.password = 'Password is required';
                        hasError = true;
                }

                if (hasError) {
                        return setErrors(newErrors);
                }

                const res = await auth.registerUser(form);

                if (res.message === 'User registered successfully.') {
                        Alert.alert('Success', 'Registration complete');
                        navigation.navigate('Login');
                } else {
                        Alert.alert('Error', res.message || 'Something went wrong');
                }
        };

        return (
                <View style={styles.midContainer}>
                        <Text style={styles.title}>Create an Account</Text>

                        <Text>Full Name</Text>
                        <TextInput
                                placeholder="e.g. John Doe"
                                value={form.name}
                                onChangeText={(text) => handleChange('name', text)}
                                autoCapitalize="words"
                                style={styles.input}
                        />
                        {errors.name ? <Text style={{ color: 'red', marginBottom: 8 }}>{errors.name}</Text> : null}

                        <Text>Email Address</Text>
                        <TextInput
                                placeholder="e.g. john@example.com"
                                value={form.email}
                                onChangeText={(text) => handleChange('email', text)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                        />
                        {errors.email ? <Text style={{ color: 'red', marginBottom: 8 }}>{errors.email}</Text> : null}

                        <Text>Password</Text>
                        <TextInput
                                placeholder="Create a secure password"
                                value={form.password}
                                onChangeText={(text) => handleChange('password', text)}
                                secureTextEntry
                                autoCapitalize="none"
                                style={styles.input}
                        />
                        {errors.password ? <Text style={{ color: 'red', marginBottom: 8 }}>{errors.password}</Text> : null}

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.link}>Already have an account? Login</Text>
                        </TouchableOpacity>
                </View>
        );
}

export default RegisterScreen;
