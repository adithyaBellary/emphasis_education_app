import * as React from 'react';
import {
  ActivityIndicator
} from 'react-native'
import { useLazyQuery } from '@apollo/react-hooks';
import { Input, Icon } from 'react-native-elements';

import { SEARCH_CLASSES } from '../../queries/SearchClasses';
import { ISearchInput, ISearchClassesPayload } from '../../types';

import { SearchContain } from './LiftedSearch';
import ClassSearchResults from '../Presentational/ClassSearchResults';

const ClassSearch = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [runQuery, { data, loading, error }] = useLazyQuery<ISearchClassesPayload, ISearchInput>(SEARCH_CLASSES)
  const handleTextChange = (text: string) => setSearchTerm(text)
  React.useEffect(() => {
    runQuery({variables: {searchTerm}})
  }, [searchTerm])
  console.log('data in class search', data)
  return (
    <SearchContain>
      <Input
        placeholder='Search Classes'
        onChangeText={handleTextChange}
        leftIcon={
          <Icon
            name='search'
          />
        }
      />
      {loading ? <ActivityIndicator /> : (
        <ClassSearchResults
          searchResults={data ? data.searchClasses.classes: []}
        />
      )}
    </SearchContain>
  )
}

export default ClassSearch;
