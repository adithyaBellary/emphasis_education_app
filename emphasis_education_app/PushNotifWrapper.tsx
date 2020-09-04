import * as React from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native'

import { GeneralContext } from './src/components/Context/Context';

const getFCMToken = async () => {
  const fcmToken = await messaging().getToken();
}

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL
  if (enabled) {
    getFCMToken();
  }
}

// this is going to serve as a wrapper to request permissiong for push notis and such
const Wrapper: React.FC = ({ children }) => {

  const { incrementNotificationCounter } = React.useContext(GeneralContext);

  React.useEffect(() => {
    requestUserPermission()
  }, [])

  // when we open the app from a notification while the app is in the ebackground
  React.useEffect(() => {
    messaging().onNotificationOpenedApp(message => {
      console.log('we are coming from a background state', message)
      console.log('Platform', Platform.OS)
    })

    // return fcn;
  }, [])

  React.useEffect(() => {
    messaging().getInitialNotification().then(message => {
      if (message) {
        console.log('we are coming from a quit state', message)
        console.log('Platform', Platform.OS)
      }
    })
    // return fcn;
  }, [])

  React.useEffect(() => {
    // this should not be used to update state at all
    const unsub = messaging().setBackgroundMessageHandler(async payload => {
      console.log('i am being handled by the background message handler. this is the payload', payload)
      console.log('Platform', Platform.OS)
      incrementNotificationCounter(payload.data!.chatID)
    })

    return unsub
  }, [])

  React.useEffect(() => {
    const unsub = messaging().onMessage(async payload => {
      console.log('in on Message', payload)
      console.log('Platform', Platform.OS)
      incrementNotificationCounter(payload.data!.chatID)
    })

    return unsub
  }, [])

  return (
    <>{children}</>
  )
}

export default Wrapper;