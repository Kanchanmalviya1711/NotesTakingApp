import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

const TodoBox = ({todo, color}) => {
  const Navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => Navigation.navigate('NoteDetails')}>
      <View
        style={{
          backgroundColor: '#D3CBB8',
          margin: 10,
          height: 100,
          padding: 10,
          borderRadius: 5,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 17}}>{todo.id}</Text>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>{todo.title}</Text>
        <Text>{todo.content}</Text>
        <Text>
          Created At - {moment(new Date(todo?.created_at)).format('YYYY-MM-DD')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TodoBox;

const styles = StyleSheet.create({});
