// import * as firebase from 'firebase';
import firebaseSvc from './firebaseSvc';
import { RESTDataSource } from 'apollo-datasource-rest';

class dataSource extends RESTDataSource {
  constructor() {
    super();
  }

  getEverything() {
    const resp = firebaseSvc.get_stuff();
    console.log('the response');
    console.log(resp);
  }

  async login(user, success_callback, error_callback) {
    console.log(user)
    await firebaseSvc.login(
      user,
      success_callback,
      error_callback
    )
    console.log('in the data source');
  }
}

export default dataSource;
