import React from 'react';
import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {
  Text
} from 'react-native'

const SUB = gql`
  subscription {
    somethingChanged {
      email
    }
  }
`

const test_s: React.FC = () => {
  const {loading, data, error} = useSubscription(
    SUB,
    // {
    //   variables: {
    //     test: 'test'
    //   }
    // }
  )

  // console.log('the sub data');
  // console.log('hi' || data.somethingChanged);

  if (error) {
    console.log('error in the sub')
    return <Text>error</Text>
  }

  if (loading) {
    console.log('the sub is loading')
    return <Text>we are still loading</Text>
  }
  console.log('sub is successful')
  return <Text>{data.somethingChanged.email || 'hiii'}</Text>

}

export default test_s;
