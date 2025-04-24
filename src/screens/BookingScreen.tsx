import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import auth from '../services/authService';
import styles from '../styles/globalStyles';

function BookingScreen({ route, navigation }) {
        const { room } = route.params;
        const [date, setDate] = useState(new Date());
        const [showPicker, setShowPicker] = useState(false);
        const [purpose, setPurpose] = useState('');
        const [token, setToken] = useState('');
        const [startTime, setStartTime] = useState(null);
        const [endTime, setEndTime] = useState(null);
        const [startOpen, setStartOpen] = useState(false);
        const [endOpen, setEndOpen] = useState(false);

        const [department, setDepartment] = useState(null);
        const [departmentOpen, setDepartmentOpen] = useState(false);
        const departmentOptions = [
                { label: 'Music Ministry', value: 'music' },
                { label: 'Technical', value: 'technical' },
                { label: 'Media', value: 'media' },
                { label: 'Welfare', value: 'welfare' },
                { label: 'Youth', value: 'youth' },
                { label: 'Hospitality', value: 'hospitality' },
                { label: 'Children Ministry', value: 'children' },
                { label: 'Others', value: 'others' },
        ];

        const timeOptions = Array.from({ length: 24 }, (_, i) => {
                const hour = i % 24;
                const date = new Date(0, 0, 0, hour);
                const label = date.toLocaleTimeString([], {
                        hour: '2-digit',
                        hour12: true,
                });

                const value = hour.toString().padStart(2, '0') + ':00';
                return { label, value };
        });

        useEffect(() => {
                const loadToken = async () => {
                        const storedToken = await auth.getToken();
                        setToken(storedToken || '');
                };
                loadToken();
        }, []);

        const handleBooking = async () => {
                if (!startTime || !endTime || !department) {
                        Alert.alert('Missing Info', 'Please fill out all fields.');
                        return;
                }

                const timeSlot = `${startTime} – ${endTime}`;

                try {
                        const res = await fetch('http://192.168.1.166:9000/api/bookings', {
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
                                        department,
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
                <View style={styles.container}>
                        <Text style={styles.title}>Booking for: {room?.name || 'N/A'}</Text>

                        <Text>Date</Text>
                        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
                                <Text>{date.toDateString()}</Text>
                        </TouchableOpacity>

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

                        {/* START TIME */}
                        <View style={{ zIndex: 1000 }}>
                                <Text style={{ marginTop: 16 }}>From</Text>
                                <DropDownPicker
                                        open={startOpen}
                                        value={startTime}
                                        items={timeOptions}
                                        setOpen={setStartOpen}
                                        setValue={setStartTime}
                                        setItems={() => { }}
                                        placeholder="Select start time"
                                        style={styles.input}
                                        dropDownContainerStyle={{ zIndex: 1000 }}
                                />
                        </View>

                        {/* END TIME */}
                        <View style={{ zIndex: 900 }}>
                                <Text style={{ marginTop: 16 }}>To</Text>
                                <DropDownPicker
                                        open={endOpen}
                                        value={endTime}
                                        items={timeOptions}
                                        setOpen={setEndOpen}
                                        setValue={setEndTime}
                                        setItems={() => { }}
                                        placeholder="Select end time"
                                        style={styles.input}
                                        dropDownContainerStyle={{ zIndex: 900 }}
                                />
                        </View>

                        {/* DEPARTMENT */}
                        <View style={{ zIndex: 800 }}>
                                <Text style={{ marginTop: 16 }}>Department</Text>
                                <DropDownPicker
                                        open={departmentOpen}
                                        value={department}
                                        items={departmentOptions}
                                        setOpen={setDepartmentOpen}
                                        setValue={setDepartment}
                                        setItems={() => { }}
                                        placeholder="Select your department"
                                        style={styles.input}
                                        dropDownContainerStyle={{ zIndex: 800 }}
                                />
                        </View>

                        <Text style={{ marginTop: 16 }}>Purpose</Text>
                        <TextInput
                                placeholder="Why are you booking?"
                                value={purpose}
                                onChangeText={setPurpose}
                                style={styles.input}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleBooking}>
                                <Text style={styles.buttonText}>Book Now</Text>
                        </TouchableOpacity>
                </View>
        );
}

export default BookingScreen;
