const API_URL = 'http://192.168.1.166:9000/api'; // ✅ same IP

export const getRooms = async (token) => {
        const res = await fetch(`${API_URL}/rooms`, {
                headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                },
        });
        return res.json();
};
