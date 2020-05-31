import * as React from 'react';
import {
  View,
  Text
} from 'react-native';

import { IUser } from '../types';

interface ISearchResultsProps {
  searchResults: IUser[];
}

const SearchResults: React.FC<ISearchResultsProps> = ({ searchResults }) => {

  return (
    <View>
      {searchResults.map((results) => {
        return (
          <Text>
            {results.name}
          </Text>
        )
      })}
    </View>
  )
}

export default SearchResults;
