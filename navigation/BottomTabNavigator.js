import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#6875E0', // Green background for the tabs
        },
        tabBarInactiveTintColor: '#171D35', // Inactive icons are grey
        tabBarActiveTintColor: '#FFFFFF', // Active icons are white
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="home" size={size} color={color} solid={false} />
          ),
        }}
      />
      <Tab.Screen
        name="Loans"
        component={ProfileScreen} // You might want to replace this with a LoansScreen
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome5
              name="money-bill-alt"
              size={size}
              color={color}
              solid={false}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="user" size={size} color={color} solid={false} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
