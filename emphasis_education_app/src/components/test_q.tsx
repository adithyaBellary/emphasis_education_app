import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {
  Text,
} from 'react-native';

const q = gql`
  {
   test_q {
      name
      email
    }
  }
`;

const test: React.FC = () => {
  const {
    loading,
    error,
    data
  } = useQuery(q)

  if (loading) return <Text>loading</Text>
  if (error) return <Text>error</Text>
  if (!data) return <Text>no data dude</Text>

  // yuck dont like this
  console.log(data["test_q"].name);

  return <Text>hey</Text>
};


export default test;