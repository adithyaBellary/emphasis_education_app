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
import { NOTIFICATIONS_KEY } from './src/constant';

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

const updateNotifStorage = async (chatID: string) => {
  const oldVal = await AsyncStorage.getItem(NOTIFICATIONS_KEY)
  if (oldVal) {
    const oldDictionary = JSON.parse(oldVal);
    if (Object.keys(oldDictionary).length > 0) {
      const newDic = {
        ...oldDictionary,
        [chatID]: true
      }
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newDic))
    }
  } else {
    const newNotifDictionary = {
      [chatID]: true
    }
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newNotifDictionary))
  }
}

// this is going to serve as a wrapper to request permissiong for push notis and such
const Wrapper: React.FC = ({ children }) => {

  const { updateNotifications, setNotificationBadge, setNotifications } = React.useContext(GeneralContext);
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
      setNotificationBadge(true)
      // triggerNotif('title', 'onnotif opened app');
    })

    // return fcn;
  }, [])

  React.useEffect(() => {
    // this should not be used to update state at all
    const unsub = messaging().setBackgroundMessageHandler(async payload => {
      console.log('i am being handled by the background message handler.')
      // console.log('Platform', Platform.OS)
      // Sentry.captureMessage(`In the background message handler ${JSON.stringify(payload)}`)
      if (payload.data) {
        const { chatID, isAdmin, title, message } = payload.data;
        // incrementNotificationCounter(chatID)
        // triggerNotif(title, message );
        // setNotificationBadge(true)
        // console.log('updating the local storage in the setbackground message handler')
        console.log('isadmin in setBackgroundMessageHandler', isAdmin)
        updateNotifications(chatID, isAdmin === 'TRUE' ? true : false)
        // await updateNotifStorage(chatID)
      }
    })

    return unsub
  }, [])

  React.useEffect(() => {
    const initializeNotifDictionary = async () => {
      const oldVal = await AsyncStorage.getItem(NOTIFICATIONS_KEY)
      if (oldVal) {
        const oldDict = JSON.parse(oldVal)
        console.log('old dict in initialization', oldDict)
        setNotifications(oldDict)
      }
    }
    initializeNotifDictionary()

  }, [])

  // this gets triggered when the app is quit and we click on the push notification
  React.useEffect(() => {
    messaging().getInitialNotification().then(async message => {
      if (message) {
        console.log('we are coming from a quit state', message)
        // console.log('Platform', Platform.OS)
        // triggerNotif('title', 'message');
      }
    })
    // return unsub;

  }, [])

  React.useEffect(() => {
    const unsub = messaging().onMessage(async payload => {
      if (payload.data) {
        const { chatID, title, message } = payload.data;
        // triggerNotif('New Message', 'You received a new message');
        // incrementNotificationCounter(payload.data!.chatID)
        // setNotificationBadge(true)
        await updateNotifStorage(chatID)
      }
    })

    return unsub
  }, [])

  return (
    <>{children}</>
  )
}

export default Wrapper;