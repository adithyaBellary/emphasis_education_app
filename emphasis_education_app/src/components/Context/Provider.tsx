import * as React from 'react';

import { GeneralContext, IContext } from './Context';

const ContextProvider: React.FC = ({ children }) => (
  <GeneralContext.Provider
    value={{} as IContext}
  >
    {children}
  </GeneralContext.Provider>
)

export default ContextProvider;
