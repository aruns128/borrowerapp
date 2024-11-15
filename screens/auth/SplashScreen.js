import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Animated, {FadeIn} from 'react-native-reanimated';

const SplashScreen = ({navigation}) => {
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

        {/* Go to Login Button */}
        <TouchableOpacity
          style={styles.gotoLoginButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.gotoLoginText}>Go to Login</Text>
        </TouchableOpacity>
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
  gotoLoginButton: {
    backgroundColor: '#416FDF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  gotoLoginText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SplashScreen;
