import React, { useEffect, useState, useContext } from 'react';
import {
        View, Text, FlatList, ActivityIndicator, StyleSheet,
        TouchableOpacity, Alert, Modal, TextInput
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/globalStyles';

const API_URL = 'http://192.168.1.166:9000/api';

function MyBookingsScreen() {
        const { token } = useContext(AuthContext);
        const [bookings, setBookings] = useState([]);
        const [rooms, setRooms] = useState([]);
        const [loading, setLoading] = useState(true);

        const [editModalVisible, setEditModalVisible] = useState(false);
        const [selectedBooking, setSelectedBooking] = useState(null);
        const [editDate, setEditDate] = useState(new Date());
        const [showDatePicker, setShowDatePicker] = useState(false);
        const [editPurpose, setEditPurpose] = useState('');
        const [editTimeSlot, setEditTimeSlot] = useState('');
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
        const [editRoomId, setEditRoomId] = useState(null);

        const timeSlotOptions = [
                '8:00 AM – 10:00 AM', '10:00 AM – 12:00 PM', '12:00 PM – 2:00 PM',
                '2:00 PM – 4:00 PM', '4:00 PM – 6:00 PM', '6:00 PM – 8:00 PM'
        ];

        useEffect(() => {
                const fetchData = async () => {
                        try {
                                const [bookingRes, roomRes] = await Promise.all([
                                        fetch(`${API_URL}/bookings/my`, {
                                                headers: {
                                                        'Content-Type': 'application/json',
                                                        Authorization: `Bearer ${token}`,
                                                },
                                        }),
                                        fetch(`${API_URL}/rooms`, {
                                                headers: { Authorization: `Bearer ${token}` },
                                        })
                                ]);

                                const bookingData = await bookingRes.json();
                                const roomData = await roomRes.json();

                                setBookings(bookingData);
                                setRooms(roomData);
                        } catch (err) {
                                console.error('Failed to fetch data:', err);
                        } finally {
                                setLoading(false);
                        }
                };

                if (token) fetchData();
        }, [token]);

        const handleDelete = async (id) => {
                Alert.alert('Confirm', 'Are you sure you want to delete this booking?', [
                        { text: 'Cancel' },
                        {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: async () => {
                                        try {
                                                await fetch(`${API_URL}/bookings/${id}`, {
                                                        method: 'DELETE',
                                                        headers: { Authorization: `Bearer ${token}` },
                                                });
                                                setBookings((prev) => prev.filter((b) => b._id !== id));
                                        } catch (err) {
                                                Alert.alert('Error', 'Failed to delete booking');
                                        }
                                },
                        },
                ]);
        };

        const openEditModal = (booking) => {
                setSelectedBooking(booking);
                setEditDate(new Date(booking.date));
                setEditPurpose(booking.purpose);
                setEditTimeSlot(booking.timeSlot);
                setEditRoomId(booking.roomId._id);
                setEditModalVisible(true);
        };

        const handleUpdate = async () => {
                if (!selectedBooking) return;

                try {
                        // Step 1: Check for conflicts using new route
                        const availabilityRes = await fetch(`${API_URL}/bookings/availability`, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                        bookingId: selectedBooking._id,
                                        roomId: editRoomId,
                                        date: editDate.toISOString().split('T')[0],
                                        timeSlot: editTimeSlot,
                                }),
                        });

                        const availability = await availabilityRes.json();

                        if (!availability.available) {
                                return Alert.alert('Unavailable', availability.message || 'Slot is taken.');
                        }

                        // Step 2: Proceed with update
                        const res = await fetch(`${API_URL}/bookings/${selectedBooking._id}`, {
                                method: 'PUT',
                                headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                        date: editDate.toISOString().split('T')[0],
                                        timeSlot: editTimeSlot,
                                        purpose: editPurpose,
                                        roomId: editRoomId,
                                }),
                        });

                        const updated = await res.json();

                        if (!res.ok) {
                                return Alert.alert('Error', updated.message || 'Update failed');
                        }

                        setBookings((prev) =>
                                prev.map((b) => (b._id === updated._id ? updated : b))
                        );
                        setEditModalVisible(false);
                } catch (err) {
                        console.error('Update failed:', err);
                        Alert.alert('Error', 'An error occurred during update.');
                }
        };


        const renderItem = ({ item }) => (
                <View style={local.card}>
                        <Text style={local.title}>{item.roomId?.name || 'Unnamed Room'}</Text>
                        <Text>Date: {item.date}</Text>
                        <Text>Time Slot: {item.timeSlot}</Text>
                        <Text>Purpose: {item.purpose}</Text>
                        <View style={local.actionRow}>
                                <TouchableOpacity onPress={() => openEditModal(item)} style={local.editBtn}>
                                        <Text style={{ color: 'white' }}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item._id)} style={local.deleteBtn}>
                                        <Text style={{ color: 'white' }}>Delete</Text>
                                </TouchableOpacity>
                        </View>
                </View>
        );

        return (
                <View style={styles.container}>
                        <Text style={styles.title}>My Bookings</Text>
                        {loading ? (
                                <ActivityIndicator size="large" />
                        ) : (
                                <FlatList
                                        data={bookings}
                                        keyExtractor={(item) => item._id}
                                        renderItem={renderItem}
                                />
                        )}

                        <Modal visible={editModalVisible} animationType="slide">
                                <View style={styles.midContainer}>
                                        <Text style={styles.title}>Edit Booking</Text>

                                        <Text>Date</Text>
                                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={local.dateInput}>
                                                <Text>{editDate.toDateString()}</Text>
                                        </TouchableOpacity>
                                        {showDatePicker && (
                                                <DateTimePicker
                                                        value={editDate}
                                                        mode="date"
                                                        display="default"
                                                        onChange={(event, selectedDate) => {
                                                                setShowDatePicker(false);
                                                                if (selectedDate) setEditDate(selectedDate);
                                                        }}
                                                />
                                        )}

                                        <Text>Room</Text>
                                        <View style={{ zIndex: 10 }}>
                                                <DropDownPicker
                                                        open={roomDropdownOpen}
                                                        value={editRoomId}
                                                        items={rooms.sort((a, b) => a.name.localeCompare(b.name)).map((room) => ({
                                                                label: room.name,
                                                                value: room._id,
                                                        }))}
                                                        setOpen={setRoomDropdownOpen}
                                                        setValue={setEditRoomId}
                                                        placeholder="Select room"
                                                        containerStyle={{ marginBottom: 16 }}
                                                />
                                        </View>

                                        <Text>Time Slot</Text>
                                        <View style={{ zIndex: 5 }}>
                                                <DropDownPicker
                                                        open={dropdownOpen}
                                                        value={editTimeSlot}
                                                        items={timeSlotOptions.map((label) => ({ label, value: label }))}
                                                        setOpen={setDropdownOpen}
                                                        setValue={setEditTimeSlot}
                                                        placeholder="Select time slot"
                                                        containerStyle={{ marginBottom: 16 }}
                                                />
                                        </View>

                                        <Text>Purpose</Text>
                                        <TextInput
                                                value={editPurpose}
                                                onChangeText={setEditPurpose}
                                                placeholder="Purpose"
                                                style={styles.input}
                                        />

                                        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                                                <Text style={styles.buttonText}>Save Changes</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                                <Text style={styles.link}>Cancel</Text>
                                        </TouchableOpacity>
                                </View>
                        </Modal>
                </View>
        );
}

const local = StyleSheet.create({
        card: {
                padding: 16,
                backgroundColor: '#f1f1f1',
                borderRadius: 8,
                marginBottom: 12,
        },
        title: { fontSize: 18, fontWeight: '600' },
        actionRow: {
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 12,
                gap: 12,
        },
        editBtn: {
                backgroundColor: '#007bff',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 4,
        },
        deleteBtn: {
                backgroundColor: '#dc3545',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 4,
        },
        dateInput: {
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                borderRadius: 6,
                marginBottom: 12,
        },
});

export default MyBookingsScreen;
