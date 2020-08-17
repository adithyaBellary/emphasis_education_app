import * as React from 'react';
import messaging from '@react-native-firebase/messaging';

const getFCMToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('fcm token', fcmToken)
  } else {
    console.log('failed')
  }
}

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL
  console.log('authStatus enabled? ', enabled )
  if (enabled) {
    getFCMToken();
  }
}
// this is going to serve as a wrapper to request permissiong for push notis and such
const Wrapper: React.FC = ({ children }) => {

  React.useEffect(() => {
    requestUserPermission()
  }, [])

  return (
    <>
      {children}
    </>
  )
}

export default Wrapper;