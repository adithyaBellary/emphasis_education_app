import * as React from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
// this will be needed to get the full screen dimensions
// ill need to know the screen dimensions to position all the widgets
import {
  View,
  Text,
  Image,
  ActivityIndicator
} from 'react-native';

import styled from 'styled-components';
import {
  CenteredDiv,
  MyButtonText,
  MyCircleButton,
  IconSection,
  PermissionedComponent,
} from './shared';
import { Icon } from 'react-native-elements';
import Context from './Context/Context';
import { Permission } from '../types';
import AsyncStorage from '@react-native-community/async-storage';
import { LOGIN_TOKEN } from '../constant';

import { GET_USER } from '../queries/GetUser';

// import Pic from './images/2020 Emphasis Education_Logo (FINAL) - transparent png files-03.png';

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

const Home: React.FC<ILiftedHomeProps> = ( { navigation, route } ) => {
  const [pageLoad, setPageLoad] = React.useState(true);
  // we will need to refetch the logged in user
  const { loggedUser, setUser } = React.useContext(Context);
  // console.log('logged user in home page', loggedUser)
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
  // const updateUser = async () => {
  //   const userEmail = await AsyncStorage.getItem(LOGIN_TOKEN)
  //   console.log('the user email in the home page:', userEmail)
  //   // runQ({ variables: {
  //   //   userEmail
  //   // }})
  // }
  console.log('route', route)

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
    // get the stored user email
    // await AsyncStorage.getItem(LOGIN_TOKEN)
    // updateUser();
  }, [])

  // if (!loading) {
  //   console.log('data', data)
  //   if (data) {
  //     setUser({...data.getUser})
  //   }
  // }

  if (loading) {
    return (
      <ActivityIndicator />
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
      <Title>
        emphasis education home page
      </Title>

      <IconSection>
        <IconContain>
          <Icon
            raised
            name='person'
            onPress={() => navigation.navigate(
              'MyProfile',
              {
                groupID: loggedUser.groupID
              }
            )}
            type='fontisto'
            reverse={true}

            color='#ffe599'
            // style={{
            //   shadowColor: 'black',
            //   shadowOpacity: 0.5,
            //   shadowRadius: 5,
            //   // iOS
            //   shadowOffset: {
            //       width: 0,            // These can't both be 0
            //       height: 1,           // i.e. the shadow has to be offset in some way
            //   },
            // }}
          />
          <Icon
            raised
            name='message'
            color= '#ffb6a8'
            onPress={changeScreens('ChatPicker')}
            reverse={true}
            iconStyle={{
              color: 'black',
              // textShadowColor: 'red',
              // textShadowOffset: {
              //   height: 10,
              //   width: 10
              // },
              // textShadowRadius: 20
              // borderStyle: {
              //   color: 'yellow'
              // }
            }}
            containerStyle={{
              borderColor: 'grey',
              borderWidth: 1
            }}
          />
        </IconContain>

        <MyCircleButton>
          <MyButtonText>
            Emphasis Logo
          </MyButtonText>
        </MyCircleButton>

        <IconContain>
          <Icon
            name='search'
            // color='#b89cb0'
            // onPress={changeScreens('Search')}
            reverse={true}
            raised
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
      {/* <Image source={Pic} style={{ width: 80, height: 80}}/> */}
    </CenteredDiv>
  )

}

export default Home;
