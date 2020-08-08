import * as React from 'react';
import { Image } from 'react-native'
import { GeneralSpacing } from '../shared';

export const MissionStatement = () => (
  <GeneralSpacing u={0} r={0} d={0} l={0}>
    <Image
      source={require('../../images/MissionStatement.png')}
      style={{
        height: 100,
        width: 400,
        resizeMode: 'contain'
      }}
    />
  </GeneralSpacing>
)

export const HeaderTitle = () => (
  <GeneralSpacing u={0} r={0} d={0} l={0}>
    <Image
      source={require('../../images/HomePageHeaderTitle.png') }
      style={{
        height: 100,
        width: 400,
        resizeMode: 'contain',
        backgroundColor: 'grey',
        // padding: 0
      }}
    />
  </GeneralSpacing>
)

export const LogiImage = () => (
  <GeneralSpacing u={0} r={0} d={0} l={0}>
    <Image
      source={require('../../images/HomePageLogo.png')}
      style={{
        height: 200,
        width: 200,
      }}
    />
  </GeneralSpacing>
)