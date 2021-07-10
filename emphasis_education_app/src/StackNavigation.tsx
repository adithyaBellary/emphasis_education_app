import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import * as Sentry from '@sentry/react-native';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';

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
import { AuthContext } from './components/Context/Context';
import { TitleText } from './components/shared';

import { LOGIN_TOKEN } from './constant';
import { LOGIN } from './queries/Login';

import { ILoginPayload } from './types';
import { theme } from './theme';

import SplashScreen from './SplashScreen';

import { GeneralContext } from '../src/components/Context/Context';

const AuthStackNav = createStackNavigator();
const AuthStack: ({ error, loading}: { error: boolean; loading: boolean}) => JSX.Element = ({ error, loading }) => (
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
      options={{ title: 'Confirm Users' }}
    />
    <AppStackNav.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{ title: 'Forgot Password' }}
    />
  </AuthStackNav.Navigator>
)

const AppStackNav = createStackNavigator();

const AppStack: ({ fcmToken, userToken}: { fcmToken: string; userToken: string}) => JSX.Element = ({ fcmToken, userToken }) => (
  <AppStackNav.Navigator initialRouteName={'Home'}>
    <AppStackNav.Screen
      name="Home"
      component={HomePage}
      options={{
        headerTitle: () => <TitleText title='Home' />
      }}
      initialParams={{
        token: userToken,
        fcmToken: fcmToken,
      }}
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
const AppRootStack = ({ fcmToken, userToken, ...props }) => (
  <AppRootStackNav.Navigator headerMode="none" mode='modal'>
    <AppRootStackNav.Screen name="App">
      {() => <AppStack {...props} userToken={userToken} fcmToken={fcmToken} />}
    </AppRootStackNav.Screen>
    <AppRootStackNav.Screen name='AddUserModal' component={AddMember} />
    <AppRootStackNav.Screen name='ChatInfo' component={ChatInfo} />
  </AppRootStackNav.Navigator>
)

const RootStackNav = createStackNavigator();
const RootStack: ({ fcmToken, userToken, error, loading }: { fcmToken: string; userToken: string; error: boolean; loading: boolean }) => JSX.Element = ({ fcmToken, userToken, error, loading }) => (
  <RootStackNav.Navigator headerMode="none">
    { !!userToken ? (
      <RootStackNav.Screen name='AppRoot'>
        {_props => <AppRootStack {..._props} userToken={userToken} fcmToken={fcmToken} /> }
      </RootStackNav.Screen>
    ) : (
      <RootStackNav.Screen name='Auth'>
        {_props => <AuthStack {..._props} error={error} loading={loading}/> }
      </RootStackNav.Screen>
    )}
  </RootStackNav.Navigator>
)

const StackNavigation: React.FC = () => {
  const {clearAllNotifications} = React.useContext(GeneralContext);

  const [{authLoading, userToken, fcmToken}, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'CHECK_LOGIN':
          Sentry.captureMessage(`in CHECK_LOGIN: authloading: ${authLoading}, usertoken: ${action.token}`)
          return {
            authLoading: false,
            userToken: action.token,
            fcmToken: action.fcmToken
          };
        case 'LOGIN':
          return {
            ...prevState,
            authLoading: false,
            userToken: action.token
          };
        case 'LOGOUT':
          return {
            ...prevState,
            authLoading: false,
            userToken: null,
            fcmToken: null
          };
      }
    }, {
      authLoading: true,
      userToken: null,
      fcmToken: null
    }
  )

  React.useEffect(() => {
    const _checkAuth = async () => {

      Sentry.captureMessage('Checking auth')
      const fcmToken = await messaging().getToken().then(token => token);
      const userToken = await AsyncStorage.getItem(LOGIN_TOKEN)

      Sentry.captureMessage(`The token: ${userToken}`)
      dispatch({ type: 'CHECK_LOGIN', token: userToken, fcmToken})
      Sentry.captureMessage('dispatched')
    }

    _checkAuth()
  }, [])

  const [loginError, setLoginError] = React.useState(false);

  const [_login, { error, loading}] = useMutation<ILoginPayload>(LOGIN)

  if (error) {
    console.log('error logging in. Could be the internet', error)
  }

  const authContext = React.useMemo(
    () => ({
      login: async (email: string, password: string) => {
        const token = await messaging().getToken().then(token => token);
        _login({ variables: {
          email,
          password,
          token
        }})
        .then(async ({ data }) => {
          if (data?.login.res) {
            await AsyncStorage.setItem(LOGIN_TOKEN, data.login.user.email)
            setLoginError(false)
            // set crashlytics attributes
            crashlytics().setAttribute('email', data.login.user.email)
            crashlytics().log('login successful')
            dispatch({ type: 'LOGIN', token: data.login.user.email})

          } else {
            setLoginError(true)
          }
        })
        .catch(e => {
          setLoginError(true)
        })
      },
      logout: async () => {
        await AsyncStorage.clear();
        // clear all notification messages
        clearAllNotifications()
        // unset the user on logout
        Sentry.configureScope(scope => scope.setUser(null));
        crashlytics().log('logout successful')
        dispatch({ type: 'LOGOUT'})
      },
      createUser: () => {
        dispatch({ type: 'LOGOUT', token: LOGIN_TOKEN})
      },
    }),
    []
  );

  if (authLoading) {
    return (
      <SplashScreen
        authLoading={authLoading}
        token={userToken}
      />
    )
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStack fcmToken={fcmToken} userToken={userToken} error={loginError} loading={loading} />
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

export default StackNavigation;
