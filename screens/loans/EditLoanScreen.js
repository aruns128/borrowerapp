import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DatePickerInput from '../utils/DatePickerInput';

const EditLoanScreen = ({route, navigation}) => {
  const {editData} = route.params; // Pass the data when navigating to this screen

  const [formValues, setFormValues] = useState({
    borrowerName: editData.borrower.name || '',
    borrowerPhoneNumber: editData.borrower.phoneNumber || '',
    borrowerAlternativeNumber: editData.borrower.alternativeNumber || '',
    borrowerAddress: editData.borrower.address || '',
    borrowerLoanDocument: editData.borrower.loanDocument || '',
    lenderName: editData.lender.name || '',
    principal: editData.principal.toString(),
    ratePerUnit: editData.ratePerUnit.toString(),
    period: editData.period.toString(),
    periodType: editData.periodType || 'month',
    startDate: new Date(editData.startDate),
    partialPayment: editData.partialPayment.toString(),
    interestPeriodType: editData.interestPeriodType || 'year',
  });

  const handleInputChange = (key, value) => {
    setFormValues({...formValues, [key]: value});
  };

  const handleSave = () => {
    // Here, you would handle saving the updated data, e.g., make an API call
    console.log('Updated Data:', formValues);
    // navigation.navigate('MainHome');
    // navigation.navigate('Loans');
    navigation.navigate('MainHome', {screen: 'Loans'});
  };

  return (
    <View style={styles.container}>
      {/* Edit Modal */}
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        <Text style={styles.heading}>Edit Loan Details</Text>

        {/* Borrower Name */}
        <Text style={styles.label}>Borrower's Name</Text>
        <TextInput
          style={styles.input}
          value={formValues.borrowerName}
          onChangeText={text => handleInputChange('borrowerName', text)}
        />

        {/* Phone Number */}
        <Text style={styles.label}>Borrower's Phone Number</Text>
        <TextInput
          style={styles.input}
          value={formValues.borrowerPhoneNumber}
          keyboardType="phone-pad"
          onChangeText={text => handleInputChange('borrowerPhoneNumber', text)}
        />

        {/* Alternative Number */}
        <Text style={styles.label}>Alternative Number</Text>
        <TextInput
          style={styles.input}
          value={formValues.borrowerAlternativeNumber}
          onChangeText={text =>
            handleInputChange('borrowerAlternativeNumber', text)
          }
        />

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={formValues.borrowerAddress}
          onChangeText={text => handleInputChange('borrowerAddress', text)}
        />

        {/* Lender Name */}
        <Text style={styles.label}>Lender's Name</Text>
        <TextInput
          style={styles.input}
          value={formValues.lenderName}
          onChangeText={text => handleInputChange('lenderName', text)}
        />

        {/* Principal */}
        <Text style={styles.label}>Principal Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formValues.principal}
          onChangeText={text => handleInputChange('principal', text)}
        />

        {/* Rate Per Unit */}
        <Text style={styles.label}>Rate Per Unit</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formValues.ratePerUnit}
          onChangeText={text => handleInputChange('ratePerUnit', text)}
        />

        {/* Period */}
        <Text style={styles.label}>Period</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formValues.period}
          onChangeText={text => handleInputChange('period', text)}
        />

        {/* Period Type */}
        <Text style={styles.label}>Period Type</Text>
        <Picker
          selectedValue={formValues.periodType}
          onValueChange={value => handleInputChange('periodType', value)}>
          <Picker.Item label="Month" value="month" />
          <Picker.Item label="Year" value="year" />
        </Picker>

        {/* Start Date */}
        <DatePickerInput
          label="Start Date"
          initialDate={formValues.startDate}
          onDateChange={date => handleInputChange('startDate', date)}
        />

        {/* Partial Payment */}
        <Text style={styles.label}>Partial Payment</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formValues.partialPayment}
          onChangeText={text => handleInputChange('partialPayment', text)}
        />

        {/* Interest Period Type */}
        <Text style={styles.label}>Interest Period Type</Text>
        <Picker
          selectedValue={formValues.interestPeriodType}
          onValueChange={value =>
            handleInputChange('interestPeriodType', value)
          }>
          <Picker.Item label="Year" value="year" />
          <Picker.Item label="Month" value="month" />
        </Picker>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate('MainHome', {screen: 'Loans'})}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
  detailsContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditLoanScreen;
