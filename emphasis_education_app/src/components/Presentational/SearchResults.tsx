import * as React from 'react';
import {
  View,
} from 'react-native';
import styled from 'styled-components';

import { IUser } from '../../types';
import IndividualResult from '../Search/IndividualResult';

interface ISearchResultsProps {
  searchResults: IUser[];
}

const SearchResultsContainer = styled(View)`
  padding: 0 20px;
  background-color: grey;
`

const SearchResults: React.FC<ISearchResultsProps> = ({ searchResults }) => {

  return (
    <SearchResultsContainer>
      {searchResults.map((results, index) => {
        return (
          <IndividualResult
            key={index}
          >
            {results.name}
          </IndividualResult>
        )
      })}
    </SearchResultsContainer>
  )
}

export default SearchResults;
