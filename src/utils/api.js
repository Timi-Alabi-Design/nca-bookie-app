const API_URL = 'http://localhost:9000/api';

export const register = async (userData) => {
        const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
        });
        return res.json();
};

export const login = async (userData) => {
        const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
        });
        return res.json();
};

export const getRooms = async (token) => {
        const res = await fetch('http://localhost:9000/api/rooms', {
                headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                }
        });
        return res.json();
};
