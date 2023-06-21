import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import Header from '../components/Header';
import {FAB} from '@rneui/themed';
import Lottie from 'lottie-react-native';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {removeToken} from '../redux/Auth/LoginSlice';

const AllNotesScreen = () => {
  const Navigation = useNavigation();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [AllNotes, setAllNotes] = useState([]);
  const [boxColor, setBoxColor] = useState('#FFFFFF');
  const [loader, setLoader] = useState(true);

  const updateNotes = item => {
    Navigation.navigate('UpdateNote', item);
  };

  const selectedItem = useRef();
  console.log(selectedItem, 'selectedItem');

  const randomColor = () => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const alpha = Math.floor(Math.random() * 256);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  };

  const filterItem = AllNotes?.filter(e =>
    e?.title?.toLowerCase().includes(search.toLowerCase()),
  );
  const asyncData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`http://10.0.2.2:5000/notes`);
      const data = response?.data?.notes;
      const sortedProducts = data?.reverse(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setAllNotes(sortedProducts);
      setLoader(false);
      console.log(data, 'responseList');
    } catch (error) {
      setLoader(false);
      console.log(error.message);
    }
  };

  const handleDelete = async id => {
    setRefreshing(true);
    try {
      const url = 'http://10.0.2.2:5000/notes/' + id;
      const response = await axios.delete(url);
      const data = response?.data;

      if (data?.success === true) {
        setRefreshing(false);
        ToastAndroid.showWithGravity(
          data.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        asyncData();
      }
      console.log(data.message, 'response');
    } catch (error) {
      setRefreshing(false);
      ToastAndroid.showWithGravity(
        error?.response?.data?.error?.message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      console.log(error, 'deleted error');
    }
  };

  const getSingleNote = (id, bcolor) => {
    Navigation.navigate('NoteDetails', {item: id, bcolor: bcolor});
  };

  const wibeData = async () => {
    dispatch(removeToken());
    ToastAndroid.showWithGravity(
      'Logout Successfully',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    Navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };
  useEffect(() => {
    asyncData();
    const unsubscribe = Navigation.addListener('focus', () => {
      asyncData();
      setSearch('');
    });
    return () => {
      unsubscribe;
    };
  }, [Navigation]);
  return (
    <>
      <Header />
      <View style={{flex: 1, backgroundColor: '#252525'}}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={wibeData}>
            <Text style={styles.iconstyle}>
              <Foundation name="clipboard-notes" size={60} color="white" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.heading}>My Notes</Text>
        </View>

        {loader ? (
          <ActivityIndicator size={30} color="white" />
        ) : (
          <>
            <View
              style={{
                borderRadius: 10,
                borderColor: 'white',
                borderWidth: 1,
                margin: 10,
              }}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                value={search}
                onChangeText={e => setSearch(e)}
                placeholder="Search note..."
                placeholderTextColor={'white'}
                style={styles.input}
                cursorColor={'white'}
              />
            </View>

            {filterItem?.length > 0 ? (
              <FlatList
                data={filterItem}
                numColumns={2}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => asyncData(null, true)}
                  />
                }
                keyExtractor={() => uuid.v4()}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        backgroundColor: randomColor(),
                        margin: 10,
                        width: '45%',
                        minHeight: 220,
                        padding: 10,
                        borderBottomEndRadius: 15,
                        borderTopLeftRadius: 15,
                        borderColor: 'white',
                        borderWidth: 2,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={{color: 'white', fontSize: 17}}>
                          {index + 1}.
                        </Text>
                        <TouchableOpacity onPress={() => updateNotes(item)}>
                          <Text>
                            <Feather name="edit" size={20} color="white" />
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>
                        {item.title}
                      </Text>

                      <View style={{marginTop: 10}}>
                        <TouchableOpacity
                          style={{flex: 1}}
                          onPress={() => getSingleNote(item?._id, boxColor)}>
                          <Text style={{color: 'white'}}>
                            {item.description.substring(0, 50).trim()}
                            <Text style={{fontSize: 20}}>...</Text>
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.textAreaContainer}>
                        <Text style={styles.textArea}>
                          {moment(new Date(item?.created_at)).format(
                            'DD-MM-YYYY',
                          )}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleDelete(item?._id)}>
                          <Text
                            style={{
                              marginLeft: 10,
                              fontWeight: 'bold',
                            }}>
                            <AntDesign name="delete" size={20} color="white" />
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
            ) : (
              <>
                <View
                  style={{
                    display: 'flex',
                    margin: 10,
                    alignItems: 'center',
                  }}>
                  <Lottie
                    style={{width: 300, height: 300}}
                    source={require('../constants/no-data.json')}
                    autoPlay
                    loop
                  />
                </View>
                <Text
                  style={{textAlign: 'center', color: 'white', fontSize: 16}}>
                  No Data Found
                </Text>
              </>
            )}
          </>
        )}
      </View>
      <FAB
        visible={visible}
        icon={{name: 'add', color: 'white'}}
        color="#fdbb2d"
        style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 40,
          right: 20,
        }}
        onPress={() => Navigation.navigate('NewNote')}
      />
    </>
  );
};

export default AllNotesScreen;
const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    marginLeft: 10,
  },
  heading: {
    color: 'white',
    fontSize: 60,
    textAlign: 'left',
    margin: 10,
  },
  input: {
    fontSize: 17,
    color: '#F5F5F5',
    paddingLeft: 10,
  },
  textArea: {
    textAlignVertical: 'bottom',
    color: 'white',
  },
  textAreaContainer: {
    flexDirection: 'row',
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    margin: 10,
  },
});

//      {index === selectedIndex && (
//   <View
//     style={{
//       backgroundColor: 'white',
//       position: 'absolute',
//       width: '35%',
//       top: 27,
//       right: 15,
//       padding: 5,
//       borderRadius: 5,
//     }}>
//     {/* Dropdown content goes here */}
//     <TouchableOpacity onPress={() => updateNotes(item)}>
//       <Text
//         style={{
//           color: 'black',
//           textAlign: 'center',
//           fontSize: 30,
//         }}>
//         Edit
//       </Text>
//     </TouchableOpacity>
//   </View>
// )}
