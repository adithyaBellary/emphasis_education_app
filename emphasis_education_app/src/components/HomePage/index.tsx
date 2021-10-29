import * as React from 'react';
import { Icon, Badge } from 'react-native-elements';
import { View } from 'react-native';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import crashlytics from '@react-native-firebase/crashlytics';
import { useIsFocused } from '@react-navigation/native';

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
  QueryGetUserArgs,
  GetUserPayload
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
  const { setUser, loggedUser, notifications, updateNotifications } = React.useContext(GeneralContext);
  const [notifBadge, setNotifBadge] = React.useState<boolean>(false)
  const [adminNotifBadge, setAdminNotifBadge] = React.useState<boolean>(false)
  const [currentUser, setCurrentUser] = React.useState<UserInfoType>({} as UserInfoType)
  const { logout } = React.useContext(AuthContext);
  const isFocused = useIsFocused();

  const changeScreens = (dest: string) => () =>  navigation.navigate(dest)
  const fcmToken = route.params.fcmToken
  const { data, loading, error } = useQuery<{ getUser: GetUserPayload }, QueryGetUserArgs>(GET_USER, {
    variables: {
      userEmail: route.params.token,
      fcmToken: fcmToken
    },
    fetchPolicy: 'no-cache',
    onCompleted: ({ getUser }) => {
      setUser({...getUser.user})
      setCurrentUser(getUser.user)
      crashlytics().setAttribute('email', getUser.user.email)
      crashlytics().log('getUser success')
      const regChatNotifIDs = getUser.chatNotifications.length > 0
        ? getUser.chatNotifications.map(_notif => {
          if (!_notif!.isAdmin) {
            return _notif?.chatID
          }
          return null
        }).filter(chatID => !!chatID)
        : []

      const adminChatNotifs = getUser.chatNotifications.length > 0
        ? getUser.chatNotifications.map(_notif => {
          if (_notif!.isAdmin) {
            return _notif?.chatID
          }
          return null
        }).filter(chatID => !!chatID)
        : []

      if (regChatNotifIDs.length > 0) {
        setNotifBadge(true)
        regChatNotifIDs.forEach(_regChat => {
          updateNotifications(_regChat!, false, [getUser.user.email])
        })
      }
      if (adminChatNotifs.length > 0) {
        setAdminNotifBadge(true)
        // should also set the notifications in the context for the admin chat
        // we do not query there, only read from the logged user in the context
        adminChatNotifs.forEach(_adminChatID => {
          updateNotifications(_adminChatID!, true, [getUser.user.email])
        })
      }
    }
  })

  React.useEffect(() => {
    const admins: string[] = [];
    const regs: string[] = [];
    [...notifications.values()].forEach(notif => {
      if (notif.emails.includes(loggedUser.email)) {
        if (notif.isAdmin) {
          admins.push(notif.chatID)
        }
        if (!notif.isAdmin) {
          regs.push(notif.chatID)
        }
      }
    })

    setNotifBadge(regs.length > 0)
    setAdminNotifBadge(admins.length > 0)

  }, [notifications, isFocused])

  React.useEffect(() => {
    if ( data && data?.getUser) {
      navigation.setOptions({
        headerRight: () => (
          <IconRow>
            <PermissionedComponent allowedPermissions={[
              Permission.Admin
            ]}>
              <AdminIcon changeScreens={changeScreens}/>
              {adminNotifBadge && (
                <Badge
                  containerStyle={{
                    position: 'absolute',
                    top: 0,
                    right: 5,
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
                    chatID: data.getUser.user.adminChat[0].chatID,
                    className: 'Admin Chat'
                  })}
                />
                {adminNotifBadge && (
                  <Badge
                    containerStyle={{
                      position: 'absolute',
                      top: 5,
                      right: 20,
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
    crashlytics().log('getUser failed')
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
          You are currently on app version v{VERSION}. Try updating the app if the problem continues
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
              color='#ffb6a8'
              onPress={changeScreens('ChatPicker')}
              reverse={true}
            />
            {notifBadge && (
              <Badge
                containerStyle={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 100,
                  elevation: 100
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
