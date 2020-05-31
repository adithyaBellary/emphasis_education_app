import * as React from 'react';
// this will be needed to get the full screen dimensions
// ill need to know the screen dimensions to position all the widgets
import {
  Alert,
  View,
  Text,
} from 'react-native';
import gql from 'graphql-tag'

import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import {
  CenteredDiv,
  MyButtonText,
  MyCircleButton,
  IconSection
} from './shared';
import { Icon } from 'react-native-elements';
import Context from './Context/Context';

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

const Home: React.FC<ILiftedHomeProps> = ( props ) => {
  const { loggedUser } = React.useContext(Context);
  const changeScreens = (dest: string) => () =>  props.navigation.navigate(dest)

  return (
    <ThemeProvider theme={theme}>
      <CenteredDiv>
        <Title>
          emphasis education home page
        </Title>

        <IconSection>
          <IconContain>
            <Icon
              name='person'
              onPress={changeScreens('MyProfile')}
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
    </ThemeProvider>
  )

}

export default Home;
