import * as React from 'react';
import {
  Text
} from 'react-native';
import {
  CenteredDiv,
  ButtonContainer,
  MyButton,
  MyButtonText,
  MyCircleButton
} from '../shared';
import { GetUser } from '../HomePage';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

interface IHomeProps {
  navigation: any;
  route: any;
  data: GetUser;
}

const Home: React.FC<IHomeProps> = (props) => (
  <ThemeProvider theme={theme}>
    <CenteredDiv>
      <Text>
        emphasis education home page
      </Text>
      <Text>{props.data.getUser.userType}</Text>
      <ButtonContainer>
        <MyButton
          onPress={() => {
            props.navigation.navigate(
              'ChatPicker',
              {
                chatIDs: props.route.params.chatIDs,
                name: props.route.params.name,
                email: props.route.params.email,
                _id: props.route.params._id
              }
            )
          }}
        >
          <MyButtonText>go to chat picker</MyButtonText>
        </MyButton>
      </ButtonContainer>
      <ButtonContainer>
        <MyCircleButton>
          <MyButtonText>
            hello i am circle
          </MyButtonText>
        </MyCircleButton>
      </ButtonContainer>
    </CenteredDiv>
  </ThemeProvider>
)

export default Home;
