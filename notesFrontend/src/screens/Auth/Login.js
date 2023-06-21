import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  ToastAndroid,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CommonActions, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useForm, Controller} from 'react-hook-form';
import axios from 'axios';
import {setToken} from '../../redux/Auth/LoginSlice';
import {useDispatch} from 'react-redux';
import {ApiUrl} from '../../constants/Api';

const Login = () => {
  const [loader, setLoader] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const Navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async data => {
    Keyboard.dismiss;
    setLoader(true);
    try {
      let url = `${ApiUrl}/login`;
      let body = {
        email: data.email,
        password: data.password,
      };
      const res = await axios.post(url, body, null, 'login');
      console.log(res?.data?.success, 'response');
      if (res?.data?.success === false) {
        setLoader(false);
        ToastAndroid.showWithGravity(
          res?.data?.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        setLoader(false);
        try {
          await AsyncStorage.setItem('token', JSON.stringify(res?.data));
          await updateRedux(res?.data);
        } catch (error) {
          console.log(error, 'token error');
        }
        reset();
        ToastAndroid.showWithGravity(
          res?.data?.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      setLoader(false);
      alert('Invalid Credientials');
      console.log(error, 'error');
    }
  };

  function toNavigation() {
    Navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'AllNotes'}],
      }),
    );
  }
  const getdata = async () => {
    try {
      let getValue = await AsyncStorage.getItem('token');
      if (getValue != null) {
        updateRedux(getValue);
        toNavigation();
      } else {
        return false;
      }
    } catch (error) {
      console.log(error, 'token error');
      return false;
    }
    setPageLoading(false);
  };
  useEffect(() => {
    getdata();
    setTimeout(() => {
      setPageLoading(false);
    }, 2000);
  }, []);

  const updateRedux = async data => {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    dispatch(setToken(data));
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#252525',
        justifyContent: 'center',
      }}>
      {pageLoading ? (
        <ActivityIndicator size={'large'} color="white" />
      ) : (
        <KeyboardAwareScrollView>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Image
              source={require('../../constants/img/book.png')}
              style={{width: 200, height: 200}}
            />
          </View>
          <View style={{marginTop: 10}}>
            <Text style={{color: 'white', fontSize: 40, textAlign: 'center'}}>
              Notes Taking App
            </Text>
          </View>
          <View style={{margin: 10}}>
            <Text style={{color: 'white', fontSize: 40, textAlign: 'center'}}>
              Login
            </Text>
          </View>

          <View style={{padding: 10}}>
            <View style={{marginVertical: 5}}>
              <Text style={styles.textStyleInput}> Enter Email</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.inputStyle}
                    onBlur={onBlur}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Email"
                    mode="outlined"
                    maxLength={100}
                    placeholderTextColor="grey"
                    outlineColor="#ddd"
                    underlineColor="#333"
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text style={{color: 'red', marginTop: 5, fontSize: 16}}>
                  This is required.
                </Text>
              )}
            </View>

            <View>
              <Text style={styles.textStyleInput}>Enter Password</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.inputStyle}
                    onBlur={onBlur}
                    value={value}
                    onChangeText={onChange}
                    placeholder="password"
                    mode="outlined"
                    maxLength={100}
                    placeholderTextColor="grey"
                    outlineColor="#ddd"
                    underlineColor="#333"
                  />
                )}
                name="password"
              />
              {errors.password && (
                <Text style={{color: 'red', margin: 5, fontSize: 16}}>
                  This is required.
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmit)}>
              {loader ? (
                <ActivityIndicator size={'small'} color="white" />
              ) : (
                <Text
                  style={{color: 'white', fontSize: 18, textAlign: 'center'}}>
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
  },
  textStyle: {
    fontSize: 40,
    color: 'white',
  },
  textStyleInput: {
    color: 'white',
    margin: 5,
    fontSize: 16,
  },
  iconstyle: {
    margin: 10,
  },
  button: {
    backgroundColor: 'gray',
    margin: 5,
    padding: 10,
    borderRadius: 5,
  },
  textSubStyle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    margin: 10,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: 'gray',
    margin: 5,
    borderRadius: 5,
    padding: 10,
    color: 'white',
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
    color: 'white',
  },
  textAreaContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
});
