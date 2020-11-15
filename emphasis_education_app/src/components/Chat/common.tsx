import * as React from 'react';
import { View } from 'react-native'
import styled from 'styled-components';

import {
  FONT_STYLES,
  GeneralSpacing,
  IconRow,
  LoadingComponent,
  ThemedText,
} from '../shared';

const EmptyChatWrapper: React.FC = ({ children }) => (
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <ThemedText size={16} type={FONT_STYLES.LIGHT}>
        {children}
      </ThemedText>
    </GeneralSpacing>
);

export const EmptyChatPicker: React.FC = () => (
  <View style={{ alignItems: 'center' }}>
  <EmptyChatWrapper>
    You are currently not added to any Chats.
    Please reach out to either Shweta or Sakthi to be added to one.
  </EmptyChatWrapper>
  </View>
);

export const EmptyChat: React.FC = () => (
  <View style={{ alignItems: 'center', transform: [{ scaleY: -1}] }}>
    <EmptyChatWrapper>
      This is the beginning of your conversation. Let's talk!
    </EmptyChatWrapper>
  </View>
);

export const LoadingScreen: React.FC<{ loading: boolean }> = ({ loading }) => (
  <View>
    <ThemedText
      size={14}
      type={FONT_STYLES.MAIN}
    >
      the chat is deleting
    </ThemedText>
    <LoadingComponent loading={loading} />
  </View>
)

export const IconRowLeft = styled(IconRow)`
  justify-content: flex-start;
`;

export const LeftText = styled(ThemedText)`
  padding-right: 5px;
`

export const RightText = styled(ThemedText)`
  padding-left: 5px;
`

export const SpacedItemRow = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const NotificationBadge = styled(View)`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  background-color: grey;
  margin-right: 10px;
`

export const ChatContain: React.FC = ({ children }) => (
  <GeneralSpacing u={10} r={10} d={10} l={10}>
    {children}
  </GeneralSpacing>
);