import * as React from 'react';
import { Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/client'

import { SEARCH_CLASSES } from '../queries/SearchClasses'
import { SEND_EMAIL } from '../queries/SendEmail';
import { StyledTextInput } from './Settings';

import { GeneralContext } from './Context/Context';
import {
  CenteredDiv,
  ContentContain as Contain,
  FONT_STYLES,
  GeneralSpacing,
  HorizontalDivider,
  LoadingComponent,
  ThemedText,
  ThemedButton,
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
          <GeneralSpacing u={10} r={0} d={10} l={0}>
            <HorizontalDivider width={100} color='black'/>
          </GeneralSpacing>
          {/* <ThemedText size={14} type={FONT_STYLES.LIGHT}>Test Description</ThemedText> */}
        </>
      ))
    }
  </>
);

const AboutUs: React.FC = () => {

  const options = { variables: { searchTerm: '' }}
  const { data: classData, loading: classLoading, error } = useQuery(SEARCH_CLASSES, options);
  const [message, setMessage] = React.useState('')
  const { loggedUser } = React.useContext(GeneralContext);

  const [runMutation, { data: emailData, loading: emailLoading }] = useMutation(SEND_EMAIL);

  const sendEmail = () => {
    runMutation({
      variables: {
        subject: `Message from ${loggedUser.firstName} ${loggedUser.lastName}`,
        body: message
      }
    }).then((res) => {
      if (res) {
        Alert.alert('Success', 'Email was successfully sent!')
      } else {
        Alert.alert('Error', 'Email could not be sent. Please contact either Shweta or Sakthi')
      }
    })
    .catch(() => {
      Alert.alert('Error', 'Email could not be sent. Please contact either Shweta or Sakthi')
    })
  }

  if (error) { console.log('error', error) }

  if (classLoading) { return (
    <CenteredDiv>
      <LoadingComponent loading={classLoading} />
      <ThemedText
        size={14}
        type={FONT_STYLES.MAIN}
      >
        loading classes...
      </ThemedText>
    </CenteredDiv>
  )}

  return (
    <Contain>
      <SectionTitle title='Classes that we offer' />
      {classData && <ClassList classList={classData.searchClasses.classes}/>}
      <SectionTitle title='Send us a message!' />
      <StyledTextInput
        multiline
        onChangeText={text => setMessage(text)}
        placeholder='Anything that you would like to see? Let us know!'
      />
      <GeneralSpacing u={10} r={0} l={0} d={10}>
        <ThemedButton
          block={true}
          buttonText='Send email'
          loading={emailLoading}
          onPress={() => sendEmail()}
          disabled={message.length === 0}
        />
      </GeneralSpacing>
    </Contain>
  )
};

export default AboutUs;
