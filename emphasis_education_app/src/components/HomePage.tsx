import * as React from 'react';
// this will be needed to get the full screen dimensions
// ill need to know the screen dimensions to position all the widgets
import {
  View,
  Text,
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'

import HomePage from './Presentational/HomePage';

interface ILiftedHomeProps {
  navigation: any;
  route: any;
}

const GET_USER = gql`
  query GetUser($id: String!) {
    getUser(id: $id) {
      userType
    }
  }
`
interface UserType {
  userType: string
}

export interface GetUser {
  getUser: UserType;
}

interface GetUserInput {
  id: string;
}

const Home: React.FC<ILiftedHomeProps> = ( props ) => {
  const options = { variables: { id: props.route.params._id }}
  const { data, loading, error } = useQuery<
    GetUser,
    GetUserInput
      >(GET_USER, options)

  if (error) {
    console.log('there was an error getting the user')
    return <Text>There was an error getting the user</Text>
  }

  if (!data) {
    return <Text>Could not get the user for some reason</Text>
  }

  return (
    <>
    {loading ?
      <Text>Render a loading animation here or something</Text> :
      <HomePage data={data} {...props} />
    }
    </>
  )

}

export default Home;
