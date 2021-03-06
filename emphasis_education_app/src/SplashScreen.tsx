import * as React from 'react';
import { LogiImage } from './components/HomePage/logos'
import { View, Text } from 'react-native';

const Splash: React.FC<{ authLoading: boolean, token: string}> = ({ authLoading, token }) => {

  return (
    <View
      style={{
        alignItems: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <LogiImage />
    </View>
  )
}

export default Splash;