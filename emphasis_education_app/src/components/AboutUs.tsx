import * as React from 'react';
import { useQuery } from '@apollo/react-hooks'
import qs from 'qs';
import {
  View,
  Text,
  Linking,
  TextInput,
  ActivityIndicator
} from 'react-native'
import styled from 'styled-components';

import {
  ContentContain as Contain,
  ThemedText,
  FONT_STYLES,
  CenteredDiv,
  GeneralSpacing,
  HorizontalDivider,
  ThemedButton
} from './shared';
import { SEARCH_CLASSES } from '../queries/SearchClasses'

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <GeneralSpacing u={10} r={10} d={10} l={10} >
    <CenteredDiv>
      <ThemedText size={30} type={FONT_STYLES.BOLD}>
        {title}
      </ThemedText>
    </CenteredDiv>
  </GeneralSpacing>
)

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
)

const StyledTextInput = styled(TextInput)`
  height: 100px
  border: black solid 1px;
`

const ADMIN_EMAIL = 'adithya.bellary@gmail.com';

const AboutUs: React.FC = () => {

  const options = { variables: { searchTerm: '' }}
  const { data, loading, error } = useQuery(SEARCH_CLASSES, options);
  const [message, setMessage] = React.useState('')



  if (error) {
    console.log('error', error)
  }

  if (loading) { return <ActivityIndicator animating={loading} />}

  const sendEmail = () => {
    const query = qs.stringify({
      subject: 'Message',
      body: message,
    });
    let url = `mailto:${ADMIN_EMAIL}?${query}`;

    return Linking.openURL(url);
  }

  const send = () => {
    // sendEmail().then(() => console.log('we done'))
    console.log('sending the email. should prob send this to the backend')
  }

  return (
    <Contain>
      <SectionTitle title='Classes that we offer' />
      {data && <ClassList classList={data.searchClasses.classes}/>}
      <SectionTitle title='Send us a message!' />

      <StyledTextInput
        multiline
        defaultValue={'fjdslafjd'}
        onChangeText={text => setMessage(text)}
        value={message}
      />

      <ThemedButton
        buttonText='Send email'
        loading={false}
        onPress={() => send()}
      />

    </Contain>
  )
};

export default AboutUs;
