import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import {BACKEND_API} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native'; // Import useFocusEffect
import {
  getNextDueDate,
  getFormatDate,
  getDayCountBetweenDates,
} from '../utils/Helper';

const LoansListingScreen = ({navigation}) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null); // Reference to the FlatList

  // Function to fetch loans
  const fetchLoans = async () => {
    try {
      // Get user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('authToken');
      if (!userId) {
        navigation.replace('Login');
        return;
      }

      // Fetch loans using user ID
      const response = await axios.get(`${BACKEND_API}/borrower/loans`, {
        params: {id: userId},
      });
      if (response.data.success) {
        setLoans(response.data.loans);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
      Alert.alert('Error', 'Failed to fetch loans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch loans whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true); // Reset loading before fetching
      fetchLoans();
    }, []),
  );

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
    }
  };

  const renderLoanItem = ({item}) => {
    // Calculate the number of days left for the next due date
    const daysUntilDue = getDayCountBetweenDates(
      getNextDueDate(item.startDate),
    );

    console.log(daysUntilDue, 'daysUntilDue');

    // Apply red or green color based on the number of days
    const dueDateStyle =
      daysUntilDue <= 30 ? styles.redValue : styles.greenValue;

    return (
      <TouchableOpacity
        style={styles.loanCard}
        onPress={() => navigation.navigate('Loan Details', {loan: item})}>
        <View style={styles.row}>
          <Text style={styles.label}>Borrower:</Text>
          <Text style={styles.value}>{item.borrower.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Principal:</Text>
          <Text style={styles.value}>₹{item.principal}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Interest/Month:</Text>
          <Text style={styles.value}>₹{item.interestPerMonth}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Remaining Interest:</Text>
          <Text style={styles.value}>₹{item.remainingInterest}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Amount:</Text>
          <Text style={styles.value}>₹{item.totalAmountForElapsedMonths}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>{getFormatDate(item.startDate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Next due date:</Text>
          <Text style={[styles.value, dueDateStyle]}>
            {getNextDueDate(item.startDate)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const createLoan = () => {
    navigation.navigate('Create Loan'); // Navigate to the CreateLoan screen
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading loans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Loans</Text>
      {loans.length === 0 ? (
        <View style={styles.noLoansContainer}>
          <Text style={styles.noLoansText}>No loans available</Text>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef} // Attach the ref to FlatList
            data={loans}
            keyExtractor={item => item._id}
            renderItem={renderLoanItem}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}

      {/* Create Loan Button */}
      <TouchableOpacity style={styles.createLoanButton} onPress={createLoan}>
        <Text style={styles.createLoanButtonText}>Create Loan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#6a11cb',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  loanCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6a11cb',
  },
  value: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#999',
  },
  noLoansContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLoansText: {
    fontSize: 18,
    color: '#999',
  },
  createLoanButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#6a11cb',
    borderRadius: 50,
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  createLoanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  redValue: {
    color: 'red', // Make the "Next Due Date" red when within 30 days
  },
  greenValue: {
    color: 'green', // Make the "Next Due Date" green when more than 30 days away
  },
});

export default LoansListingScreen;
