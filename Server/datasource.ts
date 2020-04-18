// import * as firebase from 'firebase';
import firebaseSvc from './firebaseSvc';
import { RESTDataSource } from 'apollo-datasource-rest';
import { SHA256, MD5 } from "crypto-js"

import { messageType } from './types/messageType';

class dataSource extends RESTDataSource {
  constructor() {
    super();
  }

  getEverything() {
    const resp = firebaseSvc.get_stuff();
    console.log('the response');
    console.log(resp);
  }

  async login(user) {
    console.log(user)
    let res: boolean = true;
    await firebaseSvc.login(
      user,
      () => res = true,
      () => res = false
    )
    return res
  }

  async sendMessages(message: [messageType]) {
    await firebaseSvc.send(message)
  }

  async createUser(user) {
    await firebaseSvc.createUser(user);
  }

  async pushUser(user) {
    const ID: number = Math.round(Math.random() * 1000000);
    console.log(MD5('hi').toString());
    // const hash: string = MD5(user.email).toString();
    const hash: string = 'hash'
    await firebaseSvc.pushUser(user, hash);
  }

  getID() {
    return firebaseSvc.genID();
  }

  getUser(id: string) {
    return firebaseSvc.getUser(id);
  }
}

export default dataSource;
