import React, { useEffect, useState, useContext } from 'react';
import {
        View,
        Text,
        FlatList,
        TouchableOpacity,
        ActivityIndicator,
        StyleSheet,
        Modal,
        TextInput,
        Alert,
        Dimensions,
} from 'react-native';
import { getRooms } from '../services/roomService';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/globalStyles';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const API_URL = 'http://192.168.1.166:9000/api';

function RoomsScreen({ navigation }) {
        const [rooms, setRooms] = useState([]);
        const [loading, setLoading] = useState(true);
        const [modalVisible, setModalVisible] = useState(false);
        const [editingRoom, setEditingRoom] = useState(null);
        const [form, setForm] = useState({ name: '', capacity: '', location: '' });
        const { token, user } = useContext(AuthContext);

        const isAdmin = user?.role === 'admin';

        useEffect(() => {
                const fetchRooms = async () => {
                        if (!token) return;
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
        }, [token]);

        const openModal = (room = null) => {
                setEditingRoom(room);
                if (room) {
                        setForm({ name: room.name, capacity: String(room.capacity), location: room.location || '' });
                } else {
                        setForm({ name: '', capacity: '', location: '' });
                }
                setModalVisible(true);
        };

        const closeModal = () => {
                setEditingRoom(null);
                setForm({ name: '', capacity: '', location: '' });
                setModalVisible(false);
        };

        const handleSave = async () => {
                if (!form.name || !form.capacity) {
                        return Alert.alert('Validation', 'Room name and capacity are required.');
                }

                const method = editingRoom ? 'PUT' : 'POST';
                const endpoint = editingRoom ? `${API_URL}/rooms/${editingRoom._id}` : `${API_URL}/rooms`;

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
                        if (!res.ok) {
                                return Alert.alert('Error', data.message || 'Could not save room.');
                        }

                        setModalVisible(false);
                        setEditingRoom(null);
                        const refreshed = await getRooms(token);
                        setRooms(refreshed);
                } catch (err) {
                        Alert.alert('Error', 'An error occurred.');
                }
        };

        const renderItem = ({ item }) => (
                <TouchableOpacity
                        onPress={() => navigation.navigate('Booking', { room: item })}
                        style={localStyles.roomCard}
                >
                        <Text style={localStyles.roomName}>{item.name}</Text>
                        <Text style={styles.label}>Capacity: {item.capacity}</Text>
                        {item.location && <Text style={styles.label}>Location: {item.location}</Text>}
                        {isAdmin && (
                                <TouchableOpacity onPress={() => openModal(item)} style={localStyles.editBtn}>
                                        <Text style={{ color: '#007bff' }}>Edit</Text>
                                </TouchableOpacity>
                        )}
                </TouchableOpacity>
        );

        return (
                <View style={styles.container}>
                        <View style={localStyles.headerRow}>
                                <Text style={styles.title}>
                                        Welcome{user?.name ? `, ${user.name}` : ''} 👋
                                </Text>
                                {isAdmin && (
                                        <TouchableOpacity onPress={() => openModal()} style={localStyles.plusButton}>
                                                <Text style={localStyles.plusText}>＋</Text>
                                        </TouchableOpacity>
                                )}
                        </View>

                        {loading ? (
                                <ActivityIndicator size="large" />
                        ) : (
                                <FlatList
                                        data={rooms}
                                        keyExtractor={(item) => item._id}
                                        renderItem={renderItem}
                                />
                        )}

                        <Modal
                                visible={modalVisible}
                                animationType="slide"
                                transparent
                                onRequestClose={closeModal}
                        >
                                <View style={localStyles.modalOverlay}>
                                        <View style={localStyles.modalContent}>
                                                <Text style={[styles.title, { marginBottom: 16 }]}>Room Details</Text>

                                                <Text style={{ marginTop: 16 }}>Room Name</Text>
                                                <TextInput
                                                        placeholder="Room Name"
                                                        value={form.name}
                                                        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                                                        style={styles.input}
                                                />
                                                <Text style={{ marginTop: 16 }}>Capacity</Text>
                                                <TextInput
                                                        placeholder="Capacity"
                                                        value={form.capacity}
                                                        onChangeText={(text) => setForm((prev) => ({ ...prev, capacity: text }))}
                                                        keyboardType="numeric"
                                                        style={styles.input}
                                                />


                                                <TouchableOpacity style={styles.button} onPress={handleSave}>
                                                        <Text style={styles.buttonText}>{editingRoom ? 'Update Room' : 'Create Room'}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.link, { marginTop: 12 }]} onPress={closeModal}>
                                                        <Text style={{ textAlign: 'center', color: 'gray' }}>Cancel</Text>
                                                </TouchableOpacity>
                                        </View>
                                </View>
                        </Modal>
                </View>
        );
}

const localStyles = StyleSheet.create({
        roomCard: {
                padding: 16,
                marginVertical: 8,
                backgroundColor: '#eee',
                borderRadius: 8,
        },
        roomName: {
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 4,
        },
        editBtn: {
                marginTop: 8,
        },
        headerRow: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
        },
        plusButton: {
                backgroundColor: '#007bff',
                width: 36,
                height: 36,
                borderRadius: 18,
                justifyContent: 'center',
                alignItems: 'center',
        },
        plusText: {
                color: 'white',
                fontSize: 20,
                fontWeight: '600',
        },
        modalOverlay: {
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        modalContent: {
                backgroundColor: '#fff',
                padding: 20,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                height: SCREEN_HEIGHT * 0.6,
        },
});

export default RoomsScreen;
