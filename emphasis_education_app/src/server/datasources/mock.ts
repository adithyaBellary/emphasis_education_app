import firebase from 'firebase';
// is this going to instantiate another instance of the firebase service?
// i feel like no, because we are exporting the instance of the class that is
// being created
import firebaseSvc from '../../service/FireBaseSvc';

class DataSource {
  constructor() {
    // super();
  }

  getEverything() {
    const resp = firebaseSvc.get_stuff();
    console.log('the response');
    console.log(resp);

    return resp;
  }
}
export default DataSource;
// module.exports = DataSource;
