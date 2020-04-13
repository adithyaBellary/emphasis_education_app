import dataSource from './datasource';

const test_datasource = new dataSource();
test_datasource.sendMessages( [
  {
    id: 0,
    text: 'test message',
    user: {
      _id: 0,
      name: 'tst user'
    }
  }]
)
console.log('sent messages from test');
