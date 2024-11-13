import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AvatarLogo = ({title}) => {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // makes the view circular
    backgroundColor: '#6875E0', // background color of the avatar
    justifyContent: 'center', // centers the text vertically
    alignItems: 'center', // centers the text horizontally
  },
  avatarText: {
    color: '#fff', // text color
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AvatarLogo;
