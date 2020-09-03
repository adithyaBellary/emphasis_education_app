import * as React from 'react';

import context, { IContext } from './Context';

const ContextProvider: React.FC = ({ children }) => (
  <context.Provider
    value={{} as IContext}
  >
    {children}
  </context.Provider>
)

export default ContextProvider;
