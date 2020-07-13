import * as React from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  EdgeInsetsPropType
} from 'react-native';
import styled from 'styled-components';

import { Permission } from '../types';
import Context from './Context/Context';
// import { useLinkProps } from '@react-navigation/native';

export const MytextInput = styled(TextInput)`
  padding: 10px 0;
  fontFamily: ${({ theme }) => theme.font.main};
  fontSize: 18px;
`;

export const LoginInput = styled(TextInput)`
  fontFamily: ${({ theme }) => theme.font.main};
  fontSize: 18px;
  width: 80%;
  text-align: center;
`;

export const InputContain = styled(View)`
  border-bottom-width: 1px;
  border-bottom-color: black;
  width: 90%;
`;

interface IThemedInputProps {
  placeholder: string;
  value?: string;
  onChangeText(t: string): void;
}

export const ThemedTextInput: React.FC<IThemedInputProps> = props => (
  <InputContain>
    <MytextInput
      {...props}
    />
  </InputContain>
)

export const ButtonContainer = styled(View)`
  padding: 10px;
`;

export const ButtonGroupContain = styled(View)`
  padding-top: 20%;
`

export const MyButton = styled(TouchableOpacity)`
  background-color: ${({ disabled, theme}) => disabled ? 'grey' : theme.colors.purple} ;
  height: 40px;
  justify-content: center;
  border-radius: 10px;
  width: 150px;

`;

const d: number = 150;
export const MyCircleButton = styled(TouchableOpacity)`
  background-color: ${({theme}) => theme.primary.backgroundColor };
  width: ${d}px;
  height: ${d}px;
  border-radius: ${d/2}px;
  justify-content: center;
`;

export const MyButtonText = styled(Text)`
  color: white;
  text-align: center;
  font-size: 14px;
  fontFamily: ${({ theme }) => theme.font.main}
`;

export const CenteredDiv = styled(View)`
  align-items: center;
`;

// TODO make this em or %. not straight px
export const IconSection = styled(View)`
  width: 100%;
  padding: 150px 0 100px 0;
  align-items: center;
`;

interface IPermissionProps {
  allowedPermission: Permission;
}

export const PermissionedComponent: React.FC<IPermissionProps> = ({ allowedPermission, children}) => {
  const {loggedUser} = React.useContext(Context)

  if(loggedUser.userType === allowedPermission) {
    return <>{children}</>
  } else {
    return null;
  }
}
const RADIO_BUTTON_OUTER_DIAMETER: number = 20;
const RADIO_BUTTON_INNER_DIAMETER: number = 10;

const RadioButtonOuter = styled(TouchableOpacity)`
  height: ${RADIO_BUTTON_OUTER_DIAMETER}px;
  width: ${RADIO_BUTTON_OUTER_DIAMETER}px;
  border-radius: ${RADIO_BUTTON_OUTER_DIAMETER/2}px;
  border-width: 2px;
  border-color: grey;
  align-items: center;
  justify-content: center;

`
const RadioButtonInner = styled(View)`
  height: ${RADIO_BUTTON_INNER_DIAMETER}px;
  width: ${RADIO_BUTTON_INNER_DIAMETER}px;
  border-radius: ${RADIO_BUTTON_INNER_DIAMETER/2}px;
  background-color: grey;
`
interface IRadioButtonSelectProps {
  title: string;
  selectedElement: string;
  setSelectedElement(t: string): void;
}

const RadioButtonSelect: React.FC<IRadioButtonSelectProps> = ({ title, selectedElement, setSelectedElement }) => (
  <RadioButtonOuter
    onPress={() => setSelectedElement(title)}
  >
    {title === selectedElement && <RadioButtonInner />}
  </RadioButtonOuter>
)

const RadioButtonContain = styled(View)<{num: number}>`
  width: ${props => 100/props.num}%
  align-items: center;
  justify-content: center;
`
interface IRadioButtonProps {
  title: string;
  num: number;
  selectedElement: string;
  setSelectedElement(t: string): void;
}

const RadioButton: React.FC<IRadioButtonProps> = ({title, num, selectedElement, setSelectedElement}) => (
  <RadioButtonContain
    num={num}
  >
    <RadioButtonSelect
      title={title}
      selectedElement={selectedElement}
      setSelectedElement={setSelectedElement}
    />
    <Text>{title}</Text>
  </RadioButtonContain>
)

const RadioButtonRow = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 10%;
`
interface IRadioButtonGroupProps {
  titles: string[]
  onSelect(el: string): void;
}

export const RadioButtonGroup: React.FC<IRadioButtonGroupProps> = ({titles, onSelect}) => {
  // this is the conponent that should hold state over the individual radio buttons
  const [selectedElement, setSelectedElement] = React.useState('');
  const selectElement = (el: string) => {
    setSelectedElement(el);
    onSelect(el);
  };
  return (
    <RadioButtonRow>
      {titles.map((title, index) => (
        <RadioButton
          title={title}
          num={titles.length}
          selectedElement={selectedElement}
          setSelectedElement={selectElement}
          key={index}
        />
      ))}
    </RadioButtonRow>
  )
}

export const ContentContain = styled(View)`
  padding: 20px;
`
export const ThemedText = styled(Text)<{ size: number, type: string}>`
  fontFamily: ${({ theme, type }) => type === 'light' ? theme.font.light : theme.font.main}
  fontSize: ${props => props.size}px;
`

interface IIndividualFieldProps {
  value: string;
  label: string;
  valueSize: number;
  labelSize: number;
};

export const GeneralSpacing = styled(View)<{r: number, l: number, u: number, d: number}>`
  padding: ${({ u }) => u}px ${({ r }) => r}px ${({ d }) => d}px ${({ l }) => l}px
`

export const IndividualField: React.FC<IIndividualFieldProps> = ({ value, label, valueSize, labelSize}) => (
  <GeneralSpacing u={5} r={0} d={5} l={0}>
    <ThemedText
      size={valueSize}
      type={'main'}
    >
      {value}
    </ThemedText>
    <ThemedText
      size={labelSize}
      type={'light'}
    >
      {label}
    </ThemedText>
  </GeneralSpacing>
);

export const HorizontalDivider = styled(View)<{width: number}>`
  width: ${({ width }) => width}%;
  border-bottom-color: ${({ theme }) => theme.colors.purplePastel};
  border-bottom-width: 1px;
`

export const VerticalDivier = styled(View)<{height: number}>`
  height: ${({ height }) => height}px;
  border-right-color: grey;
  border-right-width: 1px;
`

export const IconRow = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;