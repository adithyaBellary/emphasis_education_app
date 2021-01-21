import * as React from 'react';
import { Icon, Badge } from 'react-native-elements';
import { View } from 'react-native';
import styled from 'styled-components';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import { gql, useApolloClient, useQuery } from '@apollo/client';

import { MissionStatement, HeaderTitle, LogiImage } from './logos';

import {
  CenteredDiv,
  FONT_STYLES,
  LoadingComponent,
  IconSection,
  IconRow,
  PermissionedComponent,
  ThemedText,
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
import { VERSION } from '../../../src/constant';

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
  const { setUser, notificationBadge } = React.useContext(GeneralContext);
  const { logout } = React.useContext(AuthContext);
  const changeScreens = (dest: string) => () =>  navigation.navigate(dest)
  const fcmToken = route.params.fcmToken
  const { data, loading, error } = useQuery<{ getUser: UserInfoType }, QueryGetUserArgs>(GET_USER, {
    variables: {
      userEmail: route.params.token,
      fcmToken: fcmToken
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
              Permission.Guardian,
              Permission.Tutor
            ]}>
              <CenteredDiv>
                <Icon
                  name='user'
                  type='antdesign'
                  onPress={() => navigation.navigate('Chat', {
                    chatID: getUser.adminChat[0].chatID,
                    className: 'Admin Chat'
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
      // delete all this
      // subscribe to the messages (chats as well as admin chats)
      if (getUser.classes) {
        getUser.classes.forEach(_class => {
          if (_class) {
            messaging()
              .subscribeToTopic(_class.chatID)
              .then(() => {
                // Sentry.captureMessage(`${getUser.firstName} ${getUser.lastName} successfully subbed to ${_class.chatID}`)
                console.log('successfully subbed to topic')
              })
              .catch(e => {
                // Sentry.captureMessage(`${getUser.firstName} ${getUser.lastName} was not able to sub to ${_class.chatID} ${e}`)
                console.log('there was an error in subbing to the topic, ', e)
              })
          }
        })
      }
      if (getUser.adminChat) {
        getUser.adminChat?.forEach(_adminChat => {
          // subscribe to the admin chats too, so that we can receive push notifs from messages in these chats too
          if (_adminChat) {
            messaging()
              .subscribeToTopic(_adminChat.chatID)
              .then(() => {
                // Sentry.captureMessage(`${getUser.firstName} ${getUser.lastName} successfully subbed to  admin chat ${_adminChat.chatID}`)
                console.log('successfully subbed to admin chat topic')
              })
              .catch(e => {
                // Sentry.captureMessage(`${getUser.firstName} ${getUser.lastName} was not able to sub to ${_adminChat.chatID} ${e}`)
                console.log('there was an error in subbing to the admin chattopic, ', e)
              })
          }
        })
      }
    }
  })

  if (loading) {
    return (
      <CenteredDiv>
        <LoadingComponent loading={loading}/>
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
        <ThemedText
          size={14}
          type={FONT_STYLES.MAIN}
        >
          You are currently on app version v{VERSION}
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
          <View>
            <Icon
              raised
              name='message'
              color= '#ffb6a8'
              onPress={changeScreens('ChatPicker')}
              reverse={true}
            />
            {notificationBadge && (
              <Badge
                containerStyle={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 100
                }}
                badgeStyle={{
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  backgroundColor: 'green'
                }}
              />
            )}

          </View>
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
