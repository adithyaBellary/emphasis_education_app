// import * as firebase from 'firebase';
import firebaseSvc from './firebaseSvc';
import { RESTDataSource } from 'apollo-datasource-rest';
import { SHA256, MD5 } from "crypto-js"

import { messageType } from './types/messageType';

class dataSource extends RESTDataSource {
  constructor() {
    super();
  }

  async getMessages(id) {
    const resp = await firebaseSvc.getMessages(id);
    // console.log('in datasource');
    // console.log(resp);
    return resp
  }

  async login(user) {
    const response = await firebaseSvc.login(user)
    return response
  }

  async sendMessages(message: [messageType]) {
    const res =  await firebaseSvc.send(message)
    return res;
  }

  async createUser(user) {
    await firebaseSvc.createUser(user);
  }

  async pushUser(user, userType) {
    const hash: string = MD5(user.email).toString();
    await firebaseSvc.pushUser(user, hash, userType);
  }

  getID() {
    return firebaseSvc.genID();
  }

  getUser(id: string) {
    return firebaseSvc.getUser(id);
  }
}

export default dataSource;
