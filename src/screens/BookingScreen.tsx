import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import auth from '../services/authService';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';


function BookingScreen({ route, navigation }) {
        const { room } = route.params;
        const [date, setDate] = useState(new Date());
        const [showPicker, setShowPicker] = useState(false);
        const [purpose, setPurpose] = useState('');
        const [token, setToken] = useState('');
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const [timeSlot, setTimeSlot] = useState(null);
        const [dropdownItems, setDropdownItems] = useState([
                { label: '8:00 AM – 10:00 AM', value: '8:00 AM – 10:00 AM' },
                { label: '10:00 AM – 12:00 PM', value: '10:00 AM – 12:00 PM' },
                { label: '12:00 PM – 2:00 PM', value: '12:00 PM – 2:00 PM' },
                { label: '2:00 PM – 4:00 PM', value: '2:00 PM – 4:00 PM' },
                { label: '4:00 PM – 6:00 PM', value: '4:00 PM – 6:00 PM' },
                { label: '6:00 PM – 8:00 PM', value: '6:00 PM – 8:00 PM' },
        ]);


        useEffect(() => {
                const loadToken = async () => {
                        const storedToken = await auth.getToken();
                        setToken(storedToken || '');
                };
                loadToken();
        }, []);

        const handleBooking = async () => {
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
                        <TouchableOpacity
                                onPress={() => setShowPicker(true)}
                                style={{
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        padding: 12,
                                        borderRadius: 6,
                                        marginBottom: 12,
                                }}
                        >
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

                        <Text style={{ marginTop: 16 }}>Time Slot</Text>
                        <View
                                style={{
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        borderRadius: 6,
                                        marginVertical: 8,
                                        height: 48, // ✅ tighter height
                                        justifyContent: 'center',
                                        paddingHorizontal: 8,
                                        zIndex: 1
                                }}
                        >
                                <DropDownPicker
                                        open={dropdownOpen}
                                        value={timeSlot}
                                        items={[
                                                { label: '8:00 AM – 10:00 AM', value: '8:00 AM – 10:00 AM' },
                                                { label: '10:00 AM – 12:00 PM', value: '10:00 AM – 12:00 PM' },
                                                { label: '12:00 PM – 2:00 PM', value: '12:00 PM – 2:00 PM' },
                                                { label: '2:00 PM – 4:00 PM', value: '2:00 PM – 4:00 PM' },
                                                { label: '4:00 PM – 6:00 PM', value: '4:00 PM – 6:00 PM' },
                                                { label: '6:00 PM – 8:00 PM', value: '6:00 PM – 8:00 PM' },
                                        ]}
                                        setOpen={setDropdownOpen}
                                        setValue={setTimeSlot}
                                        setItems={setDropdownItems}
                                        placeholder="Select a time slot"
                                        style={{ marginBottom: 16 }}
                                        dropDownContainerStyle={{ zIndex: 9999 }}
                                />

                        </View>



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
