import React, {useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

export default UpdateNoteScreen = props => {
  const Navigation = useNavigation();
  const updateValue = props?.route?.params;
  const [loader, setLoader] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const dd = moment(new Date(updateValue?.created_at)).format('DD-MM-YYYY');
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm();

  useEffect(() => {
    setValue('title', updateValue?.title);
    setValue('description', updateValue?.description);
    setValue('created_at', '' + dd);
    setValue('category', updateValue?.category);
    setValue('priority', updateValue?.priority);
  }, [updateValue]);

  const onSubmit = async data => {
    console.log(data, 'select data data');

    reset();
    try {
      let url = 'http://10.0.2.2:5000/notes/' + updateValue?._id;
      const response = await axios.put(url, data);
      console.log(response, 'response update');

      if (response?.data?.success === true) {
        ToastAndroid.showWithGravity(
          response?.data?.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        Navigation.navigate('AllNotes');
      }
    } catch (error) {
      setLoader(false);
      ToastAndroid.showWithGravity(
        error.response.data.error,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      console.error(error.response, 'error update note');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = async (date, setValue) => {
    console.log(date, 'ffff');
    try {
      const dates = moment(new Date(date)).format('DD-MM-YYYY');
      // (mnth = ('0' + (dates.getMonth() + 1)).slice(-2)),
      //   (day = ('0' + dates.getDate()).slice(-2));
      setValue(dates);
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
        <Text style={styles.textStyle}>Update Note</Text>
      </View>
      <View>
        <Text style={styles.textSubStyle}>Update Note Here</Text>
      </View>
      <ScrollView style={{marginVertical: 10}}>
        <View style={{margin: 5}}>
          <Text style={styles.textStyleInput}> Enter Note Title</Text>
          <Controller
            control={control}
            name="title"
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <View>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholderTextColor="grey"
                  placeholder="Enter Title"
                  style={styles.inputStyle}
                />
                {errors.title && <Text>This field is required.</Text>}
              </View>
            )}
          />
        </View>

        <View style={{margin: 5}}>
          <Text style={styles.textStyleInput}> Enter Date</Text>
          <Controller
            control={control}
            name="created_at"
            rules={{required: true}}
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
                  <Text style={{color: 'white'}}>
                    {value ? value : 'Select Date'}
                  </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  value={value}
                  onConfirm={date => handleConfirm(date, onChange)}
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
          />
          {errors.created_at && <Text>This field is required.</Text>}
        </View>

        <View style={{margin: 5}}>
          <Text style={styles.textStyleInput}> Enter Category</Text>
          <Controller
            control={control}
            name="category"
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <View>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter Category"
                  placeholderTextColor="grey"
                  style={styles.inputStyle}
                />
                {errors.category && <Text>This field is required.</Text>}
              </View>
            )}
          />
        </View>
        <View style={{margin: 5}}>
          <Text style={styles.textStyleInput}> Enter Priority</Text>
          <Controller
            control={control}
            name="priority"
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <View>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter Priority"
                  placeholderTextColor="grey"
                  style={styles.inputStyle}
                />
                {errors.priority && <Text>This field is required.</Text>}
              </View>
            )}
          />
        </View>
        <View style={{margin: 5}}>
          <Text style={styles.textStyleInput}> Enter Description</Text>
          <Controller
            control={control}
            name="description"
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <View style={styles.textAreaContainer}>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Type something..."
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  style={styles.textArea}
                  numberOfLines={10}
                  multiline={true}
                />

                {errors.description && <Text>This field is required.</Text>}
              </View>
            )}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}>
          {loader ? (
            <ActivityIndicator size={'small'} color="white" />
          ) : (
            <Text style={{color: 'white', fontSize: 18, textAlign: 'center'}}>
              Update Note
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

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
    margin: 10,
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
    padding: 10,
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
