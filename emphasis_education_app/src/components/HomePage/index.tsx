import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Icon } from 'react-native-elements';
import { ActivityIndicator, View } from 'react-native';
import styled from 'styled-components';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';

import { MissionStatement, HeaderTitle, LogiImage } from './logos';

import {
  CenteredDiv,
  IconSection,
  IconRow,
  PermissionedComponent,
  ThemedText,
  FONT_STYLES,
  ThemedButton,
} from '../shared';
import { AuthContext, GeneralContext } from '../Context/Context';
import { Permission } from '../../types';
import { GET_USER } from '../../queries/GetUser';
import { theme } from '../../theme';
import {
  UserInfoType,
  QueryGetUserArgs
 } from '../../../types/schema-types';
 import { gql, useApolloClient } from '@apollo/client';

interface LiftedHomeProps {
  navigation: any;
  route: any;
}

interface UserType {
  userType: string
}

export interface GetUser {
  getUser: UserType;
}

const IconContain = styled(View)`
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const AdminIcon: React.FC<{ changeScreens (dest: string): () => void }> = ({ changeScreens }) => (
  <CenteredDiv>
    <Icon
      name='user'
      type='antdesign'
      onPress={changeScreens('AdminPage')}
    />
    <ThemedText
      size={14}
      type={FONT_STYLES.MAIN}
    >
      Admin
    </ThemedText>
  </CenteredDiv>
);

const Home: React.FC<LiftedHomeProps> = ({ navigation, route }) => {
  const { setUser } = React.useContext(GeneralContext);
  const { logout } = React.useContext(AuthContext);
  const changeScreens = (dest: string) => () =>  navigation.navigate(dest)
  // console.log(route.params.token)
  const client = useApolloClient();
  const { data, loading, error } = useQuery<{ getUser: UserInfoType }, QueryGetUserArgs>(GET_USER, {
    variables: {
      userEmail: route.params.token
    },
    onCompleted: ({ getUser }) => {
      setUser({...getUser})
      navigation.setOptions({
        headerRight: () => (
          <IconRow>
            <PermissionedComponent allowedPermissions={[
              Permission.Admin
            ]}>
              <AdminIcon changeScreens={changeScreens}/>
            </PermissionedComponent>

            <PermissionedComponent allowedPermissions={[
              Permission.Student,
              Permission.Parent,
              Permission.Tutor
            ]}>
              <CenteredDiv>
                <Icon
                  name='user'
                  type='antdesign'
                  onPress={() => navigation.navigate('Chat', {
                    chatID: getUser.adminChat[0].chatID,
                    className: 'Admin'
                  })}
                />
                <ThemedText
                  size={14}
                  type={FONT_STYLES.MAIN}
                >
                  Admin Chat
                </ThemedText>
              </CenteredDiv>
            </PermissionedComponent>
          </IconRow>
        ),
        headerRightContainerStyle: {
          padding: 10
        },
        headerLeft: () => null
      })
      // subscribe to the messages
      if (getUser.classes) {
        getUser.classes.forEach(_class => {
          if (_class) {
            messaging()
              .subscribeToTopic(_class.chatID)
              .then(() => console.log('successfully subbed to topic'))
              .catch(e => console.log('there was an error in subbing to the topic, ', e))
          }
        })
      }
    }
  })

  if (loading) {
    return (
      <CenteredDiv>
        <ActivityIndicator animating={loading} />
        <View>
          <ThemedText
            size={14}
            type={FONT_STYLES.MAIN}
          >
            loading home page...
          </ThemedText>
        </View>
      </CenteredDiv>
    )
  }

  if (error) {
    console.log(error)
    return (
      <CenteredDiv>
        <ThemedText
          size={14}
          type={FONT_STYLES.MAIN}
        >
          There was an issue reloading the user...
        </ThemedText>
        <ThemedText
          size={14}
          type={FONT_STYLES.MAIN}
        >
          Try logging out / in again
        </ThemedText>
        <ThemedButton
          buttonText='Back to login'
          onPress={logout}
          loading={false}
        />
      </CenteredDiv>
    )
  }

  return (
    <CenteredDiv>
      <HeaderTitle />

      <IconSection>
        <IconContain>
          <Icon
            raised
            name='person'
            onPress={() => navigation.navigate('MyProfile')}
            type='fontisto'
            reverse={true}

            color={theme.colors.lightPink}
          />
          <Icon
            raised
            name='message'
            color= '#ffb6a8'
            onPress={changeScreens('ChatPicker')}
            reverse={true}
          />
        </IconContain>

        <LogiImage />

        <IconContain>
          <Icon
            name='search'
            color={theme.colors.purplePastel}
            onPress={changeScreens('AboutUs')}
            reverse={true}
          />
          <Icon
            name='settings'
            color={theme.colors.yellow}
            onPress={changeScreens('Settings')}
            reverse={true}
          />
        </IconContain>
      </IconSection>
      <MissionStatement />
    </CenteredDiv>
  )
}

export default Home;
