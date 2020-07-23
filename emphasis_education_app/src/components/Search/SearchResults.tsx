import * as React from 'react';
import { Icon } from 'react-native-elements';

import { IUser } from '../../types';
import IndividualResult from '../AdminPage/IndividualResult';
import {
  ThemedText,
  GeneralSpacing
} from '../shared';

interface ISearchResultsProps {
  searchResults: IUser[];
  navigation: any;
}

export const SearchResultsContainer: React.FC = ({ children }) => (
  <GeneralSpacing u={0} r={20} d={0} l={20}>
    {children}
  </GeneralSpacing>
);

const SearchResults: React.FC<ISearchResultsProps> = ({ searchResults, navigation }) => {
  return (
    <SearchResultsContainer>
      {searchResults.map((results, index) => {
        return (
          <IndividualResult
            key={index}
            // onPress={}
          >
            <ThemedText size={14} type='main'>
              {results.name}
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
      })}
    </SearchResultsContainer>
  )
}

export default SearchResults;
