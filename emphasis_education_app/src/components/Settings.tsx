import * as React from 'react';
import {
  View,
  Text,
  Alert
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';
// import {NavigationActions, StackActions} from 'react-navigation';

import { ButtonContainer, MyButton, MyButtonText } from './shared';
import { Logout } from '../queries/Logout';
import { CommonActions } from '@react-navigation/native';

interface ISettingsProps {
  navigation: any;
  route: any;
}

const Settings: React.FC<ISettingsProps> = ({ navigation }) => {

  // React.useEffect(() => {
  //   navigation.dispatch(resetHistory);
  // }, [])

  const [runMut, { data, loading, error}] = useMutation(
    Logout,
    {
      onCompleted: () => {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'Login'}
            ]
          })
        )
        // navigation.navigate('Login')
        // const resetHistory = StackActions.reset({
        //   index: 0,
        //   actions: [NavigationActions.navigate({ routeName: 'Login' })],
        //   key: null
        // })
        // navigation.dispatch(resetHistory);
      }
    }
  );
  console.log('data', data)
  console.log('error', error)

  return (
    <View>
      <Text>
        settings
      </Text>
      <ButtonContainer>
        <MyButton
          onPress={() => runMut()}
        >
          <MyButtonText>logout</MyButtonText>
        </MyButton>
      </ButtonContainer>
    </View>
  )
}

export default Settings;
