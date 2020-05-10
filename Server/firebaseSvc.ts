// import firebase from 'firebase';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { MD5 } from "crypto-js"

import pubsub from './pubsub';
import { firebaseConfig } from './config/firebase';
import { MESSAGE_RECEIVED_EVENT, NUM_INIT_MESSAGES } from './constants';
import { IMessage } from './types/IMessage';
import { IMessagePayload } from './types/IMessagePayload';

const MESSAGE_REF_BASE: string = 'Messages';
const User_REF_BASE: string = 'Users';

class FireBaseSVC {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    console.log('we are initializing');
    this.test_listen();
  }

  getChatId = async (user) => {
    const hash: string = MD5(user.email).toString();
    const curUser = await this.getUser(hash);
    return curUser.chatIDs;
  }

  login = async (user) => {
    console.log('logging inn');
    let res: boolean;
    const output = await firebase.auth().signInWithEmailAndPassword(
      user.email,
      user.password
    )
    .then(
      () => res = true,
      () => res = false
    );
    const chatIDs = await this.getChatId(user);
    return {
      res,
      chatIDs
    }

  }

  // observeAuth = () => {
  //   firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  // }

  // TODO figure out typing for all this
  // might need to combine this firebase.User and my own userType
  // onAuthStateChanged = (user) => {
  //   if ( !user ) {
  //     try {
  //       this.login(
  //         user,
  //         () => console.log('success'),
  //         () => console.log('error')
  //       );
  //     } catch ({ message }) {
  //       console.log('failed: ' + message);
  //     }
  //   } else {
  //     console.log('reusing auth');
  //   }
  // }

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

  _refMessage(chatPath: string) {
    return firebase.database().ref(`${MESSAGE_REF_BASE}/${chatPath}`);
  }

  _refUser(ID: string) {
    return firebase.database().ref(`${User_REF_BASE}/${ID}`);
  }

  async pushUser({ email, password}, hash, userType) {
    // generate type for user
    const testChatIds: Array<string> = ['test'];
    const user_and_id = {
      email,
      password,
      _id: hash,
      userType: userType,
      chatIDs: testChatIds
    }
    await this._refUser(hash).push(user_and_id);
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

  getMessages = async (id: string) => {
    const chatHash: string = MD5(id).toString();
    return await this._refMessage(chatHash)
      .limitToLast(NUM_INIT_MESSAGES)
      .once('value')
      .then(snap => {
        const val = snap.val();
        console.log(val);
        const key = Object.keys(val)
        const mess = key.map(k => {
          const {messageID, ...rest} = val[k];
          return {
            ...rest,
            _id: val[k].messageID
          }
        })
        return mess
      })
  }

  // need to know more about this function
  // refOn = callBack => {
  //   this._refMessage()
  //     .limitToLast(20)
  //     .on('value', (snapshot) => callBack(this.parse(snapshot)))
  // }

  test_listen() {
    console.log('listener is on')
    this._refMessage('')
    // .limitToLast(1)
    .on('child_changed', (snapshot) => {
      console.log('snapshot', snapshot.val())
      console.log('snapshot', snapshot.ref.key)
      const val = snapshot.val();
      // get the last key
      const key = Object.keys(val).slice(-1)[0]
      pubsub.publish(MESSAGE_RECEIVED_EVENT, {
        messageReceived: {
          MessageId: val[key].messageID,
          text: val[key].text,
          createdAt: val[key].createdAt,
          user: val[key].user
        }
      })
      console.log('published to pubsub')

    })

    // this is the listener for a new child (chat) being added
    this._refMessage('')
      .on('child_added', (snap) => {
        const snapVal = snap.val();
        const key = Object.keys(snapVal)[0];
        console.log('child added')
        console.log(snapVal)
        console.log(snap.ref.key)
        // publish to the pubsub bring this out
        pubsub.publish(MESSAGE_RECEIVED_EVENT, {
          messageReceived: {
            MessageId: snapVal[key].messageID,
            text: snapVal[key].text,
            createdAt: snapVal[key].createdAt,
            user: snapVal[key].user
          }
        })
      })
  }

  timeStamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  send = (messages: IMessage[]): IMessagePayload => {
    // TODO refactor all this rip
    // console.log('sending these messages: ', messages);
    let myText;
    let myMesID;
    let myCreatedAt;
    let myUser;
    messages.forEach(async (element: IMessage) => {
      const { text, user, chatID } = element;
      myMesID = this.genID();
      const message = {
        text,
        user,
        createdAt: moment().format(),
        messageID: myMesID
      };
      myText = text;
      myCreatedAt = message.createdAt
      myUser = user;
      const hashChatID: string = MD5(chatID).toString();
      await this._refMessage(hashChatID).push(message);
      console.log('message was pushed');
    });
    return {
      text: myText,
      MessageId: myMesID,
      createdAt: myCreatedAt,
      user: myUser
    }
  }

  refOff () {
    this._refMessage('').off();
  }

  genID() {
    return Math.round(Math.random() * 10000000);
  }

  async push_test(chatPath: string) {
    await this._refMessage(chatPath).push({
      name: 'name',
      email: 'email'
    })
  }

  async getUser(id: string) {
    // need await!!
    const user = await firebase.database().ref(`Users/${id}`).once('value')
      .then(snap => {
        const val = snap.val()
        const key = Object.keys(val)[0];
        return val[key]
      })
    return user;
  }
}

const firebaseSvc = new FireBaseSVC();
export default firebaseSvc;
