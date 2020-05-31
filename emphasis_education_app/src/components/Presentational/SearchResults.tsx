import * as React from 'react';
import {
  View,
  Text
} from 'react-native';

import { IUser } from '../../types';
import styled from 'styled-components';

interface ISearchResultsProps {
  searchResults: IUser[];
}

const SearchResultsContainer = styled(View)`
  padding: 0 20px;
`

const SearchResults: React.FC<ISearchResultsProps> = ({ searchResults }) => {

  return (
    <SearchResultsContainer>
      {searchResults.map((results) => {
        return (
          <Text>
            {results.name}
          </Text>
        )
      })}
    </SearchResultsContainer>
  )
}

export default SearchResults;
