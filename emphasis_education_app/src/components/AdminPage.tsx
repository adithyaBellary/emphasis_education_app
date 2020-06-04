import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Input } from 'react-native-elements';

interface IAdminPageProps {
  navigation: any;
  route: any;
}
const AdminPage: React.FC<IAdminPageProps> = props => {


  return (
    <Input
      placeholder='start searching for users'
    />
  )
}

export default AdminPage;
