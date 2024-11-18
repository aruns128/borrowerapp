import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {BACKEND_API} from '@env';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  // Fetch data from the API
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${BACKEND_API}/borrower/dashboard`);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        alert('Failed to fetch data');
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch loans on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, []),
  );

  // Toggle section visibility
  const toggleSection = lenderName => {
    setExpandedSections(prev => ({
      ...prev,
      [lenderName]: !prev[lenderName],
    }));
  };

  // Render borrower item
  const renderBorrower = ({item}) => (
    <View style={styles.borrowerCard}>
      <Text style={styles.borrowerName}>{item.borrowerName}</Text>
      <Text style={styles.borrowerPrincipal}>
        Total Principal: ₹{item.totalPrincipalAmount.toLocaleString()}
      </Text>
    </View>
  );

  // Render lender item
  const renderLender = ({item}) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => toggleSection(item.lenderName)}>
        <View style={styles.cardContent}>
          <Text style={styles.lenderName}>{item.lenderName}</Text>
          <Text style={styles.totalPrincipal}>
            Total Principal: ₹{item.totalPrincipal.toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
      {expandedSections[item.lenderName] && (
        <FlatList
          data={item.borrowers}
          renderItem={renderBorrower}
          keyExtractor={(borrower, index) => index.toString()}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lender Dashboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          renderItem={renderLender}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'flex-start', // Align text content to the left
  },
  lenderName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4, // Add spacing between name and amount
  },
  totalPrincipal: {
    fontSize: 16,
    color: '#333',
  },
  borrowerCard: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    marginVertical: 4,
    borderRadius: 6,
    marginLeft: 16,
  },
  borrowerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  borrowerPrincipal: {
    fontSize: 14,
    color: '#555',
  },
});

export default Dashboard;
