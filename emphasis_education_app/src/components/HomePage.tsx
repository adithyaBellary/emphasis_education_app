import React from 'react';
// this will be needed to get the full screen dimensions
// ill need to know the screen dimensions to position all the widgets
import {
  Dimensions,
  View,
  TouchableOpacity,
  SafeAreaView,
  Text
} from 'react-native';
import styled from 'styled-components';

import {
  ButtonContainer,
  MyButton,
  MyButtonText
} from './shared'

interface IHomeProps {
  navigation: any;
  route: any;
}

const HomeContainer = styled(View)`
`;

const Home: React.FC<IHomeProps> = ( props ) => {

  return (
    <HomeContainer>
      <Text>
        hey guys
      </Text>
      <Text>
        emphasis education home page
      </Text>
      <ButtonContainer>
        <MyButton
          onPress={() => {
            // console.log(props)
            props.navigation.navigate(
              'ChatPicker',
              {
                chatIDs: props.route.params.chatIDs
              }
            )
          }}
        >
          <MyButtonText>go to chat picker</MyButtonText>
        </MyButton>
      </ButtonContainer>

    </HomeContainer>
  )

}

export default Home;
