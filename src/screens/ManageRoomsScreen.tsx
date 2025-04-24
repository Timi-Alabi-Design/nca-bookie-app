import React, { useEffect, useState, useContext } from 'react';
import {
        View, Text, TextInput, TouchableOpacity,
        FlatList, Alert, ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import auth from '../services/authService';
import styles from '../styles/globalStyles';

const API_URL = 'http://192.168.1.166:9000/api';

function ManageRoomsScreen() {
        const { token, user } = useContext(AuthContext);
        const [rooms, setRooms] = useState([]);
        const [loading, setLoading] = useState(true);
        const [form, setForm] = useState({ name: '', capacity: '', location: '' });
        const [editingId, setEditingId] = useState<string | null>(null);

        useEffect(() => {
                console.log('Token:', token);
                console.log('User:', user);

                if (!token || user?.role !== 'admin') return;
                fetchRooms();
        }, [token, user]);


        const fetchRooms = async () => {
                try {
                        const res = await fetch(`${API_URL}/rooms`, {
                                headers: { Authorization: `Bearer ${token}` },
                        });
                        const data = await res.json();

                        if (!res.ok) {
                                console.error('Error fetching rooms:', data);
                                Alert.alert('Error', data.message || 'Failed to fetch rooms.');
                        } else {
                                setRooms(data);
                        }
                } catch (err) {
                        console.error('Failed to load rooms', err);
                        Alert.alert('Network Error', 'Could not reach server.');
                } finally {
                        setLoading(false); // ✅ Ensure this is always called
                }
        };


        const handleSave = async () => {
                if (!form.name || !form.capacity) {
                        return Alert.alert('Validation', 'Name and Capacity are required');
                }

                const method = editingId ? 'PUT' : 'POST';
                const endpoint = editingId ? `${API_URL}/rooms/${editingId}` : `${API_URL}/rooms`;

                try {
                        const res = await fetch(endpoint, {
                                method,
                                headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify(form),
                        });

                        const data = await res.json();
                        if (res.ok) {
                                Alert.alert('Success', `Room ${editingId ? 'updated' : 'created'} successfully.`);
                                setForm({ name: '', capacity: '', location: '' });
                                setEditingId(null);
                                fetchRooms();
                        } else {
                                Alert.alert('Error', data.message || 'Failed to save room.');
                        }
                } catch (err) {
                        console.error('Save room error:', err);
                        Alert.alert('Error', 'An error occurred.');
                }
        };

        const handleEdit = (room: any) => {
                setEditingId(room._id);
                setForm({
                        name: room.name,
                        capacity: String(room.capacity),
                        location: room.location || '',
                });
        };

        const handleDelete = async (id: string) => {
                Alert.alert('Confirm Delete', 'Are you sure you want to delete this room?', [
                        { text: 'Cancel' },
                        {
                                text: 'Delete',
                                onPress: async () => {
                                        try {
                                                const res = await fetch(`${API_URL}/rooms/${id}`, {
                                                        method: 'DELETE',
                                                        headers: { Authorization: `Bearer ${token}` },
                                                });
                                                if (res.ok) fetchRooms();
                                                else Alert.alert('Error', 'Failed to delete room.');
                                        } catch (err) {
                                                console.error('Delete error:', err);
                                        }
                                },
                        },
                ]);
        };

        const renderItem = ({ item }: any) => (
                <View style={{
                        backgroundColor: '#eee',
                        padding: 16,
                        marginBottom: 12,
                        borderRadius: 8,
                }}>
                        <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.name}</Text>
                        <Text>Capacity: {item.capacity}</Text>
                        {item.location && <Text>Location: {item.location}</Text>}

                        <View style={{ flexDirection: 'row', marginTop: 12, gap: 16 }}>
                                <TouchableOpacity onPress={() => handleEdit(item)}>
                                        <Text style={{ color: 'blue' }}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                                        <Text style={{ color: 'red' }}>Delete</Text>
                                </TouchableOpacity>
                        </View>
                </View>
        );

        return (
                <View style={{ padding: 16, flex: 1 }}>
                        <Text style={styles.title}>Manage Rooms</Text>

                        <TextInput
                                placeholder="Room Name"
                                value={form.name}
                                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                                style={styles.input}
                        />
                        <TextInput
                                placeholder="Capacity"
                                value={form.capacity}
                                onChangeText={(text) => setForm((prev) => ({ ...prev, capacity: text }))}
                                keyboardType="numeric"
                                style={styles.input}
                        />
                        <TextInput
                                placeholder="Location (optional)"
                                value={form.location}
                                onChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
                                style={styles.input}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                                <Text style={styles.buttonText}>{editingId ? 'Update Room' : 'Create Room'}</Text>
                        </TouchableOpacity>

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

export default ManageRoomsScreen