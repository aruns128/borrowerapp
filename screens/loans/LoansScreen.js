import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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

    const handleDelete = async () => {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this loan?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Deletion cancelled'),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                const response = await axios.delete(
                  `${BACKEND_API}/borrower/loans/${item._id}`,
                );
                if (response.data.success) {
                  Alert.alert('Success', 'Loan deleted successfully');
                  fetchLoans(); // Refresh the list after deletion
                } else {
                  Alert.alert('Error', response.data.message);
                }
              } catch (error) {
                console.error('Error deleting loan:', error);
                Alert.alert('Error', 'Failed to delete loan.');
              }
            },
            style: 'destructive',
          },
        ],
        {cancelable: true},
      );
    };

    const handleEdit = () => {
      navigation.navigate('Edit Loan', {editData: item});
    };

    return (
      <View style={styles.loanCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Borrower:</Text>
          <Text style={styles.value}>{item.borrower.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Principal:</Text>
          <Text style={styles.value}>₹{item.principal}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{item.status}</Text>
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
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <FontAwesome5
              name="trash"
              size={18}
              color={'white'}
              solid={false}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const createLoan = () => {
    navigation.navigate('Create Loan');
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6a11cb" />
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoansListingScreen;
