import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AvatarLogo from './AvatarLogo';
import {BACKEND_API} from '@env';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const BACKEND_URL = process.env['BACKEND_API'];
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        email,
        password,
      });

      const data = response.data;

      if (response.status === 200) {
        Alert.alert('Login Successful!', `Welcome, ${data.email}`);
        navigation.replace('MainHome');
      } else {
        Alert.alert(
          'Login Failed',
          data.message || 'Invalid username or password.',
        );
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        Alert.alert(
          'Login Failed',
          error.response.data.message || 'Invalid username or password.',
        );
      } else {
        // Error in making request
        Alert.alert('Error', 'Unable to connect to the server.');
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <AvatarLogo title="BM" />
        </View>
        <Text style={styles.title}>Login</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    margin: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6875E0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default LoginScreen;
