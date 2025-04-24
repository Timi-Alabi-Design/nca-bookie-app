import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { AuthContext } from '../context/AuthContext';

const API_URL = 'http://192.168.1.166:9000/api/bookings';

export default function MyBookingsScreen() {
        const { token } = useContext(AuthContext);
        const [bookings, setBookings] = useState([]);
        const [loading, setLoading] = useState(true);

        const [editModalVisible, setEditModalVisible] = useState(false);
        const [selectedBooking, setSelectedBooking] = useState(null);

        const [editDate, setEditDate] = useState(new Date());
        const [showDatePicker, setShowDatePicker] = useState(false);
        const [editPurpose, setEditPurpose] = useState('');
        const [editTimeSlot, setEditTimeSlot] = useState('');
        const [dropdownOpen, setDropdownOpen] = useState(false);

        const timeSlotOptions = [
                '8:00 AM – 10:00 AM', '10:00 AM – 12:00 PM', '12:00 PM – 2:00 PM',
                '2:00 PM – 4:00 PM', '4:00 PM – 6:00 PM', '6:00 PM – 8:00 PM'
        ];

        useEffect(() => {
                const fetchBookings = async () => {
                        try {
                                const res = await fetch(`${API_URL}/my`, {
                                        headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${token}`,
                                        },
                                });

                                const data = await res.json();
                                setBookings(data);
                        } catch (err) {
                                console.error('Failed to fetch bookings:', err);
                        } finally {
                                setLoading(false);
                        }
                };

                if (token) fetchBookings();
        }, [token]);

        const handleDelete = async (id: string) => {
                Alert.alert('Confirm', 'Are you sure you want to delete this booking?', [
                        { text: 'Cancel' },
                        {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: async () => {
                                        try {
                                                await fetch(`${API_URL}/${id}`, {
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

        const openEditModal = (booking: any) => {
                setSelectedBooking(booking);
                setEditDate(new Date(booking.date));
                setEditPurpose(booking.purpose);
                setEditTimeSlot(booking.timeSlot);
                setEditModalVisible(true);
        };

        const handleUpdate = async () => {
                if (!selectedBooking) return;

                try {
                        const res = await fetch(`${API_URL}/${selectedBooking._id}`, {
                                method: 'PUT',
                                headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                        date: editDate.toISOString().split('T')[0],
                                        timeSlot: editTimeSlot,
                                        purpose: editPurpose,
                                        roomId: selectedBooking.roomId._id,
                                }),
                        });

                        const updated = await res.json();
                        setBookings((prev) =>
                                prev.map((b) => (b._id === updated._id ? updated : b))
                        );
                        setEditModalVisible(false);
                } catch (err) {
                        Alert.alert('Error', 'Failed to update booking');
                }
        };

        const renderItem = ({ item }: any) => (
                <View style={styles.card}>
                        <Text style={styles.title}>{item.roomId?.name || 'Unnamed Room'}</Text>
                        <Text>Date: {item.date}</Text>
                        <Text>Time Slot: {item.timeSlot}</Text>
                        <Text>Purpose: {item.purpose}</Text>

                        <View style={styles.actionRow}>
                                <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
                                        <Text style={{ color: 'white' }}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
                                        <Text style={{ color: 'white' }}>Delete</Text>
                                </TouchableOpacity>
                        </View>
                </View>
        );

        return (
                <View style={styles.container}>
                        <Text style={styles.header}>My Bookings</Text>
                        {loading ? (
                                <ActivityIndicator size="large" />
                        ) : (
                                <FlatList
                                        data={bookings}
                                        keyExtractor={(item) => item._id}
                                        renderItem={renderItem}
                                />
                        )}

                        {/* EDIT MODAL */}
                        <Modal visible={editModalVisible} animationType="slide">
                                <View style={styles.modal}>
                                        <Text style={styles.modalTitle}>Edit Booking</Text>

                                        <Text>Date</Text>
                                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
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

                                        <Text style={{ marginTop: 12 }}>Time Slot</Text>
                                        <DropDownPicker
                                                open={dropdownOpen}
                                                value={editTimeSlot}
                                                items={timeSlotOptions.map((label) => ({ label, value: label }))}
                                                setOpen={setDropdownOpen}
                                                setValue={setEditTimeSlot}
                                                placeholder="Select time slot"
                                                containerStyle={{ marginVertical: 8 }}
                                        />

                                        <Text>Purpose</Text>
                                        <TextInput
                                                value={editPurpose}
                                                onChangeText={setEditPurpose}
                                                placeholder="Purpose"
                                                style={styles.input}
                                        />

                                        <Button title="Save Changes" onPress={handleUpdate} />
                                        <Button title="Cancel" color="gray" onPress={() => setEditModalVisible(false)} />
                                </View>
                        </Modal>
                </View>
        );
}

const styles = StyleSheet.create({
        container: { padding: 16, flex: 1 },
        header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
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
        modal: {
                padding: 20,
                marginTop: 60,
                flex: 1,
        },
        modalTitle: {
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 20,
        },
        input: {
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 6,
                padding: 10,
                marginVertical: 8,
        },
        dateInput: {
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                borderRadius: 6,
                marginBottom: 8,
        },
});
