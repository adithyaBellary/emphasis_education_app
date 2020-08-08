import * as React from 'react';
import { Image } from 'react-native'

export const MissionStatement = () => (
    <Image
      source={require('../../images/MissionStatement.png')}
      style={{
        height: 100,
        width: 400,
        resizeMode: 'contain'
      }}
    />
)

export const HeaderTitle = () => (
    <Image
      source={require('../../images/HomePageHeaderTitle.png') }
      style={{
        height: 100,
        width: 400,
        resizeMode: 'contain',
      }}
    />
)

export const LogiImage = () => (
    <Image
      source={require('../../images/HomePageLogo.png')}
      style={{
        height: 200,
        width: 200,
      }}
    />
)