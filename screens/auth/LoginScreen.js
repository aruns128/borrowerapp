import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import AvatarLogo from '../utils/AvatarLogo';
import {BACKEND_API} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {CircleFade, Flow} from 'react-native-animated-spinkit';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_API}/auth/login`, {
        email,
        password,
      });

      const data = response.data;

      if (response.status === 200) {
        await AsyncStorage.setItem('authToken', data.user._id);
        navigation.replace('MainHome');
      } else {
        Alert.alert(
          'Login Failed',
          data.message || 'Invalid username or password.',
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        error.response
          ? error.response.data.message
          : 'Unable to connect to the server.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Top 25% Background Image */}
      <ImageBackground
        source={require('../../assets/images/background-image.png')}
        style={styles.topBackground}
        resizeMode="cover"
      />

      {/* Bottom 75% Login Card */}
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <AvatarLogo
            type="logo"
            logoSource={require('../../assets/images/app_logo.png')}
          />
        </View>
        <Text style={styles.title}>Login</Text>

        {/* Email Label and Input */}
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          placeholderTextColor="#A9A9A9"
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Label and Input */}
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          placeholderTextColor="#A9A9A9"
          placeholder="Enter your password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Login</Text>
            {loading && <CircleFade size={18} color="#fff" />}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBackground: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 0.55,
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignSelf: 'center',
    marginTop: -20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 5,
    color: '#333',
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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
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
