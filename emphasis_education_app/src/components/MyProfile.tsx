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
  // loggedUser needs to have the groupID as well, so that we can get the rest of the family mmembers
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
