import firebase from 'firebase';
import uuid from 'uuid';

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

  // TODO type this shit
  onLogout = user => {
    firebase.auth().signOut().then(() => {
      console.log('sign out is successful')
    }).catch((e) => {
      console.log('an error happened when signing out')
    })
  }

  // figure out this uuid business
  uid () {
    const curUser = firebase.auth().currentUser;
    if (!curUser) {
      console.log('the current user is null');
      // is this the right thing to be returning if the user is null?
      return null;
    } else {
      return curUser.uid;
    }
  }

  // _ref () {
  //   return firebase.database().ref('Messages');
  // }

  _ref() {
    return firebase.database().ref('Messages');
  }

  // TODO type this shit
  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: id } = snapshot;
    // needed for giftedChat
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    // add typing here
    const message = {
      id,
      _id,
      timestamp,
      text,
      user
    };

    return message;
  }

  // need to know more about this function
  refOn = callBack => {
    this._ref()
      .limitToLast(20)
      .on('child_added', (snapshot: any) => callBack(this.parse(snapshot)))
  }

  timeStamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  send = messages => {
    messages.forEach(element => {
      const { text, user } = element;
      const message = {
        text,
        user,
        createdAt: this.timeStamp()
      };
      console.log('sending a message');
      this._ref().push(message);
    });
  }

  refOff () {
    this._ref().off();
  }
}

const fireBaseSvc = new FireBaseSvc();
export default fireBaseSvc;
