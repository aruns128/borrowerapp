import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import Animated, {FadeIn} from 'react-native-reanimated';
import {BACKEND_API} from '@env';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');

      setTimeout(() => {
        if (token) {
          navigation.replace('MainHome');
        } else {
          navigation.replace('Login');
        }
      }, 2000); // 5-second delay before navigating
    };

    checkToken();
  }, [navigation]);
  console.log(BACKEND_API);

  return (
    <ImageBackground
      source={require('../../assets/images/background-image.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.container}>
        {/* Welcome Text with animation */}
        <Animated.Text
          entering={FadeIn.duration(1000)}
          style={styles.welcomeText}>
          Welcome to the Borrower Management Application!
        </Animated.Text>

        {/* Description Text with highlight animations */}
        <Animated.Text
          entering={FadeIn.delay(500).duration(1000)}
          style={styles.descriptionText}>
          This application is used to manage the{' '}
          <Text style={styles.highlight}>Loans</Text>,{' '}
          <Text style={styles.highlight}>Borrower</Text>, and{' '}
          <Text style={styles.highlight}>Lender</Text> details efficiently.
        </Animated.Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for text visibility
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 26,
  },
  highlight: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});

export default SplashScreen;
