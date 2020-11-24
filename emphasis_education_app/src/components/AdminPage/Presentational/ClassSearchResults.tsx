import * as React from 'react';
import { View } from 'react-native';

import { SearchResultsContain } from '../../Search/common';
import { IndividualResultContainer } from '../common';
import { ThemedText, FONT_STYLES } from '../../shared';

interface ClassSearchResultsProps {
  searchResults: string[];
}
const ClassSearchResults: React.FC<ClassSearchResultsProps> = ({ searchResults }) => (
  <View>
    <SearchResultsContain>
      {searchResults.map((result, index) => (
        <IndividualResultContainer
          key={index}
        >
          <ThemedText
            size={14}
            type={FONT_STYLES.MAIN}
          >
            {result}
          </ThemedText>
        </IndividualResultContainer>
      ))}
    </SearchResultsContain>
  </View>
)

export default ClassSearchResults;
