// screens/LoansScreen.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const LoansScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>LoansScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 24},
});

export default LoansScreen;
