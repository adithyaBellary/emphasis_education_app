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
}

const SearchResultsContainer = styled(View)`
  padding: 0 20px;
`

const SearchResults: React.FC<ISearchResultsProps> = ({ searchResults }) => {

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
            />
          </IndividualResult>
        )
      })}
    </SearchResultsContainer>
  )
}

export default SearchResults;
