import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BACKEND_API} from '@env';

const ProfileScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // Animation

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          navigation.replace('Login');
          return;
        }

        const response = await axios.get(`${BACKEND_API}/auth/user`, {
          headers: {Authorization: `Bearer ${token}`},
        });

        setUser(response.data.user);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error fetching user details:', error);
        Alert.alert('Error', 'Failed to fetch user details. Please try again.');
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_API}/auth/logout`);
      await AsyncStorage.removeItem('authToken');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Failed', 'Unable to log out. Please try again.');
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ImageBackground
          source={require('../../assets/images/background-image.png')}
          style={styles.imageBackground}
          resizeMode="cover">
          <View style={styles.overlay} />
          <Animated.View style={{opacity: fadeAnim}}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.username.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </Animated.View>
        </ImageBackground>
      </View>

      <ScrollView style={styles.detailsContainer}>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Phone</Text>
          <Text style={styles.detailValue}>{user.number}</Text>
        </View>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Address</Text>
          <Text style={styles.detailValue}>{user.address}</Text>
        </View>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Joined</Text>
          <Text style={styles.detailValue}>
            {new Date(user.createdAt).toDateString()}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f7f8fa'},
  headerContainer: {
    height: 250,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imageBackground: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  avatarContainer: {alignItems: 'center', marginTop: 50},
  avatar: {
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 3},
    elevation: 5,
  },
  avatarText: {fontSize: 30, fontWeight: 'bold', color: '#6a11cb'},
  username: {fontSize: 22, fontWeight: '600', color: '#fff'},
  email: {fontSize: 16, color: '#ddd', marginTop: 5},
  detailsContainer: {
    padding: 20,
  },
  detailCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6a11cb',
    marginBottom: 5,
  },
  detailValue: {fontSize: 16, color: '#333'},
  logoutButton: {
    backgroundColor: '#FF5252',
    margin: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
  },
  loadingText: {fontSize: 18, color: '#999'},
});

export default ProfileScreen;
