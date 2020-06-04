import * as React from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import styled from 'styled-components';

import { Permission } from '../types';
import Context from './Context/Context';

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

// TODO make this em or %. not straight px
export const IconSection = styled(View)`
  width: 100%;
  padding: 150px 0 100px 0;
  align-items: center;
`;

interface IPermissionProps {
  allowedPermission: Permission;
}

export const PermissionedComponent: React.FC<IPermissionProps> = ({ allowedPermission, children}) => {
  const {loggedUser} = React.useContext(Context)

  if(loggedUser.userType === allowedPermission) {
    return <>{children}</>
  } else {
    return null;
  }
}