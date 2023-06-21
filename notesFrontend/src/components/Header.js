import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React from 'react';

const Header = () => {
  return (
    <View style={{}}>
      <StatusBar
        animated={true}
        backgroundColor="#252525"
        barStyle="light-content"
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
