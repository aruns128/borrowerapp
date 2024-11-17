import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Reusable Date Picker Input component
const DatePickerInput = ({label, initialDate, onDateChange}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());

  // Function to format date in DD-MM-YYYY format
  const formatDate = date => {
    const day = ('0' + date.getDate()).slice(-2); // Ensure two digits for day
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure two digits for month
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (event, date) => {
    if (event.type === 'set') {
      // Update the selected date if set is pressed
      const currentDate = date || selectedDate;
      setShowDatePicker(false);
      setSelectedDate(currentDate);
      onDateChange(currentDate); // Pass the selected date to the parent
    } else if (event.type === 'dismissed') {
      // Close the date picker when the user cancels
      setShowDatePicker(false);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(prev => !prev); // Toggle visibility of date picker
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={toggleDatePicker}>
        <TextInput
          style={styles.input}
          value={formatDate(selectedDate)} // Display the formatted date
          editable={false} // Prevent manual input
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default DatePickerInput;
