import * as React from 'react';
import {
  ActivityIndicator, Alert
} from 'react-native'
import { useLazyQuery } from '@apollo/react-hooks';
import { Input, Icon } from 'react-native-elements';

import { SEARCH_CLASSES } from '../../queries/SearchClasses';
import { ISearchInput, ISearchClassesPayload } from '../../types';

import { ContentContain } from './common';
import ClassSearchResults from '../Search/ClassSearchResults';

const ClassSearch = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [runQuery, { data, loading, error }] = useLazyQuery<ISearchClassesPayload, ISearchInput>(SEARCH_CLASSES)
  const handleTextChange = (text: string) => setSearchTerm(text)
  React.useEffect(() => {
    runQuery({variables: {searchTerm}})
  }, [searchTerm])
  return (
    <ContentContain>
      <Input
        placeholder='Search Classes'
        onChangeText={handleTextChange}
        leftIcon={
          <Icon
            name='search'
          />
        }
        rightIcon={
          <Icon
            name='pluscircleo'
            type='antdesign'
            onPress={() => Alert.alert('this will make a new class')}
          />
        }
      />
      {loading ? <ActivityIndicator /> : (
        <ClassSearchResults
          searchResults={data ? data.searchClasses.classes: []}
        />
      )}
    </ContentContain>
  )
}

export default ClassSearch;
