import * as React from 'react';
import {
  Alert,
  Text,
  View
} from 'react-native';
import {
  CenteredDiv,
  ButtonContainer,
  MyButton,
  MyButtonText,
  MyCircleButton,
  ConcentricIcons,
  OverallContain
} from '../shared';
import { GetUser } from '../HomePage';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../theme';

// import { Icon, Button } from 'react-native-elements';
import { Icon } from 'react-native-elements'
import styled from 'styled-components';

const Deg0 = styled(View)`
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const Deg10 = styled(View)`
`

// const MyStyledIcon = styled(Icon)`
//   background-color: green;
// `


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
      </CenteredDiv>

      <OverallContain>
      <Deg0>
        <Icon
          name='rowing'
          color='yellow'
          onPress={() => Alert.alert('heyyyy')}
        />
        <Icon name='rowing'/>
      </Deg0>
      <Deg10>
      <MyCircleButton>
          <MyButtonText>
            hello i am circle
          </MyButtonText>
        </MyCircleButton>
      </Deg10>
      <Deg0>
        <Icon name='rowing'/>
        <Icon name='rowing'/>
      </Deg0>
        </OverallContain>

  </ThemeProvider>
)

export default Home;
