import * as React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  TextInput,
  ActivityIndicator
} from 'react-native'
import styled from 'styled-components';

import { SEARCH_CLASSES } from '../queries/SearchClasses'
import { SEND_EMAIL } from '../queries/SendEmail';
import Context from './Context/Context';

import {
  ContentContain as Contain,
  ThemedText,
  FONT_STYLES,
  CenteredDiv,
  GeneralSpacing,
  HorizontalDivider,
  ThemedButton
} from './shared';

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <GeneralSpacing u={10} r={10} d={10} l={10} >
    <CenteredDiv>
      <ThemedText size={30} type={FONT_STYLES.BOLD}>
        {title}
      </ThemedText>
    </CenteredDiv>
  </GeneralSpacing>
);

const ClassList: React.FC<{ classList: string[] }> = ({ classList }) => (
  <>
    {
      classList.map( _class => (
        <>
          <ThemedText key={_class} size={14} type={FONT_STYLES.MAIN}>{_class}</ThemedText>
          <HorizontalDivider width={100} color='black'/>
          <ThemedText size={14} type={FONT_STYLES.LIGHT}>Test Description</ThemedText>
        </>
      ))
    }
  </>
);

const StyledTextInput = styled(TextInput)`
  height: 100px
  border: black solid 1px;
`;

const AboutUs: React.FC = () => {

  const options = { variables: { searchTerm: '' }}
  const { data: classData, loading: classLoading, error } = useQuery(SEARCH_CLASSES, options);
  const [message, setMessage] = React.useState('')
  const { loggedUser } = React.useContext(Context);

  const [runMutation, { data: emailData, loading: emailLoading }] = useMutation(SEND_EMAIL);

  if (error) { console.log('error', error) }

  if (classLoading) { return <ActivityIndicator animating={classLoading} />}

  return (
    <Contain>
      <SectionTitle title='Classes that we offer' />
      {classData && <ClassList classList={classData.searchClasses.classes}/>}
      <SectionTitle title='Send us a message!' />
      <StyledTextInput
        multiline
        defaultValue={'fjdslafjd'}
        onChangeText={text => setMessage(text)}
        value={message}
      />
      <ThemedButton
        buttonText='Send email'
        loading={emailLoading}
        onPress={() => runMutation({ variables: { subject: `Message from ${loggedUser.firstName} ${loggedUser.lastName}`, body: message }})}
        disabled={message.length === 0}
      />
    </Contain>
  )
};

export default AboutUs;
