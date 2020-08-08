import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Icon } from 'react-native-elements';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components';

import { MissionStatement, HeaderTitle, LogiImage } from './logos';

import {
  CenteredDiv,
  IconSection,
  IconRow,
  PermissionedComponent,
} from '../shared';
import Context from '../Context/Context';
import { Permission } from '../../types';
import { GET_USER } from '../../queries/GetUser';

interface ILiftedHomeProps {
  navigation: any;
  route: any;
}

interface UserType {
  userType: string
}

export interface GetUser {
  getUser: UserType;
}

const Title = styled(Text)`
  fontFamily: 'Nunito'
`

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

const FlexView = styled(View)<{ flex: number}>`
  flex: ${({flex}) => flex}
`

const Home: React.FC<ILiftedHomeProps> = ({ navigation, route }) => {
  console.log('route in home', route)
  const { loggedUser, setUser } = React.useContext(Context);
  const changeScreens = (dest: string) => () =>  navigation.navigate(dest)
  const { data, loading, error } = useQuery(GET_USER, {
    variables: {
      userEmail: route.params.token
    },
    onCompleted: data => {
      console.log('data oncomplete', data)
      setUser({...data.getUser})
    }
  })

  React.useEffect(() => {
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
                  chatID: loggedUser.adminChat[0].chatID,
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
  }, [])

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

            color='#ffe599'
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
            // color='#b89cb0'
            onPress={changeScreens('AboutUs')}
            reverse={true}
          />
          <Icon
            name='settings'
            color='#e792aa'
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
