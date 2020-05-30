import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View
} from 'react-native';
import styled from 'styled-components';
import Context from './Context/Context';

interface IMyProfileProps {
  // TODO type the navagation props
  navigation: any;
  route: any;
}

const MyProfile: React.FC<IMyProfileProps> = () => {
  const { loggedUser } = useContext(Context);
  console.log('loggedUser', loggedUser);
  return (
    <View>
      <Text>
        My Profile
      </Text>
    </View>
  )
}

export default MyProfile;
