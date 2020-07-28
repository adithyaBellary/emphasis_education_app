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
  IconRow
} from '../shared';

import { IndividualResultContainer } from '../AdminPage/IndividualResult';

interface ICancelProps {
  onPress (): void;
}

// convert to SecondaryLink
const Cancel: React.FC<ICancelProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <ThemedText size={16} type='main'>
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
        <ThemedText size={16} type='main'>
          Done
        </ThemedText>
        {
          loading && <ActivityIndicator />
        }
      </IconRow>
    </GeneralSpacing>
  </TouchableOpacity>
)

interface IChatInfoProps {
  navigation: any;
}

const ChatInfo: React.FC<IChatInfoProps> = ({ navigation }) => {

  return (
    <SafeAreaView>
      <IndividualResultContainer>
        <Cancel onPress={() => navigation.goBack()} />
        <Done onPress={() => console.log('clicked')} loading={false} />

      </IndividualResultContainer>
      <Text>
        Chat Info
      </Text>
    </SafeAreaView>
  )
}

export default ChatInfo;
