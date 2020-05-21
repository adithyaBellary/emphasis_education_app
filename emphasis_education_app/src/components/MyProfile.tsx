import React, { useState, useEffect } from 'react';
import {
  Text,
  View
} from 'react-native';
import styled from 'styled-components';

interface IMyProfileProps {
  // TODO type the navagation props
  navigation: any;
  route: any;
}

const MyProfile: React.FC<IMyProfileProps> = () => {

  return (
    <View>
      <Text>
        My Profile
      </Text>
    </View>
  )
}

export default MyProfile;
