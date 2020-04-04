// import * as firebase from 'firebase';
import firebaseSvc from './firebaseSvc';

class dataSource {
  constructor() {

  }

  getEverything() {
    const resp = firebaseSvc.get_stuff();
    console.log('the response');
    console.log(resp);
  }
}

export default dataSource;
