import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onRegister: token => {
    console.log('on register,', token)
  },

  onNotification: notification => {
    console.log('on notification, ', notification)

    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onAction: action => {
    console.log('on action, ', action)
  },

  onRegistrationError: err => {
    console.log('on reg error', err)
  },

  onRemoteFetch: remoteFetch => {
    console.log('on remote fetch', remoteFetch)
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,

  requestPermissions: true
});

