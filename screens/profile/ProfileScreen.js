// screens/ProfileScreen.js
import React from 'react';
import {View, Text, Button, StyleSheet, Image} from 'react-native';
import AvatarLogo from '../utils/AvatarLogo';

const ProfileScreen = ({navigation}) => {
  const handleLogout = () => {
    // Navigate back to the login screen
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <AvatarLogo title={'AK'} />

      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 24, marginBottom: 20},
  avatar: {width: 100, height: 100, borderRadius: 50, marginBottom: 20},
});

export default ProfileScreen;
