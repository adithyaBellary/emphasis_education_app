import * as React from 'react';
import { Text } from 'react-native';
import { ISearchClassesPayload } from '../../types';

import { SearchResultsContainer } from './SearchResults';
import IndividualResult from '../AdminPage/IndividualResult';

interface IClassSearchResultsProps {
  searchResults: string[];
}
const ClassSearchResults: React.FC<IClassSearchResultsProps> = ({ searchResults }) => {

  return (
    <SearchResultsContainer>
      {searchResults.map((result, index) => (
        <IndividualResult
          key={index}
        >
          <Text>{result}</Text>
        </IndividualResult>
      ))}
    </SearchResultsContainer>
  )
}

export default ClassSearchResults;
