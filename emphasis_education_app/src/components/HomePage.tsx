import * as React from 'react';
// this will be needed to get the full screen dimensions
// ill need to know the screen dimensions to position all the widgets
import {
  Alert,
  View,
  Text,
} from 'react-native';

import styled from 'styled-components';
import {
  CenteredDiv,
  MyButtonText,
  MyCircleButton,
  IconSection,
  PermissionedComponent
} from './shared';
import { Icon } from 'react-native-elements';
import Context from './Context/Context';
import { Permission } from '../types';

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

const AdminContain = styled(View)`
  align-items: center;
`

const Home: React.FC<ILiftedHomeProps> = ( { navigation} ) => {
  const { loggedUser } = React.useContext(Context);
  console.log('logged user in profile', loggedUser.groupID)
  const changeScreens = (dest: string) => () =>  navigation.navigate(dest)

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <PermissionedComponent
          // allowedPermission={Permission.Admin}
          allowedPermission={Permission.Student}
        >
          <AdminContain>
          <Icon
            name='user'
            type='antdesign'
            onPress={changeScreens('AdminPage')}
          />
          <Text>Admin</Text>
          </AdminContain>

        </PermissionedComponent>
      ),
      headerRightContainerStyle: {
        padding: 10
      },
      headerLeft: () => null
    })
  }, [])

  return (
    <CenteredDiv>
      <Title>
        emphasis education home page
      </Title>

      <IconSection>
        <IconContain>
          <Icon
            name='person'
            // onPress={changeScreens('MyProfile')}
            onPress={() => navigation.navigate(
              'MyProfile',
              {
                groupID: loggedUser.groupID
              }
            )}
            type='fontisto'
            reverse={true}
          />
          <Icon
            name='message'
            onPress={changeScreens('ChatPicker')}
            reverse={true}
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
            onPress={changeScreens('Search')}
            reverse={true}
          />
          <Icon
            name='settings'
            onPress={() => Alert.alert('settings')}
            reverse={true}
          />
        </IconContain>
      </IconSection>
      <MissionStatement />
    </CenteredDiv>
  )

}

export default Home;
