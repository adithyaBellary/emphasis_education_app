import { theme } from './theme';

import {
  TextInput,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import styled, { ThemeProvider } from 'styled-components';

export const MytextInput = styled(TextInput)`
  border: black;
  padding: 10px;
`;

export const ButtonContainer = styled(View)`
padding: 10px;
`;
export const MyButton = styled(TouchableOpacity)`
background-color: lightskyblue;
width: 100px;
height: 20px;
`;

export const MyCircleButton = styled(TouchableOpacity)`
  background-color: grey;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  justify-content: center;
`;

export const MyButtonText = styled(Text)`
color: white;
text-align: center;
font-size: 12px;
`;

export const CenteredDiv = styled(View)`
  align-items: center;
`;