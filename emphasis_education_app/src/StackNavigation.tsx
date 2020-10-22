import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import * as Sentry from '@sentry/react-native';

import Login from './components/Login';
import Chat from './components/Chat/Chat';
import HomePage from './components/HomePage';
import ChatPicker from './components/Chat/ChatPicker';
import Profile from './components/Profile/LiftedProfile';
import CreateUserContain from './components/UserManagement/CreateUserContainer';
import ConfirmationScreen from './components/UserManagement/ConfirmationScreen';
import AdminPage from './components/AdminPage/AdminPage';
import CreateChat from './components/Chat/CreateChat';
import Settings from './components/Settings';
import AboutUs from './components/AboutUs';
import EnterCode from './components/UserManagement/EnterCode';
import AddMember from './components/AdminPage/AddMemberModal';
import ChatInfo from './components/Chat/ChatInfo';
import ForgotPassword from './components/UserManagement/ForgotPassword';

import { LOGIN_TOKEN } from './constant';
import { LOGIN } from './queries/Login';

import {AuthContext} from './components/Context/Context';
import { ILoginPayload } from './types';
import { TitleText } from './components/shared';
import { theme } from './theme';

const AuthStackNav = createStackNavigator();
const AuthStack = ({ error, loading }) => (
  <AuthStackNav.Navigator initialRouteName={'Login'}>
    <AuthStackNav.Screen name='Login' options={{ headerShown: false}}>
      {_props => <Login {..._props} error={error} loading={loading}/>}
    </AuthStackNav.Screen>
    <AppStackNav.Screen
      name='EnterCode'
      component={EnterCode}
      options={{ title: 'Enter Code'}}
    />
    <AppStackNav.Screen
      name='CreateUserContain'
      component={CreateUserContain}
      options={{ title: 'Create User' }}
    />
    <AppStackNav.Screen
      name="ConfirmationScreen"
      component={ConfirmationScreen}
      options={{ title: '' }}
    />
    <AppStackNav.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{ title: 'Forgot Password' }}
    />
  </AuthStackNav.Navigator>
)

const AppStackNav = createStackNavigator();

const AppStack = ({ userToken }) => (
  <AppStackNav.Navigator initialRouteName={'Home'}>
    <AppStackNav.Screen
      name="Home"
      component={HomePage}
      options={{
        headerTitle: () => <TitleText title='Home' />
      }}
      initialParams={{ token: userToken}}
    />
    <AppStackNav.Screen
      name='AboutUs'
      component={AboutUs}
      options={{
        headerTitle: () => <TitleText title='About Us' />,
        headerStyle: {
          backgroundColor: theme.colors.purplePastel
        }
      }}
    />
    <AppStackNav.Screen
      name="Chat"
      component={Chat}
    />
    <AppStackNav.Screen
      name="ChatPicker"
      component={ChatPicker}
      options={{
        headerTitle: () => <TitleText title='My Chats' />,
        headerStyle: {
          backgroundColor: theme.colors.lightOrange
        }
      }}
    />
    <AppStackNav.Screen
      name="MyProfile"
      component={Profile}
      options={{
        headerTitle: () => <TitleText title='My Profile' />,
        headerStyle: {
          backgroundColor: theme.colors.lightPink
        }
      }}
    />
    <AppStackNav.Screen
      name="AdminPage"
      component={AdminPage}
      options={{
        headerTitle: () => <TitleText title='Admin Page' />
      }}
    />
    <AppStackNav.Screen
      name='CreateChat'
      component={CreateChat}
      options={{
        headerTitle: () => <TitleText title='Create Chat' />
      }}
    />
    <AppStackNav.Screen
      name='Settings'
      component={Settings}
      options={{
        headerTitle: () => <TitleText title='Settings' />,
        headerStyle: {
          backgroundColor: theme.colors.yellow
        }
      }}
    />
  </AppStackNav.Navigator>
)

const AppRootStackNav = createStackNavigator();
const AppRootStack = ({ userToken, ...props }) => (
  <AppRootStackNav.Navigator headerMode="none" mode='modal'>
    <AppRootStackNav.Screen name="App">
      {() => <AppStack {...props} userToken={userToken} />}
    </AppRootStackNav.Screen>
    <AppRootStackNav.Screen name='AddUserModal' component={AddMember} />
    <AppRootStackNav.Screen name='ChatInfo' component={ChatInfo} />
  </AppRootStackNav.Navigator>
)

const RootStackNav = createStackNavigator();
const RootStack = ({ userToken, error, loading }) => (
  <RootStackNav.Navigator headerMode="none">
    { !!userToken ? (
      <RootStackNav.Screen name='AppRoot'>
        {_props => <AppRootStack {..._props} userToken={userToken} /> }
      </RootStackNav.Screen>
    ) : (
      <RootStackNav.Screen name='Auth'>
        {_props => <AuthStack {..._props} error={error} loading={loading}/> }
      </RootStackNav.Screen>
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
    dispatch({ type: 'CHECK_LOGIN', token: userToken})
  }

  React.useEffect(() => {
    _checkAuth()
  }, [])

  const [loginError, setLoginError] = React.useState(false);

  const [_login, { error, loading}] = useMutation<ILoginPayload>(LOGIN)

  if (error) {
    console.log('error logging in. Could be the internet', error)
  }

  const authContext = React.useMemo(
    () => ({
      login: (email: string, password: string) => {
        _login({ variables: {
          email,
          password
        }})
        .then(async ({ data }) => {
          if (data?.login.res) {
            await AsyncStorage.setItem(LOGIN_TOKEN, data.login.user.email)
            setLoginError(false)
            dispatch({ type: 'LOGIN', token: data.login.user.email})
            console.log(data.login.user.firstName, data.login.user.lastName)
            Sentry.captureMessage('Successful Login', {
              user: {
                email,
                name: `${data.login.user.firstName} ${data.login.user.lastName}`
              }
            })
          } else {
            setLoginError(true)
          }
        })
        .catch(e => {
          setLoginError(true)
        })
      },
      logout: async data => {
        await AsyncStorage.clear();
        // unset the user on logout
        Sentry.configureScope(scope => scope.setUser(null));
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
      <ActivityIndicator animating={authLoading} />
    )
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStack userToken={userToken} error={loginError} loading={loading} />
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

export default StackNavigation;
