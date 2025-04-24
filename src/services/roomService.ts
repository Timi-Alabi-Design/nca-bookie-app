// src/services/roomService.ts

const API_URL = 'http://192.168.1.166:9000/api';

export const getRooms = async (token: string) => {
  const res = await fetch(`${API_URL}/rooms`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
