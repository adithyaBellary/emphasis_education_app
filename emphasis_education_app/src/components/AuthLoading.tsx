import * as React from 'react';
import {
  ActivityIndicator,
  View,
  Text
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { LOGIN_TOKEN } from '../constant';

interface IAuthLoadingProps {
  navigation: any;
  route: any;
}
const AuthLoading: React.FC<IAuthLoadingProps> = ({ navigation }) => {

  React.useEffect(() => {
    // check local storage
    _checkAuth();
  }, [])

  const _checkAuth = async () => {
    const login = await AsyncStorage.getItem(LOGIN_TOKEN);
    console.log('login in auth checker', login)
    // navigation.navigate(login ? 'App' : 'Auth')
    if (login) {
      navigation.navigate(
        'AppStack',
        {
          screen: 'Home'
        }
      )
    } else {
      navigation.navigate(
        'AuthStack',
        {
          screen: 'Login'
        }
      )
    }
  }

  return (
    <>
      <ActivityIndicator />
      <View>
        <Text>We are loading</Text>
      </View>
    </>
  )
}

export default AuthLoading;
