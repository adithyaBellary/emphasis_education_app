import * as React from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import {
  GeneralSpacing,
  ThemedText,
  IconRow,
  FONT_STYLES,
  ContentContain
} from '../shared';

import { IndividualResultContainer } from '../AdminPage/IndividualResult';
import { ChatUserInfo } from 'src/types';

interface ICancelProps {
  onPress (): void;
}

// convert to SecondaryLink
const Cancel: React.FC<ICancelProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <ThemedText size={16} type={FONT_STYLES.MAIN}>
        Cancel
      </ThemedText>
    </GeneralSpacing>
  </TouchableOpacity>
)

interface IDoneProps {
  loading: boolean;
  onPress (): void
}

const Done: React.FC<IDoneProps> = ({ onPress, loading }) => (
  <TouchableOpacity onPress={onPress}>
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <IconRow>
        <ThemedText size={16} type={FONT_STYLES.MAIN}>
          Done
        </ThemedText>
        {
          loading && <ActivityIndicator animating={loading} />
        }
      </IconRow>
    </GeneralSpacing>
  </TouchableOpacity>
)

interface IChatInfoProps {
  navigation: any;
  route: any;
}

const ChatInfo: React.FC<IChatInfoProps> = ({ navigation, route }) => {
  const className: string = route.params.className;
  const tutorInfo: ChatUserInfo = route.params.tutorInfo;
  const userInfo: ChatUserInfo[] = route.params.userInfo;

  return (
    <SafeAreaView>
      <IndividualResultContainer>
        <Cancel onPress={() => navigation.goBack()} />
        <Done onPress={() => console.log('clicked')} loading={false} />

      </IndividualResultContainer>
      <ContentContain>
        <ThemedText size={14} type={FONT_STYLES.MAIN}>
          Class Name: {className}
        </ThemedText>
        <ThemedText size={14} type={FONT_STYLES.MAIN}>
          Tutor Name: {tutorInfo.firstName} {tutorInfo.lastName}
        </ThemedText>
        <ThemedText size={14} type={FONT_STYLES.MAIN}>User(s)</ThemedText>
        {userInfo.map(_user => (

          <ThemedText size={14} type={FONT_STYLES.MAIN}>
            {_user.firstName} {_user.lastName}
          </ThemedText>

        ))}
      </ContentContain>

    </SafeAreaView>
  )
}

export default ChatInfo;
