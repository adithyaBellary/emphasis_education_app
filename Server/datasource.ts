// import * as firebase from 'firebase';
import firebaseSvc from './firebaseSvc';
import { RESTDataSource } from 'apollo-datasource-rest';
import { SHA256, MD5 } from "crypto-js"

import { IMessage } from './types/IMessage';
import { Permission } from './types/schema-types';

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

  createUser(email: string, password: string, name: string) {
    console.log('user in datasource being created', email, password, name)
    firebaseSvc.createUser(email, password, name);
  }

  async pushUser(name: string, email: string, userType: Permission, phoneNumber: string, groupID: string) {
    const hash: string = MD5(email).toString();
    await firebaseSvc.pushUser(name, email, userType, phoneNumber, hash, groupID);
  }

  getID() {
    return firebaseSvc.genID();
  }

  getUser(id: string) {
    return firebaseSvc.getUser(id);
  }
}

export default dataSource;
