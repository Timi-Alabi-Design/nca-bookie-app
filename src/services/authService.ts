import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.166:9000/api';

const registerUser = async (data: any) => {
        const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
        });
        return res.json();
};

const loginUser = async (data: any) => {
        const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
        });
        return res.json();
};

const storeToken = async (token: string) => {
        try {
                await AsyncStorage.setItem('nca_token', token);
        } catch (err) {
                console.error('Failed to store token:', err);
        }
};

const getToken = async () => {
        try {
                return await AsyncStorage.getItem('nca_token');
        } catch (err) {
                return null;
        }
};

const removeToken = async () => {
        try {
                await AsyncStorage.removeItem('nca_token');
        } catch (err) {
                console.error('Failed to remove token:', err);
        }
};

export default {
        registerUser,
        loginUser,
        storeToken,
        getToken,
        removeToken,
};
