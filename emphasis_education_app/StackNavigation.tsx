import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {useMutation} from '@apollo/react-hooks';


import Login from './src/components/Login';
import Chat from './src/components/Chat';
import HomePage from './src/components/HomePage';
import ChatPicker from './src/components/ChatPicker';
import Profile from './src/components/LiftedProfile';
import CreateUserContain from './src/components/CreateUserContainer';
import ConfirmationScreen from './src/components/ConfirmationScreen';
import Search from './src/components/AdminPage/LiftedSearch';
import AdminPage from './src/components/AdminPage';
import CreateChat from './src/components/CreateChat';
import Settings from './src/components/Settings';

import { LOGIN_TOKEN } from './src/constant';
import { LOGIN } from './src/queries/Login';

import Context from './src/components/Context/Context';
import context, {EmptyUser, AuthContext} from './src/components/Context/Context';
import { IUser, ILoginPayload } from './src/types';

const AuthStackNav = createStackNavigator();
const AuthStack = () => (
  <AuthStackNav.Navigator initialRouteName={'Login'}>
    <AuthStackNav.Screen
      name='Login'
      component={Login}
    />
    <AppStackNav.Screen
      name="CreateUserContain"
      component={CreateUserContain}
      options={{ title: 'Create User' }}
    />
    <AppStackNav.Screen
      name="ConfirmationScreen"
      component={ConfirmationScreen}
      options={{ title: '' }}
    />
  </AuthStackNav.Navigator>
)

const AppStackNav = createStackNavigator();

const AppStack = () => {
  return (
    <AppStackNav.Navigator initialRouteName={'Home'}>
      <AppStackNav.Screen
        name="Home"
        component={HomePage}
        options={{
          title: '' ,
          // we chouldnt really be able to go back to the login page?
          // headerLeft: () => null
        }}
      />
      <AppStackNav.Screen
        name="Search"
        component={Search}
        options={{ title: '' }}
      />
      <AppStackNav.Screen
        name="Chat"
        component={Chat}
        options={{ title: 'Test Subject' }}
      />
      <AppStackNav.Screen
        name="ChatPicker"
        component={ChatPicker}
        options={{
          title: 'My Chats',
        }}
      />
      <AppStackNav.Screen
        name="MyProfile"
        component={Profile}
        options={{ title: 'My Profile' }}
      />
      <AppStackNav.Screen
        name="AdminPage"
        component={AdminPage}
        options={{ title: 'Admin Page' }}
      />
      <AppStackNav.Screen
        name='CreateChat'
        component={CreateChat}
        options={{ title: 'New Chat'}}
      />
      <AppStackNav.Screen
        name='Settings'
        component={Settings}
        options={{ title: 'Settings'}}
      />
    </AppStackNav.Navigator>
  )
}

const RootStackNav = createStackNavigator();
const RootStack = ({ userToken }) => (
  <RootStackNav.Navigator headerMode="none">
    { !!userToken ? (
      <RootStackNav.Screen
        name='App'
        component={AppStack}
      />
    ) : (
      <RootStackNav.Screen
        name='Auth'
        component={AuthStack}
      />
    )}
  </RootStackNav.Navigator>
)

const StackNavigation: React.FC = () => {
  const [{authLoading, userToken, signingOut}, dispatch] = React.useReducer(
    ( prevState, action) => {
      switch (action.type) {
        case 'CHECK_LOGIN':
          return {
            ...prevState,
            authLoading: false,
            userToken: action.token
          };
        case 'LOGIN':
          return {
            ...prevState,
            loggingOut: false,
            userToken: action.token
          };
        case 'LOGOUT':
          return {
            ...prevState,
            loggingOut: true,
            userToken: null
          };
      }
    }, {
      authLoading: true,
      userToken: null,
      loggingOut: false
    }
  )

  const _checkAuth = async () => {
    let userToken;
    try {
      userToken = await AsyncStorage.getItem(LOGIN_TOKEN)
    } catch (e) {
      console.log('checking for login failed')
    }
    console.log('userToken', userToken)
    dispatch({ type: 'CHECK_LOGIN', token: userToken})
  }

  React.useEffect(() => {
    _checkAuth()
  }, [])

  const { setUser } = React.useContext(Context);


  const [_login, { data, error, loading}] = useMutation<ILoginPayload>(
    LOGIN,
    {
      onCompleted: async ({ login }) => {
        if (login.res) {
          console.log('login result', login.user)
          setUser({...login.user});
          await AsyncStorage.setItem(LOGIN_TOKEN, '_loggedIn')
          dispatch({ type: 'LOGIN', token: LOGIN_TOKEN})
        } else {
          console.log('login failed')
        }
      }
    }
  )

  const authContext = React.useMemo(
    () => ({
      login: (email: string, password: string) => {
        // this is where we will call the mutation
        console.log('data in login context', email, password)
        _login({ variables: { email, password }})

        // dispatch({ type: 'LOGIN', token: LOGIN_TOKEN})
      },
      logout: async data => {
        console.log('signing out in app')
        await AsyncStorage.clear();
        dispatch({ type: 'LOGOUT'})
      },
      createUser: data => {
        dispatch({ type: 'LOGOUT', token: LOGIN_TOKEN})
      },
    }),
    []
  );

  if (authLoading) {
    return (
      <ActivityIndicator>
        <View>
          <Text>we are loading</Text>
        </View>
      </ActivityIndicator>
    )
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStack userToken={userToken}/>
      </NavigationContainer>
    </AuthContext.Provider>

  )
}

export default StackNavigation;