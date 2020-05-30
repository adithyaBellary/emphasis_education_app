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

  const goToMyProfile = () => props.navigation.navigate('MyProfile');

  const goToChat = () => props.navigation.navigate('ChatPicker');


  return (
    <ThemeProvider theme={theme}>
      <CenteredDiv>
        <Title>
          emphasis education home page
        </Title>

        <IconSection>
          <IconContain>
            <Icon
              name='rowing'
              onPress={goToMyProfile}
              reverse={true}
            />
            <Icon
              name='message'
              onPress={goToChat}
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
              name='rowing'
              onPress={() => Alert.alert('additional courses')}
              reverse={true}
            />
            <Icon
              name='rowing'
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
