import * as React from 'react';
import {
  CenteredDiv,
  GeneralSpacing,
  ThemedText,
  FONT_STYLES
} from '../shared';

const EmptyChatWrapper: React.FC = ({ children }) => (
  <CenteredDiv>
    <GeneralSpacing u={10} r={10} d={10} l={10}>
      <ThemedText size={16} type={FONT_STYLES.LIGHT}>
        {children}
      </ThemedText>
    </GeneralSpacing>
  </CenteredDiv>
);

export const EmptyChatPicker: React.FC = () => (
  <EmptyChatWrapper>
    You are currently not added to any Chats.
    Please reach out to either Shweta or Sakthi to be added to one.
  </EmptyChatWrapper>
);

export const EmptyChat: React.FC = () => (
  <EmptyChatWrapper>
    This is the beginning of your conversation. Let's talk!
  </EmptyChatWrapper>
);