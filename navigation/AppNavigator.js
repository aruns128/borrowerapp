import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LoanDetailsScreen from '../screens/loans/LoanDetailsScreen';
import CreateLoanScreen from '../screens/loans/CreateLoanScreen';
import LoansScreen from '../screens/loans/LoansScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainHome" // Renamed screen
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Loan Details"
          component={LoanDetailsScreen}
          options={{headerShown: true}} // Set header if needed
        />
        <Stack.Screen
          name="Create Loan"
          component={CreateLoanScreen}
          options={{headerShown: true}} // Set header if needed
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
