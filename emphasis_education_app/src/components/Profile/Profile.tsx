import * as React from 'react';
import {
  View,
  Text
} from 'react-native';
import styled from 'styled-components';
import { Icon } from 'react-native-elements';

import { IUser } from '../../types';
import Context from '../Context/Context';
import { ContentContain, IndividualField, HorizontalDivider } from '../shared';

interface IProfileProps {
  editing: boolean;
  // mainUserID: string;
  family: IUser[];
}

const Title = styled(Text)`
  text-align: center;
  fontFamily: ${({ theme }) => theme.font.bold};
  font-size: 30px;
  padding: 10px 0;
`;

const Profile: React.FC<IProfileProps> = ({ family, editing }) => {

  const {loggedUser} = React.useContext(Context);
  if (!loggedUser) { return <View><Text>could not find the user.</Text></View>; }

  let mainUserCopy = Object.assign({}, loggedUser)

  const onChangeText = (text: string, label: string) => {
    if (label === 'Email') { mainUserCopy.email = text }
    if (label === 'Phone Number') { mainUserCopy.phoneNumber = text }

    console.log('mainUserCopy', mainUserCopy)
  }

  return (
    <ContentContain>
      <Title>{loggedUser.name}</Title>
      <IndividualField
        value={loggedUser.email}
        valueSize={16}
        label={'Email'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />
      {!editing && <HorizontalDivider width={80} />}
      <IndividualField
        value={loggedUser.phoneNumber}
        valueSize={16}
        label={'Phone Number'}
        labelSize={14}
        editing={editing}
        onChangeText={onChangeText}
      />

      {/* list the classes */}
      {/* lets not have this be editable */}
      {loggedUser.classes && loggedUser.classes.map(c => (
        <IndividualField
          value={c.className!}
          valueSize={16}
          label={'class'}
          labelSize={14}
        />
      ))}
      <Title>Family Members</Title>
      {
        family.map((user, index) => (
          <>
            {(user._id !== loggedUser._id) && (
              <>
                <IndividualField
                  // key={index}
                  value={user.name}
                  valueSize={16}
                  label={'Name'}
                  labelSize={14}
                />
                <IndividualField
                  // key={index}
                  value={user.email}
                  valueSize={16}
                  label={'Email'}
                  labelSize={14}
                />
              </>
            )}
          </>
        ))}
    </ContentContain>
  )
}

export  default Profile;
