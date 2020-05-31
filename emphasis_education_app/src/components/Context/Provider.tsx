import * as React from 'react';

import context, { DummyData } from './Context';

const ContextProvider: React.FC = ({ children }) => (
  <context.Provider
    // pass it dummy data for rn
    value={DummyData}
  >
    {children}
  </context.Provider>
)

export default ContextProvider;
