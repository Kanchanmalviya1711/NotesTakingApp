import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import Header from '../components/Header';
import Lottie from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const Welcomepage = () => {
  const Navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      Navigation.navigate('Login');
    }, 3000);
  }, []);

  return (
    <View
      style={{
        display: 'flex',
        backgroundColor: '#252525',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Header />
      <Lottie
        style={{width: 300, height: 300}}
        source={require('../constants/welcome.json')}
        autoPlay
        loop
      />

      <View>
        <Text style={{fontSize: 40, color: 'white', textAlign: 'center'}}>
          To
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 50, color: 'white'}}>Notes App</Text>
          <TouchableOpacity onPress={() => Navigation.navigate('Login')}>
            <Text style={{margin: 10, marginTop: 15}}>
              <Ionicons name="arrow-redo" size={35} color="white" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Welcomepage;

const styles = StyleSheet.create({});
