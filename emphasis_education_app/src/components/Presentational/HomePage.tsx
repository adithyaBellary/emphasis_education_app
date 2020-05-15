import * as React from 'react';
import {
  Alert,
  Text,
  View
} from 'react-native';
import {
  CenteredDiv,
  MyButtonText,
  MyCircleButton,
  IconSection
} from '../shared';
import { GetUser } from '../HomePage';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../theme';

import { Icon } from 'react-native-elements';
import styled from 'styled-components';

const IconContain = styled(View)`
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
interface IHomeProps {
  navigation: any;
  route: any;
  data: GetUser;
}

const MissionStatement: React.FC = () => {
  return (
    <Text>this is the mission statement</Text>
  )
}

// need to add Nunito Font
const Title = styled(Text)`
  fontFamily: "Nunito"
`

const Home: React.FC<IHomeProps> = (props) => {

  const goToChat = () => {
    props.navigation.navigate(
      'ChatPicker',
      {
        chatIDs: props.route.params.chatIDs,
        name: props.route.params.name,
        email: props.route.params.email,
        _id: props.route.params._id
      }
    )
  }
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
              onPress={() => Alert.alert('my profile')}
            />
            <Icon
              name='message'
              onPress={goToChat}
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
            />
            <Icon
              name='rowing'
              onPress={() => Alert.alert('settings')}
            />
          </IconContain>
        </IconSection>
        <MissionStatement />
      </CenteredDiv>
    </ThemeProvider>
  )
}

export default Home;
