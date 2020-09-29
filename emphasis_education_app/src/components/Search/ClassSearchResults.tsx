import * as React from 'react';
import { Text } from 'react-native';
import { ISearchClassesPayload } from '../../types';

import { SearchResultsContainer } from './SearchResults';
import IndividualResult from '../AdminPage/IndividualResult';
import { ThemedText, FONT_STYLES } from '../shared';

interface ClassSearchResultsProps {
  searchResults: string[];
}
const ClassSearchResults: React.FC<ClassSearchResultsProps> = ({ searchResults }) => {

  return (
    <SearchResultsContainer>
      {searchResults.map((result, index) => (
        <IndividualResult
          key={index}
        >
          <ThemedText
            size={14}
            type={FONT_STYLES.MAIN}
          >
            {result}
          </ThemedText>
        </IndividualResult>
      ))}
    </SearchResultsContainer>
  )
}

export default ClassSearchResults;
