import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AllNotesScreen from './src/screens/AllNotesScreen';
import NewNoteScreen from './src/screens/NewNoteScreen';
import NoteDetailsScreen from './src/screens/NoteDetailsScreen';
import Welcomepage from './src/screens/Welcomepage';
import UpdateNoteScreen from './src/screens/UpdateNoteScreen';
import Login from './src/screens/Auth/Login';
import Register from './src/screens/Auth/Register';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcomepage">
        <Stack.Screen
          name="AllNotes"
          component={AllNotesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Welcomepage"
          component={Welcomepage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="NewNote"
          component={NewNoteScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NoteDetails"
          component={NoteDetailsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UpdateNote"
          component={UpdateNoteScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
