// can i really have a generic set of props to pass into all the screens?
export interface IProps {
  navigation: any;
  route: any;
}

// this determines state for the user input form
export interface IUserInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  userType: Permission;
}

// dont want the confirmPassword stuff for when we send to backend
export type IUser = Pick<
    IUserInput,
    'name' | 'email' | 'password' | 'phoneNumber' | 'userType'
  >;

export enum Permission {
  Student = 'Student',
  Tutor = 'Tutor',
  Admin = 'Admin'
}

export interface ILoginPayload {
  res: boolean;
  chatIDs: string[];
}
