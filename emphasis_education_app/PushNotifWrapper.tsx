import * as React from 'react';
import { useMutation } from '@apollo/client'
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import crashlytics from '@react-native-firebase/crashlytics';

import { GeneralContext } from './src/components/Context/Context';
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

// this is going to serve as a wrapper to request permissiong for push notis and such
const Wrapper: React.FC = ({ children }) => {

  const { updateNotifications, loggedUser } = React.useContext(GeneralContext);
  const [_mutation, {data, loading}] = useMutation(UPDATE_FCM_TOKENS);

  React.useEffect(() => {
    requestUserPermission()
  }, [])

  const onRefreshToken = async (email: string, token: string) => {
    await _mutation({
      variables: {
        email,
        token
      }
    })
    .then(( { data }) => {
      if (data?.updateFCMDeviceTokens.res) {
        crashlytics().log('update fcm tokens called')
      } else {
        crashlytics().log('update fcm tokens failed')
      }
    })
  }

  React.useEffect(() => {
    return messaging().onTokenRefresh(token => {
      onRefreshToken(loggedUser.email, token)
    })
  }, [loggedUser])

  React.useEffect(() => {
    // this should not be used to update state at all
    const unsub = messaging().setBackgroundMessageHandler(async payload => {
      if (payload.data) {
        const { chatID, isAdmin, emails } = payload.data;
        const relEmails = emails.split(',')
        updateNotifications(chatID, isAdmin === 'TRUE' ? true : false, relEmails)
      }
    })

    return unsub
  }, [])

  React.useEffect(() => {
    const unsub = messaging().onMessage(async payload => {
      if (payload.data) {
        const { chatID, isAdmin, emails } = payload.data;
        const relEmails = emails.split(',')
        updateNotifications(chatID, isAdmin === 'TRUE' ? true : false, relEmails)
      }
    })

    return unsub
  }, [])

  return (
    <>{children}</>
  )
}

export default Wrapper;