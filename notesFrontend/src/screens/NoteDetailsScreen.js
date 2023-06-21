import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';

const NoteDetailsScreen = ({route}) => {
  const Navigation = useNavigation();
  const [singleNote, setSingleNote] = useState({});
  const id = route.params.item;
  const bcolor = route.params.bcolor;
  console.log(id, bcolor, 'single date');

  useEffect(() => {
    getNote();
  }, []);

  const getNote = async () => {
    let url = 'http://10.0.2.2:5000/notes/' + id;
    const response = await axios.get(url);
    const oneNote = response.data;
    setSingleNote(oneNote);
    console.log(response, 'get notesssss');
  };

  return (
    <View style={{flex: 1, backgroundColor: '#252525'}}>
      <Header />

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => Navigation.navigate('AllNotes')}>
          <Text style={styles.iconstyle}>
            <AntDesign name="arrowleft" size={30} color="white" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.textStyle}>Details</Text>
      </View>

      <ScrollView style={{marginVertical: 10}}>
        <View style={styles.container}>
          <Image
            source={require('../constants/img/detailSvg.png')}
            style={{width: 300, height: 250}}
          />
        </View>
        <View
          style={{
            marginVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            <Text style={{fontSize: 20, color: 'white'}}>
              Title -{' '}
              <Text style={{color: 'white', fontSize: 20, fontWeight: 500}}>
                {singleNote.title}
              </Text>
            </Text>
            <Text style={styles.textStyle}>
              Date -{' '}
              <Text
                style={{
                  color: '#f5f5f5',
                  fontSize: 17,
                  textDecorationLine: 'underline',
                }}>
                {moment(new Date(singleNote.created_at)).format('DD-MM-YYYY')}
              </Text>
            </Text>
          </View>
          <View
            style={{
              margin: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.textStyle}>Category -</Text>
            <Text style={{color: 'white', fontSize: 20}}>
              {singleNote.category}
            </Text>
          </View>

          <View
            style={{
              margin: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.textStyle}>Priority -</Text>
            <Text style={{color: 'white', fontSize: 20}}>
              {singleNote.priority}
            </Text>
          </View>

          <View
            style={{
              margin: 10,
            }}>
            <Text style={styles.textStyle}>Description -</Text>
            <Text style={{fontSize: 15, color: 'white', marginTop: 10}}>
              {singleNote.description}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NoteDetailsScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
  },
  textStyleInput: {color: 'white', margin: 5, fontSize: 16},
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
