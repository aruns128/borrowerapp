import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const AvatarLogo = ({title, type, logoSource}) => {
  return (
    <View style={[styles.avatar, type === 'logo' && styles.noBackground]}>
      {type === 'logo' ? (
        <Image source={logoSource} style={styles.logoImage} />
      ) : (
        <Text style={styles.avatarText}>{title}</Text>
      )}
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
  noBackground: {
    backgroundColor: 'transparent', // removes background color for logo type
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    color: '#fff', // text color
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AvatarLogo;
