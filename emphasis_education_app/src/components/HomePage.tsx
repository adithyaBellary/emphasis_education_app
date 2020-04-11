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

interface IHomeProps {
  test: number;
}

const HomeContainer = styled(View)`
`;

const Home: React.FC<IHomeProps> = ( { props }) => {

  return (
    <HomeContainer>
      <Text>
        hey guys
      </Text>
    </HomeContainer>
  )

}

export default Home;
