import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getRooms } from '../services/roomService';
import { AuthContext } from '../context/AuthContext';

function RoomsScreen({ navigation }) {
        const [rooms, setRooms] = useState([]);
        const [loading, setLoading] = useState(true);
        const { token, user } = useContext(AuthContext);

        useEffect(() => {
                const fetchRooms = async () => {
                        console.log('TOKEN:', token); // 👈 Check if token exists
                        if (!token) return;
                        try {
                                const data = await getRooms(token);
                                console.log('ROOMS:', data); // 👈 Confirm what’s coming back
                                setRooms(data);
                        } catch (err) {
                                console.error('Error fetching rooms', err);
                        } finally {
                                setLoading(false);
                        }
                };
                fetchRooms();
        }, [token]);


        const renderItem = ({ item }: any) => (
                <TouchableOpacity
                        onPress={() => navigation.navigate('Booking', { room: item })}
                        style={{
                                padding: 16,
                                marginVertical: 8,
                                backgroundColor: '#eee',
                                borderRadius: 8,
                        }}
                >
                        <Text style={{ fontSize: 18 }}>{item.name}</Text>
                        <Text>Capacity: {item.capacity}</Text>
                        {item.location && <Text>Location: {item.location}</Text>}
                </TouchableOpacity>
        );

        return (
                <View style={{ padding: 16 }}>
                        <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16 }}>
                                Welcome{user?.name ? `, ${user.name}` : ''} 👋
                        </Text>

                        {loading ? (
                                <ActivityIndicator size="large" />
                        ) : (
                                <FlatList
                                        data={rooms}
                                        keyExtractor={(item) => item._id}
                 