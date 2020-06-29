import * as React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';

import { ButtonContainer, MyButton, MyButtonText } from './shared';
import { Logout } from '../queries/Logout';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from './Context/Context';

interface ISettingsProps {
  navigation: any;
  route: any;
}

const Settings: React.FC<ISettingsProps> = ({ navigation }) => {

  const { logout } = React.useContext(AuthContext);

  // const [runMut, { data, loading, error}] = useMutation(
  //   Logout,
  //   {
  //     onCompleted: () => {
  //       navigation.dispatch(
  //         CommonActions.reset({
  //           // it is one of these two probs
  //           // index: 1,
  //           index: 0,
  //           routes: [
  //             { name: 'Login'}
  //           ]
  //         })
  //       )
  //     }
  //   }
  // );
  // console.log('data', data)
  // console.log('error', error)

  // const _logout = async () => {
  //   await AsyncStorage.clear();
  //   navigation.navigate('Auth', { screen: 'Login'})
  // }

  return (
    <View>
      <Text>
        settings
      </Text>
      <ButtonContainer>
        <MyButton
          // onPress={() => runMut()}
          // onPress={() => _logout()}
          onPress={() => logout()}
        >
          <MyButtonText>logout</MyButtonText>
        </MyButton>
      </ButtonContainer>
    </View>
  )
}

export default Settings;
