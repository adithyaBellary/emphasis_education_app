import React from 'react';
// this will be needed to get the full screen dimensions
// ill need to know the screen dimensions to position all the widgets
import {
  View,
  Text
} from 'react-native';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'

import {
  ButtonContainer,
  MyButton,
  MyButtonText
} from './shared'

interface IHomeProps {
  navigation: any;
  route: any;
}

const HomeContainer = styled(View)`
`;

const GET_USER = gql`
  query GetUser($id: String!) {
    getUser(id: $id) {
      userType
    }
  }
`

const Home: React.FC<IHomeProps> = ( props ) => {
  const { data, loading, error } = useQuery(
    GET_USER,
    {
      variables: {
        id: props.route.params._id
      }
    }
  )

  if (error) {
    console.log('there was an error getting the user')
  }

  return (
    <>
    {loading ? <Text>loading</Text> :
    (<HomeContainer>
      <Text>
        hey guys
      </Text>
      <Text>
        emphasis education home page
      </Text>
      <Text>{data.getUser.userType}</Text>
      <ButtonContainer>
        <MyButton
          onPress={() => {
            props.navigation.navigate(
              'ChatPicker',
              {
                chatIDs: props.route.params.chatIDs,
                name: props.route.params.name,
                email: props.route.params.email,
                _id: props.route.params._id
              }
            )
          }}
        >
          <MyButtonText>go to chat picker</MyButtonText>
        </MyButton>
      </ButtonContainer>

    </HomeContainer>
    )}
    </>
  )

}

export default Home;
