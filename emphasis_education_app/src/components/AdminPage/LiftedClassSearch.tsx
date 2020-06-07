import * as React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { Input, Icon } from 'react-native-elements';

import { SEARCH_CLASSES } from '../../queries/SearchClasses';
import { ISearchInput } from '../../types';

const ClassSearch = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [runQuery, { data, loading, error }] = useLazyQuery<ISearchUserPayload, ISearchInput>(SEARCH_CLASSES)
  const handleTextChange = (text: string) => setSearchTerm(text)
  React.useEffect(() => {
    runQuery({variables: {searchTerm}})
  }, [searchTerm])

  return (
    <Input
      placeholder='Search Classes'
      onChangeText={handleTextChange}
      leftIcon={
        <Icon
          name='search'
        />
      }
    />
  )
}

export default ClassSearch;
