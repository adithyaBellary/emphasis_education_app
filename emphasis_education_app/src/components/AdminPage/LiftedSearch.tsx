import * as React from 'react';
import { useLazyQuery } from '@apollo/client';
import { Input, Icon } from 'react-native-elements';

import SearchResults from './Presentational/SearchResults';
import { SEARCH_USERS } from '../../queries/SearchUsers';
import { GeneralSpacing, LoadingComponent } from '../shared';

import { UserInfoType } from 'types/schema-types';
import { QuerySearchUsersArgs } from '../../../types/schema-types'

interface LiftedSearchProps {
  navigation: any;
}

const LiftedSearch: React.FC<LiftedSearchProps> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [runQuery, { data, loading }] = useLazyQuery<{ searchUsers: UserInfoType[] }, QuerySearchUsersArgs>(SEARCH_USERS)
  const handleTextChange = (text: string) => setSearchTerm(text)
  React.useEffect(() => {
    runQuery({variables: {searchTerm, includeAdmin: false}})
  }, [searchTerm])

  return (
    <>
      <GeneralSpacing u={20} r={15} d={10} l={15}>
        <Input
          placeholder='Search users'
          onChangeText={handleTextChange}
          leftIcon={
            <Icon
              name='search'
            />
          }
        />
      </GeneralSpacing>
      {loading ? <LoadingComponent loading={loading} /> : (
        <SearchResults
          searchResults={data ? data.searchUsers : []}
          navigation={navigation}
        />
      )}
    </>
  )
}

export default LiftedSearch;