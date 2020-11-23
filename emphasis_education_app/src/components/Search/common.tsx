import * as React from 'react';
import {
  ScrollView
} from 'react-native';
import styled from 'styled-components';

import { GeneralSpacing } from '../shared';


export const SearchResultsContain = styled(ScrollView)`
  margin: 0 0 50px 0;
  border: solid grey 1px;
  padding-left: 10px;
  padding-right: 10px;
`

export const SearchResultsContainer: React.FC = ({ children }) => (
  <GeneralSpacing u={0} r={20} d={0} l={20}>
    {children}
  </GeneralSpacing>
);