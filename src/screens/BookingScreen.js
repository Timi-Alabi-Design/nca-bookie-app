import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import auth from '../services/authService';

function BookingScreen({ route, navigation }) {
        const { room } = route.params;
        const [date, setDate] = useState(new Date());
        const [showPicker, setShowPicker] = useState(false);
        const [timeSlot, setTimeSlot] = useState('');
        const [purpose, setPurpose] = useState('');
        const [token, setToken] = useState('');

        useEffect(() => {
                const loadToken = async () => {
                        const storedToken = await auth.getToken();
                        setToken(storedToken || '');
                };
                loadToken();
        }, []);

        const handleBooking = async () => {
                try {
                        const res = await fetch('http://192.168.1.166/api/bookings', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                        roomId: room._id,
                                        date: date.toISOString().split('T')[0],
                                        timeSlot,
                                        purpose,
                                }),
                        });

                        const data = await res.json();
                        if (res.status === 201) {
                                Alert.alert('Success', 'Booking confirmed!');
                                navigation.goBack();
                        } else {
                                Alert.alert('Error', data.message || 'Booking failed.');
                        }
                } catch (err) {
                        Alert.alert('Error', 'An unexpected error occurred.');
                        console.error(err);
                }
        };

        return (
                <View style={{ padding: 20 }}>
                        <Text style={{ fontSize: 20, marginBottom: 10 }}>Booking for: {room?.name || 'N/A'}</Text>

                        <Text>Date</Text>
                        <Button title={date.toDateString()} onPress={() => setShowPicker(true)} />

                        {showPicker && typeof DateTimePicker !== 'undefined' && (
                                <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                                setShowPicker(false);
                                                if (selectedDate) setDate(selectedDate);
                                        }}
                                />
                        )}

                        <Text style={{ marginTop: 16 }}>Time Slot</Text>
                        <TextInput
                                placeholder="e.g. 10:00AM - 12:00PM"
                                value={timeSlot}
                                onChangeText={setTimeSlot}
                                style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
                        />

                        <Text>Purpose</Text>
                        <TextInput
                                placeholder="Why are you booking?"
                                value={purpose}
                                onChangeText={setPurpose}
                                style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
                        />

                        <Button title="Book Now" onPress={handleBooking} />
                </View>
        );
}

export default BookingScreen;
