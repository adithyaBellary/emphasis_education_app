import * as React from 'react';
import { LogiImage } from './components/HomePage/logos'
import { View, Text } from 'react-native';
import { VERSION } from './constant';
import { LoadingComponent } from './components/shared'

const Splash: React.FC<{ authLoading: boolean; token: string}> = ({ authLoading, token }) => {

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
      <LoadingComponent loading={authLoading} />
      <Text>You are running v{VERSION}</Text>
      <Text>Token: {token}</Text>
      <Text>If this screen is not going away</Text>
      <Text>try quitting out of the app and re-opening it</Text>
    </View>
  )
}

export default Splash;