import * as React from 'react';
import { Alert } from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client';
import { Input, Icon } from 'react-native-elements';

import { SEARCH_CLASSES } from '../../queries/SearchClasses';
import { ISearchInput, ISearchClassesPayload } from '../../types';
import ClassSearchResults from '../Search/ClassSearchResults';
import { ADD_CLASS } from '../../queries/AddClass';
import { GeneralSpacing, LoadingComponent } from '../shared';

const ClassSearch = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [runQuery, { data, loading, error }] = useLazyQuery<ISearchClassesPayload, ISearchInput>(SEARCH_CLASSES)
  const [runMut, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(ADD_CLASS);

  React.useEffect(() => {
    runQuery({variables: {searchTerm}})
  }, [searchTerm])

  const handleTextChange = (text: string) => setSearchTerm(text)
  const addClass = () => {
    if (!searchTerm) {
      Alert.alert('please enter a valid class name')
      return ;
    }
    runMut({ variables: {
      className: searchTerm
    }}).then(data => {
      console.log('data from add class', data)
      Alert.alert('made the class')
    })
  }

  return (
    <GeneralSpacing u={20} r={15} d={20} l={15}>
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
            onPress={addClass}
          />
        }
      />
      {loading ? <LoadingComponent loading={loading} /> : (
        <ClassSearchResults
          searchResults={data ? data.searchClasses.classes: []}
        />
      )}
    </GeneralSpacing>
  )
}

export default ClassSearch;
