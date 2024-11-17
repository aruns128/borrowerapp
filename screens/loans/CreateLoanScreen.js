import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import DatePickerInput from '../utils/DatePickerInput';

import {BACKEND_API} from '@env';

const CreateLoanScreen = ({navigation}) => {
  // Single state for form values and errors
  const [formValues, setFormValues] = useState({
    borrowerName: '',
    borrowerPhoneNumber: '',
    borrowerAlternativeNumber: '',
    borrowerAddress: '',
    borrowerLoanDocument: '',
    lenderName: '',
    principal: '',
    ratePerUnit: '',
    period: '',
    periodType: 'month',
    startDate: new Date(),
    partialPayment: '',
    interestPeriodType: 'year',
  });

  const [errors, setErrors] = useState({}); // Validation errors

  // Function to handle changes in form inputs
  const handleInputChange = (key, value) => {
    setFormValues({
      ...formValues,
      [key]: value,
    });
  };

  // Form validation
  const validateFields = () => {
    const newErrors = {};
    if (!formValues.borrowerName) newErrors.borrowerName = true;
    if (!formValues.borrowerPhoneNumber) newErrors.borrowerPhoneNumber = true;
    if (!formValues.borrowerAddress) newErrors.borrowerAddress = true;
    if (!formValues.principal) newErrors.principal = true;
    if (!formValues.ratePerUnit) newErrors.ratePerUnit = true;
    if (!formValues.period) newErrors.period = true;
    if (!formValues.periodType) newErrors.periodType = true;
    if (!formValues.startDate) newErrors.startDate = true;
    if (!formValues.lenderName) newErrors.lenderName = true;
    return newErrors;
  };

  // Form submission handler
  const handleSubmit = async () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Validation Error', 'Please fill all required fields!');
      return;
    }

    // Prepare the data for submission
    const loanData = {
      borrowerName: formValues.borrowerName,
      borrowerPhoneNumber: formValues.borrowerPhoneNumber,
      borrowerAlternativeNumber: formValues.borrowerAlternativeNumber,
      borrowerAddress: formValues.borrowerAddress,
      borrowerLoanDocument: formValues.borrowerLoanDocument, // Assuming this is the file name
      lenderName: formValues.lenderName,
      principal: formValues.principal,
      ratePerUnit: formValues.ratePerUnit,
      period: formValues.period,
      periodType: formValues.periodType,
      startDate: formValues.startDate.toISOString(), // Ensure date is in ISO format
      partialPayment: formValues.partialPayment,
      interestPeriodType: formValues.interestPeriodType,
    };

    try {
      // Send the POST request using axios
      const response = await axios.post(
        `${BACKEND_API}/borrower/create-loan`,
        loanData,
      );

      // Handle successful submission
      if (response.status === 200) {
        Alert.alert('Success', 'Loan details submitted successfully!');
        setErrors({}); // Clear errors on success
        setFormValues({
          borrowerName: '',
          borrowerPhoneNumber: '',
          borrowerAlternativeNumber: '',
          borrowerAddress: '',
          borrowerLoanDocument: '',
          lenderName: '',
          principal: '',
          ratePerUnit: '',
          period: '',
          periodType: 'month',
          startDate: new Date(),
          partialPayment: '',
          interestPeriodType: 'year',
        }); // Reset form values
      }
    } catch (error) {
      console.error('Error submitting loan data:', error);
      Alert.alert('Error', 'Failed to submit loan details. Please try again.');
    }
  };

  // Handle document selection
  const handleDocumentSelection = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Restrict to PDF files only
      });
      handleInputChange('borrowerLoanDocument', res[0].name);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        Alert.alert('Error', 'Failed to select document. Please try again.');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background-image.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.detailsContainer}>
          {/* Borrower Details */}
          <Text style={styles.label}>
            Borrower's Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholderTextColor="#A9A9A9"
            style={[
              styles.input,
              errors.borrowerName && styles.inputError, // Highlight error
            ]}
            placeholder="Enter Borrower's Name"
            value={formValues.borrowerName}
            onChangeText={text => handleInputChange('borrowerName', text)}
          />

          <Text style={styles.label}>
            Borrower's Phone Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholderTextColor="#A9A9A9"
            style={[
              styles.input,
              errors.borrowerPhoneNumber && styles.inputError,
            ]}
            placeholder="Enter Borrower's Phone Number"
            value={formValues.borrowerPhoneNumber}
            onChangeText={text =>
              handleInputChange('borrowerPhoneNumber', text)
            }
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Borrower's Alternative Number</Text>
          <TextInput
            placeholderTextColor="#A9A9A9"
            style={styles.input}
            placeholder="Enter Borrower's Alternative Number"
            value={formValues.borrowerAlternativeNumber}
            onChangeText={text =>
              handleInputChange('borrowerAlternativeNumber', text)
            }
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>
            Borrower's Address <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholderTextColor="#A9A9A9"
            style={[styles.input, errors.borrowerAddress && styles.inputError]}
            placeholder="Enter Borrower's Address"
            value={formValues.borrowerAddress}
            onChangeText={text => handleInputChange('borrowerAddress', text)}
          />

          {/* Borrower's Loan Document */}
          <Text style={styles.label}>Upload Loan Document</Text>
          <View style={styles.row}>
            <Text style={styles.text}>
              {formValues.borrowerLoanDocument || 'No document uploaded'}
            </Text>
            <TouchableOpacity
              style={[styles.uploadButton, {backgroundColor: '#6875E0'}]}
              onPress={handleDocumentSelection}>
              <Icon name="upload" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Loan Details */}
          <Text style={styles.label}>
            Lender's Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholderTextColor="#A9A9A9"
            style={[styles.input, errors.lenderName && styles.inputError]}
            placeholder="Enter Lender's Name"
            value={formValues.lenderName}
            onChangeText={text => handleInputChange('lenderName', text)}
          />

          <Text style={styles.label}>
            Principal Amount <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholderTextColor="#A9A9A9"
            style={[styles.input, errors.principal && styles.inputError]}
            placeholder="Enter Principal Amount"
            value={formValues.principal}
            onChangeText={text => handleInputChange('principal', text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>
            Rate Per Unit <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholderTextColor="#A9A9A9"
            style={[styles.input, errors.ratePerUnit && styles.inputError]}
            placeholder="Enter Rate Per Unit"
            value={formValues.ratePerUnit}
            onChangeText={text => handleInputChange('ratePerUnit', text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>
            Period <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholderTextColor="#A9A9A9"
            style={[styles.input, errors.period && styles.inputError]}
            placeholder="Enter Period"
            value={formValues.period}
            onChangeText={text => handleInputChange('period', text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>
            Period Type <Text style={styles.required}>*</Text>
          </Text>
          <Picker
            selectedValue={formValues.periodType}
            onValueChange={itemValue =>
              handleInputChange('periodType', itemValue)
            }
            style={[styles.picker, errors.periodType && styles.inputError]}>
            <Picker.Item label="Month" value="month" />
            <Picker.Item label="Year" value="year" />
          </Picker>

          <DatePickerInput
            label="Start Date"
            initialDate={formValues.startDate}
            onDateChange={date => handleInputChange('startDate', date)}
          />

          <Text style={styles.label}>Partial Payment</Text>
          <TextInput
            placeholderTextColor="#A9A9A9"
            style={styles.input}
            placeholder="Enter Partial Payment"
            value={formValues.partialPayment}
            onChangeText={text => handleInputChange('partialPayment', text)}
            keyboardType="numeric"
          />

          <Text style={styles.label}>
            Payment Period Type <Text style={styles.required}>*</Text>
          </Text>
          <Picker
            selectedValue={formValues.interestPeriodType}
            onValueChange={itemValue =>
              handleInputChange('interestPeriodType', itemValue)
            }
            style={[
              styles.picker,
              errors.interestPeriodType && styles.inputError,
            ]}>
            <Picker.Item label="Month" value="month" />
            <Picker.Item label="Year" value="year" />
          </Picker>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, {backgroundColor: '#6875E0'}]}
            onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  required: {
    color: 'red',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadButton: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
});

export default CreateLoanScreen;
