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
    return <Text>error</Text>
  }

  if (loading) {
    return <Text>we are still loading</Text>
  }
  return <Text>{data.somethingChanged.email}</Text>

}

export default test_s;
