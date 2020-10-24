import * as React from 'react';
import { Image } from 'react-native';

import {
  HomePageHeaderTitleEncoded,
  HomePageLogoEncoded,
  MissionStatementEncoded
} from '../../images/base64'

export const MissionStatement = () => (
  <Image
    // source={require('../../images/MissionStatement.png')}
    source={{
      uri: MissionStatementEncoded
    }}
    style={{
      height: 100,
      width: 400,
      resizeMode: 'contain'
    }}
  />
)

export const HeaderTitle = () => (
  <Image
    // source={require('../../images/HomePageHeaderTitle.png') }
    source={{
      uri: HomePageHeaderTitleEncoded
    }}
    style={{
      height: 100,
      width: 400,
      resizeMode: 'contain',
    }}
  />
)

export const LogiImage = () => (
  <Image
    // source={require('../../images/HomePageLogo.png')}
    source={{
      uri: HomePageLogoEncoded
    }}
    style={{
      height: 200,
      width: 200,
    }}
  />
)