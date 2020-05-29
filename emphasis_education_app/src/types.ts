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
// rename this to IUsableUserInfo
export type IUsableUserInfo = Pick<
    IUserInput,
    'name' | 'email' | 'password' | 'phoneNumber' | 'userType'
  >;

  // this will be the user type that we get back from the backend
  export interface IUser {
    name: string;
    email: string;
    phoneNumber: string;
    userType: Permission;
    groupID: string;
  }

export enum Permission {
  Student = 'Student',
  Tutor = 'Tutor',
  Admin = 'Admin'
}

interface ILoginPayloadProps {
  res: string;
  chatIDs: string[];
}
export interface ILoginPayload {
  login: ILoginPayloadProps;
}
