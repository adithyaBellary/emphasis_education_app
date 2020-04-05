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

  async login(user) {
    console.log(user)
    let res: boolean = true;
    await firebaseSvc.login(
      user,
      () => res = true,
      () => res = false
    )
    console.log('in the data source');
    console.log(res);
    return res
  }
}

export default dataSource;
