import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Icon } from 'react-native-elements';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components';
import messaging from '@react-native-firebase/messaging';

import { MissionStatement, HeaderTitle, LogiImage } from './logos';

import {
  CenteredDiv,
  IconSection,
  IconRow,
  PermissionedComponent,
} from '../shared';
import { GeneralContext } from '../Context/Context';
import { Permission } from '../../types';
import { GET_USER } from '../../queries/GetUser';
import { theme } from '../../theme';
import {
  UserInfoType,
  QueryGetUserArgs
 } from '../../../types/schema-types';

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
    <Text>Admin</Text>
  </CenteredDiv>
);

const Home: React.FC<LiftedHomeProps> = ({ navigation, route }) => {
  // console.log('route in home', route)
  const { loggedUser, setUser } = React.useContext(GeneralContext);
  console.log('admin chat', loggedUser.adminChat)
  const changeScreens = (dest: string) => () =>  navigation.navigate(dest)
  const { data, loading, error } = useQuery<{ getUser: UserInfoType }, QueryGetUserArgs>(GET_USER, {
    variables: {
      userEmail: route.params.token
    },
    onCompleted: ({ getUser }) => {
      setUser({...getUser})
      // data.getUser.classes.for
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
                <Text>Admin Chat</Text>
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
          console.log('subbing to topics')
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
      <>
        <ActivityIndicator animating={loading} />
        <View><Text>home page</Text></View>
      </>
    )
  }

  if (error) {
    console.log(error)
    return (
      <View><Text>there was an issue reloading the user</Text></View>
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
            iconStyle={{
              color: 'black',
            }}
            containerStyle={{
              borderColor: 'grey',
              borderWidth: 1
            }}
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
