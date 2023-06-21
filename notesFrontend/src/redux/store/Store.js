import {configureStore} from '@reduxjs/toolkit';
import LoginReducer from '../Auth/LoginSlice';

const store = configureStore({
  reducer: {
    token: LoginReducer,
  },
});

export default store;
