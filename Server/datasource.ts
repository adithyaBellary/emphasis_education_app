// import * as firebase from 'firebase';
import firebaseSvc from './firebaseSvc';
import { RESTDataSource } from 'apollo-datasource-rest';
import { SHA256, MD5 } from "crypto-js"

import { IMessage } from './types/IMessage';

class dataSource extends RESTDataSource {
  constructor() {
    super();
  }

  async getMessages(chatID, init) {
    const resp = await firebaseSvc.getMessages(chatID, init);
    // console.log('in datasource');
    // console.log(resp);
    return resp
  }

  async login(user) {
    const response = await firebaseSvc.login(user)
    return response
  }

  async sendMessages(message: IMessage[]) {
    const res = await firebaseSvc.send(message)
    console.log('res', res)
    return res;
  }

  async createUser(email: string, password: string, name: string) {
    console.log('user in datasource being created', email, password, name)
    await firebaseSvc.createUser(email, password, name);
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
