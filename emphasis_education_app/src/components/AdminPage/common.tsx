import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';

export const IndividualResultContainer = styled(View)`
  padding: 10px 0;
  display: flex;
  flexDirection: row;
  justifyContent: space-between;
`;

export const IndividualResultButton = styled(TouchableOpacity)`
  padding: 10px 0;
  display: flex;
  flexDirection: row;
  justifyContent: space-between;
`;

// const IndividualResult: React.FC = ({ children }) => (
//   <IndividualResultContainer>
//     {children}
//   </IndividualResultContainer>
// )

// export default IndividualResult;
