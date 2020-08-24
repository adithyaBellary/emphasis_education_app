import * as React from 'react';
import messaging from '@react-native-firebase/messaging';

const getFCMToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('got fcm token')
  } else {
    console.log('failed')
  }
}

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL
  if (enabled) {
    getFCMToken();
  }
}

// TODO: write the push notif handler functions

// this is going to serve as a wrapper to request permissiong for push notis and such
const Wrapper: React.FC = ({ children }) => {

  React.useEffect(() => {
    requestUserPermission()
  }, [])

  React.useEffect(() => {
    // this should not be used to update state at all
    const unsub = messaging().setBackgroundMessageHandler(async payload => {
      console.log('i am being handled by the background message handler. this is the payload', payload)
    })

    return unsub
  }, [])

  React.useEffect(() => {
    const unsub = messaging().onMessage(async payload => {
      console.log('in on Message', payload)
    })

    return unsub
  }, [])

  return (
    <>
      {children}
    </>
  )
}

export default Wrapper;