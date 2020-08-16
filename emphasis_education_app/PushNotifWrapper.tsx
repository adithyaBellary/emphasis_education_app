import * as React from 'react';
import messaging from '@react-native-firebase/messaging';

// this is going to serve as a wrapper to request permissiong for push notis and such
const Wrapper: React.FC = ({ children }) => {

  React.useEffect(() => {
    requestUserPermission()
  }, [])

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL
    console.log('authStatus enabled? ', enabled )
  }

  return (
    <>
      {children}
    </>
  )
}

export default Wrapper;