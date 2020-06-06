import * as React from 'react';
import {
  Text,
  View,
} from 'react-native';
import styled from 'styled-components';
import { Icon } from 'react-native-elements';

import { IUser } from '../../types';
import IndividualResult from '../AdminPage/IndividualResult';

interface ISearchResultsProps {
  searchResults: IUser[];
  navigation: any;
}

const SearchResultsContainer = styled(View)`
  padding: 0 20px;
`

const SearchResults: React.FC<ISearchResultsProps> = ({ searchResults, navigation }) => {

  return (
    <SearchResultsContainer>
      {searchResults.map((results, index) => {
        return (
          <IndividualResult
            key={index}
          >
            <Text>
              {results.name}
            </Text>
            <Icon
              name='user'
              type='antdesign'
              onPress={() => navigation.navigate('UserProfile') }
            />
          </IndividualResult>
        )
      })}
    </SearchResultsContainer>
  )
}

export default SearchResults;
