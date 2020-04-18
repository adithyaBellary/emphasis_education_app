// import firebase from 'firebase';
import * as firebase from 'firebase';
import pubsub from './pubsub';

import { firebaseConfig } from './config/firebase';
import { URLSearchParams } from 'url';
import dataSource from './datasource';

const MESSAGES_REFMessage: string = 'Messages';
const User_REF_BASE: string = 'Users';
class FireBaseSVC {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    console.log('we are initializing');
    this.test_listen();
  }

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

  // TODO figure out typing for all this
  // might need to combine this firebase.User and my own userType
  onAuthStateChanged = (user) => {
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

  onLogout = () => {
    firebase.auth().signOut().then(() => {
      console.log('sign out is successful')
    }).catch((e) => {
      console.log('an error happened when signing out')
    })
  }

  createUser = async (user) => {
    firebase.auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(() => {
        console.log('successfully created the user');
        const newUser = firebase.auth().currentUser
        newUser.updateProfile({ displayName: user.name})
          .then(() => {
            console.log('all done creating the user');
          }), e => console.log('an error updating the display name');
      }), e => {
        console.log('there was an error creating the user', e);
      }
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

  _refMessage() {
    return firebase.database().ref(MESSAGES_REFMessage);
  }

  _refUser(ID: string) {
    return firebase.database().ref(`${User_REF_BASE}/${ID}`);
    // return firebase.database().ref(`${User_REF_BASE}/adi@gmail`);
  }

  async pushUser({ email, password}, hash) {
    const user_and_id = {
      email,
      password,
      _id: hash
    }
    // create hash
    await this._refUser(hash).push(user_and_id);
    // TODO figure out how to link email with ID
    // await firebase.database().ref('UsersMap').push({
    //   email,
    //   _id: ID
    // })
  }

  // TODO type this shit
  // define typing of the snapshot
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

  get_stuff() {
    this._refMessage()
    .on('value', snapshot => {
      return snapshot.val()
    })
  }

  // need to know more about this function
  refOn = callBack => {
    this._refMessage()
      .limitToLast(20)
      .on('value', (snapshot) => callBack(this.parse(snapshot)))
  }

  test_listen() {
    console.log('listener is on')
    this._refMessage()
    .on('child_added', () => {
      pubsub.publish("somethingChanged", { somethingChanged: { name: 'nameeee', email: 'emaillll'} })
      console.log('published to pubsub')
    })
  }

  timeStamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  send = async messages => {
    console.log('messages');
    console.log(messages);
    messages.forEach(async element => {
      const { text, user } = element;
      const message = {
        text,
        user,
        createdAt: this.timeStamp()
      };
      console.log('sending a message');
      await this._refMessage().push(message);
      console.log('message was pushed');
      // this.test_listen();
    });
  }

  refOff () {
    this._refMessage().off();
  }

  genID() {
    return Math.round(Math.random() * 1000000);
  }

  async push_test() {
    await this._refMessage().push({
      name: 'name',
      email: 'email'
    })
  }

  getUser(id: string) {
    return firebase.database().ref(`Users/${id}`).once('value').then(snap => {
      const val = snap.val()
      const key = Object.keys(val)[0];
      return val[key]
    })
  }
}

const firebaseSvc = new FireBaseSVC();
export default firebaseSvc;
