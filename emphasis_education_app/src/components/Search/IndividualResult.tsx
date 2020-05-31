import * as React from 'react';
import {
  View,
  Text
} from 'react-native';
import styled from 'styled-components';

const IndividualResultContainer = styled(View)`
  padding: 10px 0;
`

const IndividualResult: React.FC = ({ children }) => {

  return (
    <IndividualResultContainer>
      <Text>
        {children}
      </Text>
    </IndividualResultContainer>
  )
}

export default IndividualResult;
