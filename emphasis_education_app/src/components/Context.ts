import * as React from 'react';
import { IUserInput } from '../types';

interface IContext {
  save(info: IUserInput): void;
  create(): void;
  goToConfirmationScreen(): void;
}

export const CreateUserFnContext = React.createContext<IContext>({
  save: (info: IUserInput) => {console.log('debugging')},
  create: () => {},
  goToConfirmationScreen: () => {}
});
