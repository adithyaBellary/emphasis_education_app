import * as React from 'react';
import { Icon } from 'react-native-elements';

import IndividualResult from '../AdminPage/IndividualResult';
import {
  ThemedText,
  GeneralSpacing,
  FONT_STYLES
} from '../shared';

import { UserInfoType } from '../../../types/schema-types';

interface SearchResultsProps {
  searchResults: UserInfoType[];
  navigation: any;
}

export const SearchResultsContainer: React.FC = ({ children }) => (
  <GeneralSpacing u={0} r={20} d={0} l={20}>
    {children}
  </GeneralSpacing>
);

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, navigation }) => (
  <SearchResultsContainer>
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
  </SearchResultsContainer>
)

export default SearchResults;
