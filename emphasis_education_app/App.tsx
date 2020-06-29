/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import {createStackNavigator as testStackNav} from 'react-navigation-stack';
// import { createSwitchNavigator, createAppContainer } from 'react-navigation';
// import { createSwitchNavigator, createAppContainer } from '@react-navigation/switch';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { getMainDefinition } from 'apollo-utilities';
import { ThemeProvider } from 'styled-components';
import AsyncStorage from '@react-native-community/async-storage';

import AuthLoading from './src/components/AuthLoading';
import Login from './src/components/Login';
import Chat from './src/components/Chat';
import HomePage from './src/components/HomePage';
import CreateUser from './src/components/CreateUser';
import ChatPicker from './src/components/ChatPicker';
import Profile from './src/components/LiftedProfile';
import CreateUserContain from './src/components/CreateUserContainer';
import ConfirmationScreen from './src/components/ConfirmationScreen';
import Search from './src/components/AdminPage/LiftedSearch';
import AdminPage from './src/components/AdminPage';
import CreateChat from './src/components/CreateChat';
import Settings from './src/components/Settings';

import { theme } from './src/theme';
import context, {EmptyUser, AuthContext} from './src/components/Context/Context';
import { IUser } from './src/types';

import { CHECK_LOGGED_IN } from './src/queries/CheckLoggedIn';
import { LOGIN_TOKEN } from './src/constant';
import { Actions } from 'react-native-gifted-chat';

const cache = new InMemoryCache();
const httplink = new HttpLink({
  uri: 'https://emphasis-education-server.herokuapp.com/'
  // uri: 'http://localhost:4000'
});

const wsLink = new WebSocketLink({
  uri: `ws://emphasis-education-server.herokuapp.com/graphql`,
  // uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    timeout: 20000,
    lazy: true
  }
});

const link = split(({ query }) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  )
},wsLink,
httplink)

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link
});


// TODO add typing that each route needs
// type RootStackProps = {
//   // Login: undefined;
//   Home: undefined;
//   Chat: undefined;
//   ChatPicker: undefined;
//   CreateUser: undefined;
//   CreateUserContain: undefined;
//   MyProfile: undefined;
//   ConfirmationScreen: undefined;
//   Search: undefined;
//   AdminPage: undefined;
//   CreateChat: undefined;
//   Settings: undefined;
// }

// type IAuthStackProps = {
//   Login: undefined;
// }

// const authStack = createStackNavigator<IAuthStackProps>();
// const _authStack = testStackNav({ Login: Login});
const AuthStackNav = createStackNavigator();
const AuthStack = () => (
  <AuthStackNav.Navigator initialRouteName={'Login'}>
    <AuthStackNav.Screen
      name='Login'
      component={Login}
    />
    <AuthStackNav.Screen
      name='CreateUser'
      component={CreateUser}
      options={{
        title: 'Create User'
      }}
    />
  </AuthStackNav.Navigator>
)


const AppStackNav = createStackNavigator();

const AppStack: React.FC = () => {

  return (
      <AppStackNav.Navigator initialRouteName={'Home'}>
        <AppStackNav.Screen
            name='Settings'
            component={Settings}
            options={{ title: 'Settings'}}
        />
        {/* <AppStackNav.Screen
          name="Login"
          component={Login}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#5a1846'
            }
          }}
        /> */}
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
        {/* <AppStackNav.Screen
          name="CreateUser"
          component={CreateUser}
          options={{ title: 'Create User' }}
        /> */}
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
          name="CreateUserContain"
          component={CreateUserContain}
          options={{ title: 'Create User' }}
        />
        <AppStackNav.Screen
          name="ConfirmationScreen"
          component={ConfirmationScreen}
          options={{ title: '' }}
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
      </AppStackNav.Navigator>
  )
}

// const reducer = () =>

const App = () => {
  // wrap this all in the context
  // const [authLoading, setAuthLoading] = React.useState(true);
  // const [isLoggedIn, setIsLoggedIn] = React.useState(false);

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
            authLoading: false,
            userToken: action.token
          };
        case 'LOGOUT':
          return {
            ...prevState,
            signingOut: true,
            userToken: null
          }
      }
    }, {
      authLoading: true,
      userToken: null,
      signingOut: false
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

  const [user, setUser] = React.useState<IUser>({} as IUser);
  const updateUser = (newUser: IUser) => setUser(newUser)
  const value = {
    loggedUser: user,
    setUser: updateUser
  }

  const authContext = React.useMemo(
    () => ({
      login: data => {
        // this is where we will call the mutation
        console.log('data in login context', data)

        dispatch({ type: 'LOGIN', token: LOGIN_TOKEN})
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

    <context.Provider value={value}>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <NavigationContainer>
            {
              !!userToken ? (
                <AppStack />
              ) : (
                <AuthStack />
              )
            }
          </NavigationContainer>
        </ApolloProvider>
      </ThemeProvider>
    </context.Provider>

    </AuthContext.Provider>
  )
};

export default App;
