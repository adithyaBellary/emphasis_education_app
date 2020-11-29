import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import {IndividualResultButton } from '../common';
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
  <View style={{ flex: 1}}>
    <SearchResultsContain>
      {searchResults.map((results, index) => (
        <IndividualResultButton
          key={index}
          onPress={() => navigation.navigate(
            'MyProfile',
            {
              groupID: results.groupID,
              currentUserID: results._id
            }
          )}
        >
          <ThemedText size={14} type={FONT_STYLES.MAIN}>
            {results.firstName} { results.lastName}
          </ThemedText>
          <Icon
            name='user'
            type='antdesign'
          />
        </IndividualResultButton>
      ))}
    </SearchResultsContain>
  </View>
)

export default SearchResults;
