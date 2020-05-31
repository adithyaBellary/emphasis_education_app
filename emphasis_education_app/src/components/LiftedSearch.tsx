import * as React from 'react';
import {
  View,
  Text
} from 'react-native';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { Input } from 'react-native-elements';

import SearchResults from './SearchResults';

import { ISearchUserPayload, ISearchInput } from '../types';
import { SEARCH_USERS } from '../queries/SearchUsers';

const LiftedSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [runQuery, { data, loading, error }] = useLazyQuery<ISearchUserPayload, ISearchInput>(SEARCH_USERS)
  const handleTextChange = (text: string) => setSearchTerm(text)
  React.useEffect(() => {
    runQuery({variables: {searchTerm}})
  }, [searchTerm])
  console.log('data', data)

  return (
    <View>
      <Text>
        Search Component
      </Text>
      <Input
        placeholder='Search for users'
        onChangeText={handleTextChange}
      />
      <SearchResults
        searchResults={data ? data.searchUsers : []}
      />
    </View>
  )
}

export default LiftedSearch;