import {
  TextInput,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import styled from 'styled-components';

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

const d: number = 150;
export const MyCircleButton = styled(TouchableOpacity)`
  background-color: ${({theme}) => theme.primary.backgroundColor };
  width: ${d}px;
  height: ${d}px;
  border-radius: ${d/2}px;
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

const x: number = 300;
export const ConcentricIcons = styled(View)`
  height: ${x}px;
  width: ${x}px;
  background-color: grey;
  `;
  // border-radius: 100px;

  export const OverallContain = styled(View)`
    width: 100%;
    align-items: center;
    padding: 50px;
  `;