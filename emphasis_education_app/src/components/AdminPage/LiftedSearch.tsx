import * as React from 'react';
import {
  ActivityIndicator,
} from 'react-native';
import { useLazyQuery } from '@apollo/client';
import { Input, Icon } from 'react-native-elements';

import SearchResults from '../Search/SearchResults';
import { ISearchInput } from '../../types';
import { SEARCH_USERS } from '../../queries/SearchUsers';

import { UserInfoType } from 'types/schema-types';
import { GeneralSpacing } from '../shared';

interface LiftedSearchProps {
  navigation: any;
}

const LiftedSearch: React.FC<LiftedSearchProps> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [runQuery, { data, loading, error }] = useLazyQuery<{ searchUsers: UserInfoType[] }, ISearchInput>(SEARCH_USERS)
  const handleTextChange = (text: string) => setSearchTerm(text)
  React.useEffect(() => {
    runQuery({variables: {searchTerm}})
  }, [searchTerm])

  return (
    <GeneralSpacing u={20} r={15} d={20} l={15}>
      <Input
        placeholder='Search for users'
        onChangeText={handleTextChange}
        leftIcon={
          <Icon
            name='search'
          />
        }
      />
      {loading ? <ActivityIndicator animating={loading} /> : (
        <SearchResults
          searchResults={data ? data.searchUsers : []}
          navigation={navigation}
        />
      )}
    </GeneralSpacing>
  )
}

export default LiftedSearch;