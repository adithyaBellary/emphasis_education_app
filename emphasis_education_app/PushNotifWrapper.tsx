import * as React from 'react';
import { useMutation } from '@apollo/client'
import messaging from '@react-native-firebase/messaging';
import { Platform, Alert } from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { GeneralContext } from './src/components/Context/Context';
import { LOGIN_TOKEN } from './src/constant';
// import NotificationHandler, { MyNotificationHandler } from './PushNotificationHander';
import { UPDATE_FCM_TOKENS } from './src/queries/UpdateFCMTokens';

const getFCMToken = async () => {
  const fcmToken = await messaging().getToken().then(token => token);
  return fcmToken;
}

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL
  if (enabled) {
    Sentry.captureMessage(`user has permission ${authStatus}`)
    const t = getFCMToken();
  } else {
    Sentry.captureMessage(`user does not have permission ${authStatus}`)
  }
}

const triggerNotif = (title: string, message: string) => {
  PushNotification.localNotification({
    title,
    message,
  })
}

// const handler = new MyNotificationHandler();

// this is going to serve as a wrapper to request permissiong for push notis and such
const Wrapper: React.FC = ({ children }) => {

  const { incrementNotificationCounter, setNotificationBadge } = React.useContext(GeneralContext);
  // const [_mutation, {data, loading}] = useMutation(UPDATE_FCM_TOKENS);

  React.useEffect(() => {
    // PushNotification.requestPermissions()
    requestUserPermission()
    // console.log('permission is requested, ', Platform.OS)
  }, [])

  // React.useEffect(() => {
  //   const unsub = messaging().onTokenRefresh(async (newToken) => {
  //     const email = AsyncStorage.getItem(LOGIN_TOKEN)

  //   })

  //   return unsub;
  // }, [])

  // when we open the app from a notification while the app is in the ebackground
  React.useEffect(() => {
    messaging().onNotificationOpenedApp(async message => {
      console.log('we are coming from a background state', message)
      console.log('Platform', Platform.OS)
      // triggerNotif('title', 'onnotif opened app');
    })

    // return fcn;
  }, [])

  React.useEffect(() => {
    // this should not be used to update state at all
    const unsub = messaging().setBackgroundMessageHandler(async payload => {
      console.log('i am being handled by the background message handler. this is the payload', payload)
      console.log('Platform', Platform.OS)
      Sentry.captureMessage(`In the background message handler ${JSON.stringify(payload)}`)
      if (payload.data) {
        const { chatID, title, message } = payload.data;
        Sentry.captureMessage(`triggered the background message handler. triggering notif for chat: ${chatID}`)
        incrementNotificationCounter(chatID)
        // looks like we do not need to trigger the notif ourselves.
        // we can trigger the notification from the server itself
        // triggerNotif(title, message );
        setNotificationBadge(true)
      }
    })

    return unsub
  }, [])

  // this does not seem to be triggered. The first message from the server wakes the
  // app up and then the second one gets handled by the background handler
  React.useEffect(() => {
    messaging().getInitialNotification().then(async message => {
      if (message) {
        console.log('we are coming from a quit state', message)
        console.log('Platform', Platform.OS)
        triggerNotif('title', 'message');
      }
    })
    // return unsub;

  }, [])

  React.useEffect(() => {
    const unsub = messaging().onMessage(async payload => {
      Sentry.captureMessage(`in onMessage ${JSON.stringify(payload)}`)
      console.log('in on Message', payload)
      console.log('Platform', Platform.OS)
      incrementNotificationCounter(payload.data!.chatID)
      setNotificationBadge(true)
    })

    return unsub
  }, [])

  React.useEffect(() => {
    const unsub = messaging()
  }, [])

  return (
    <>{children}</>
  )
}

export default Wrapper;