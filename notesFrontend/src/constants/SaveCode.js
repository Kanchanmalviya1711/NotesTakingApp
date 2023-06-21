import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useForm, Controller} from 'react-hook-form';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';

const data = [
  {label: 'Low', value: '1'},
  {label: 'Medium', value: '2'},
  {label: 'High', value: '3'},
];

const NewNoteScreen = () => {
  const Navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [dateColor, setDateColor] = useState('grey');
  const [selectDate, setSelectDate] = useState('Select Date');
  const [selectDateUpdate, setSelectDateUpdate] = useState('Update Date');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [visibleUpdate, VisibilityUpdate] = useState(false);
  const [prioritys, setPrioritys] = useState([]);

  console.log(prioritys, 'prioritys');

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      created_at: '',
      category: '',
      priority: '',
    },
  });
  const onSubmit = async data => {
    console.log('data', data);
    reset();
    setSelectDate('Select Date');
    setDateColor('grey');
    return;
    try {
      let url = 'http://10.0.2.2:5000/notes';
      let params = {
        title: data.title,
        description: data.description,
        created_at: data.created_at,
        category: data.category,
        priority: priority,
      };
      const headers = {
        Accept: '*/*',
        'Content-Type': 'application/json',
      };
      const res = await axios.post(url, params, {headers});
      console.log(res, 'add data');
    } catch (error) {
      console.log(error, 'errorr');
    }

    // ______________________________________________________________________________

    // setLoader(true);
    // try {
    //   const x = [];
    //   const getValue = await AsyncStorage.getItem('notes');
    //   const NewData = JSON.parse(getValue);
    //   NewData?.data?.map(item => {
    //     x.push(item);
    //   });
    //   x.push(data);
    //   setLoader(false);
    //   try {
    //     await AsyncStorage.setItem('notes', JSON.stringify({data: x}));
    //   } catch (error) {
    //     console.log(error, 'token error');
    //   }
    //   reset();
    //   setSelectDate('Select Date');
    //   setDateColor('grey');
    //   setLoader(false);
    //   Navigation.goBack();
    // } catch (e) {
    //   setLoader(false);
    //   console.log(e);
    // }
  };

  useEffect(() => {
    if (data) {
      const priorities = data.map(item => item?.label);
      setPrioritys(priorities);
    }
  }, [data]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showDatePickerUpdate = () => {
    VisibilityUpdate(true);
  };

  const hideDatePickerUpdate = () => {
    VisibilityUpdate(false);
  };

  const handleConfirm = async (date, setValue) => {
    try {
      var dates = new Date(date);
      (mnth = ('0' + (dates.getMonth() + 1)).slice(-2)),
        (day = ('0' + dates.getDate()).slice(-2));
      const noteDate = [dates.getFullYear(), mnth, day].join('-');
      setValue(noteDate);
      setSelectDate(noteDate);
      setDateColor('white');
    } catch (error) {
      console.log(error, 'date error');
    }
    hideDatePicker();
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
        <Text style={styles.textStyle}>Add Note</Text>
      </View>
      <View>
        <Text style={styles.textSubStyle}>Add New Note Here</Text>
      </View>
      <ScrollView style={{marginVertical: 10}}>
        <View style={{padding: 10}}>
          <View style={{marginVertical: 5}}>
            <Text style={styles.textStyleInput}> Enter Note Title</Text>
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
                  placeholder="Title"
                  mode="outlined"
                  maxLength={100}
                  placeholderTextColor="grey"
                  outlineColor="#ddd"
                  underlineColor="#333"
                />
              )}
              name="title"
            />
            {errors.title && (
              <Text style={{color: 'red', marginHorizontal: 10}}>
                This is required.
              </Text>
            )}
          </View>

          <View style={{marginVertical: 10}}>
            <Text style={styles.textStyleInput}>Enter Date</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <View
                  style={{
                    borderColor: 'grey',
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    margin: 5,
                    borderRadius: 5,
                  }}>
                  <TouchableOpacity onPress={showDatePicker}>
                    <Text style={{color: dateColor}}>{selectDate}</Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={date => handleConfirm(date, onChange, reset)}
                    onCancel={hideDatePicker}
                    minimumDate={
                      new Date(
                        moment().subtract(120, 'years').format('YYYY-MM-DD'),
                      )
                    }
                    isClearable={true}
                    maximumDate={new Date(moment().format('YYYY-MM-DD'))}
                  />
                </View>
              )}
              name="created_at"
            />
            {errors.created_at && (
              <Text style={{color: 'red', marginHorizontal: 10}}>
                This is required.
              </Text>
            )}
          </View>

          <View>
            <Text style={styles.textStyleInput}>Category</Text>
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
                  placeholder="Category"
                  mode="outlined"
                  maxLength={100}
                  placeholderTextColor="grey"
                  outlineColor="#ddd"
                  underlineColor="#333"
                />
              )}
              name="category"
            />
            {errors.category && (
              <Text style={{color: 'red', marginHorizontal: 10}}>
                This is required.
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.textStyleInput}>Priority</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <View>
                  <Dropdown
                    style={[styles.dropdown]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="Priority"
                    searchPlaceholder="Search..."
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                  />
                </View>
              )}
              name="priority"
            />
            {errors.priority && (
              <Text style={{color: 'red', marginHorizontal: 10}}>
                This is required.
              </Text>
            )}
          </View>

          <View>
            <Text style={styles.textStyleInput}>Enter Description</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder="Type something..."
                    placeholderTextColor="grey"
                    numberOfLines={10}
                    multiline={true}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </View>
              )}
              name="description"
            />
            {errors.description && (
              <Text style={{color: 'red', marginHorizontal: 10}}>
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
              <Text style={{color: 'white', fontSize: 18, textAlign: 'center'}}>
                Add Note
              </Text>
            )}
          </TouchableOpacity>

          {/* <FlatList
            data={notes}
            renderItem={({item}) => {
              return (
                <View style={{backgroundColor: 'white'}}>
                  <Text style={{color: 'black'}}>{item.id}</Text>
                  <Text style={{color: 'black'}}>{item.title}</Text>
                </View>
              );
            }}
          /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default NewNoteScreen;

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
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingVertical: 5,
    margin: 5,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'white',
  },
  iconStyle: {
    width: 20,
    height: 20,
    margin: 10,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
