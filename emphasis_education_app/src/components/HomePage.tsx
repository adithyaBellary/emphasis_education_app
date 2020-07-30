import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
// this will be needed to get the full screen dimensions
// ill need to know the screen dimensions to position all the widgets
import {
  View,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';

import styled from 'styled-components';
import {
  CenteredDiv,
  MyButtonText,
  MyCircleButton,
  IconSection,
  PermissionedComponent,
  GeneralSpacing
} from './shared';
import { Icon } from 'react-native-elements';
import Context from './Context/Context';
import { Permission } from '../types';

import { GET_USER } from '../queries/GetUser';

import { LogoWithoutText } from './Logo/LogoWithoutText';

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

const MissionStatement: React.FC = () => {
  return (
    <Text>this is the mission statement</Text>
  )
}

const LogiImage = () => (
  <GeneralSpacing u={0} r={0} d={0} l={0}>
    <Image
      source={{ uri: LogoWithoutText}}
      style={{
        height: 200,
        width: 200,
        // backgroundColor: 'grey'
      }}
    />
  </GeneralSpacing>
)

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
        // <PermissionedComponent
        //   // allowedPermission={Permission.Admin}
        //   allowedPermission={Permission.Student}
        // >
          <CenteredDiv>
            <Icon
              name='user'
              type='antdesign'
              onPress={changeScreens('AdminPage')}
            />
            <Text>Admin</Text>
          </CenteredDiv>
        // </PermissionedComponent>
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
