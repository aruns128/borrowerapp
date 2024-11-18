import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import axios from 'axios';
import {BACKEND_API} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {
  getNextDueDate,
  getFormatDate,
  getDayCountBetweenDates,
} from '../utils/Helper';

const LoansListingScreen = ({navigation}) => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]); // For search results
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  // Fetch loans function
  const fetchLoans = async () => {
    try {
      const userId = await AsyncStorage.getItem('authToken');
      if (!userId) {
        navigation.replace('Login');
        return;
      }

      const response = await axios.get(`${BACKEND_API}/borrower/loans`, {
        params: {id: userId},
      });

      if (response.data.success) {
        const sortedLoans = response.data.loans.sort((a, b) => {
          const daysA = getDayCountBetweenDates(a.startDate);
          const daysB = getDayCountBetweenDates(b.startDate);
          return daysA - daysB;
        });

        setLoans(sortedLoans);
        setFilteredLoans(sortedLoans); // Initialize filtered loans
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

  // Fetch loans on screen focus
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchLoans();
    }, []),
  );

  // Filter loans based on search query
  const handleSearch = text => {
    setSearchQuery(text);
    if (text === '') {
      setFilteredLoans(loans);
    } else {
      const filtered = loans.filter(loan =>
        loan.borrower.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredLoans(filtered);
    }
  };

  const renderLoanItem = ({item}) => {
    const daysUntilDue = getDayCountBetweenDates(item.startDate);
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
          <Text style={styles.label}>Next Due Date:</Text>
          <Text style={[styles.value, dueDateStyle]}>
            {getNextDueDate(item.startDate)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Next Due In Days:</Text>
          <Text
            style={[styles.value, dueDateStyle]}>{`${daysUntilDue} days`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const createLoan = () => {
    navigation.navigate('Create Loan');
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
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by borrower name"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {filteredLoans.length === 0 ? (
        <View style={styles.noLoansContainer}>
          <Text style={styles.noLoansText}>No loans available</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredLoans}
          keyExtractor={item => item._id}
          renderItem={renderLoanItem}
          contentContainerStyle={styles.listContainer}
        />
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
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
    color: 'red',
  },
  greenValue: {
    color: 'green',
  },
});

export default LoansListingScreen;
