import * as React from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import { Input, Icon } from 'react-native-elements';

import SearchResults from '../Search/SearchResults';
import { ISearchUserPayload, ISearchInput } from '../../types';
import { SEARCH_USERS } from '../../queries/SearchUsers';

import { ContentContain } from './common';

interface ILiftedSearchProps {
  navigation: any;
}

const LiftedSearch: React.FC<ILiftedSearchProps> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [runQuery, { data, loading, error }] = useLazyQuery<ISearchUserPayload, ISearchInput>(SEARCH_USERS)
  const handleTextChange = (text: string) => setSearchTerm(text)
  React.useEffect(() => {
    runQuery({variables: {searchTerm}})
  }, [searchTerm])
  console.log('data', data)

  return (
    <ContentContain>
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
          navigation={navigation}
        />
      )}

    </ContentContain>
  )
}

export default LiftedSearch;