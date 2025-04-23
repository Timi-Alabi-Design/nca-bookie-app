import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getRooms } from '../utils/api';

export default function RoomsScreen({ navigation }) {
        const [rooms, setRooms] = useState([]);
        const [loading, setLoading] = useState(true);
        const token = ''; // TODO: Replace with real token (AsyncStorage or context)

        useEffect(() => {
                const fetchRooms = async () => {
                        try {
                                const data = await getRooms(token);
                                setRooms(data);
                        } catch (err) {
                                console.error('Error fetching rooms', err);
                        } finally {
                                setLoading(false);
                        }
                };
                fetchRooms();
        }, []);

        const renderItem = ({ item }) => (
                <TouchableOpacity
                        onPress={() => navigation.navigate('Booking', { room: item })}
                        style={{
                                padding: 16,
                                marginVertical: 8,
                                backgroundColor: '#eee',
                                borderRadius: 8
                        }}
                >
                        <Text style={{ fontSize: 18 }}>{item.name}</Text>
                        <Text>Capacity: {item.capacity}</Text>
                        {item.location && <Text>Location: {item.location}</Text>}
                </TouchableOpacity>
        );

        return (
                <View style={{ padding: 16 }}>
                        {loading ? (
                                <ActivityIndicator size="large" />
                        ) : (
                                <FlatList
                                        data={rooms}
                                        keyExtractor={(item) => item._id}
                                        renderItem={renderItem}
                                />
                        )}
                </View>
        );
}
