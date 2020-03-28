import firebase from 'firebase';

import { firebaseConfig } from './config/firebase';

class FireBaseSvc {
  constructor() {
    // if (!firebase.app.length){
    //   console.log('we are initializing');
    //   firebase.initializeApp(firebaseConfig);
    // } else {
    //   console.log('we already have a firebase app running');
    // }
    firebase.initializeApp(firebaseConfig);
    console.log('we are initializing');
    console.log('num apps: ' + firebase.app.length);
  }

  // need to make sure that these users are present in the firebase database
  login = async (user, success_callback, error_callback) => {
    console.log('logging in');
    const output = await firebase.auth().signInWithEmailAndPassword(
      user.email,
      user.password
    )
    .then(success_callback, error_callback);
  }

  observeAuth = () => {
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  // TODO figure out typing for all this shit
  onAuthStateChanged = user => {
    if ( !user ) {
      try {
        this.login(
          user,
          () => console.log('success'),
          () => console.log('error')
        );
      } catch ({ message }) {
        console.log('failed: ' + message);
      }
    } else {
      console.log('reusing auth');
    }
  }
}

const fireBaseSvc = new FireBaseSvc();
export default fireBaseSvc;
