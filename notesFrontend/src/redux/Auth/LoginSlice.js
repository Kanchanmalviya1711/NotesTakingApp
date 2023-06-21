import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  email: null,
  token: null,
};

const LoginSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken: (state, action) => {
      console.log(action.payload, 'token slice');
      state.email = action.payload;
      state.isLoggedIn = true;
      state.token = action.payload;
    },
    removeToken: async state => {
      console.log('remove token', state);
      state.email = null;
      state.token = null;
      state.isLoggedIn = false;
      await AsyncStorage.removeItem('token');
    },
  },
});

export const {setToken, removeToken} = LoginSlice.actions;

export default LoginSlice.reducer;
