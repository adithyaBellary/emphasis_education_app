import * as React from 'react';
import {
  View,
  Text
} from 'react-native';
import styled from 'styled-components';

const IndividualResultContainer = styled(View)`
  padding: 10px 0;
  display: flex;
  flexDirection: row;
  justifyContent: space-between;
`

const IndividualResult: React.FC = ({ children }) => {

  return (
    <IndividualResultContainer>
      {children}
    </IndividualResultContainer>
  )
}

export default IndividualResult;
