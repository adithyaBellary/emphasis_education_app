import * as React from 'react';
import {
  ActivityIndicator,
  View
} from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import { Input, Icon } from 'react-native-elements';
import styled from 'styled-components';

import SearchResults from './SearchResults';

import { ISearchUserPayload, ISearchInput } from '../types';
import { SEARCH_USERS } from '../queries/SearchUsers';

const SearchContain = styled(View)`
  padding-top: 20px;
`

const LiftedSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [runQuery, { data, loading, error }] = useLazyQuery<ISearchUserPayload, ISearchInput>(SEARCH_USERS)
  const handleTextChange = (text: string) => setSearchTerm(text)
  React.useEffect(() => {
    runQuery({variables: {searchTerm}})
  }, [searchTerm])
  console.log('data', data)

  return (
    <SearchContain>
      <Input
        placeholder='Search for users'
        onChangeText={handleTextChange}
        leftIcon={
          <Icon
            name='search'
          />
        }
      />
      {loading ? <ActivityIndicator /> : (
        <SearchResults
          searchResults={data ? data.searchUsers : []}
        />
      )}

    </SearchContain>
  )
}

export default LiftedSearch;