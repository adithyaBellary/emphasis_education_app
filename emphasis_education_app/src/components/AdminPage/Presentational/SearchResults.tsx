import * as React from 'react';
import { Icon } from 'react-native-elements';

import IndividualResult from '../common';
import {
  ThemedText,
  GeneralSpacing,
  FONT_STYLES
} from '../../shared';
import { UserInfoType } from '../../../../types/schema-types';

import { SearchResultsContain } from '../../Search/common';

interface SearchResultsProps {
  searchResults: UserInfoType[];
  navigation: any;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, navigation }) => (
  <SearchResultsContain>
    {searchResults.map((results, index) => (
      <IndividualResult
        key={index}
      >
        <ThemedText size={14} type={FONT_STYLES.MAIN}>
          {results.firstName} { results.lastName}
        </ThemedText>
        <Icon
          name='user'
          type='antdesign'
          onPress={() => navigation.navigate(
            'MyProfile',
            {
              groupID: results.groupID,
              currentUserID: results._id
            }
          )}
        />
      </IndividualResult>
      )
    )}
  </SearchResultsContain>
)

export default SearchResults;
