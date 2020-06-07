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
  chatIDs: string[];
  classes?: Class[];
  _id: string;
}

// make all of these optional because we know almost nothing on user creation
export interface Class {
  _id?: string;
  name?: string;
  userID?: string;
  tutorID?: string;
  chatID?: string;
}

export enum Permission {
  Student = 'Student',
  Tutor = 'Tutor',
  Admin = 'Admin'
}

// basically res + IUser
export interface ILoginPayloadProps {
  res: string;
  name: string;
  email: string;
  phoneNumber: string;
  userType: Permission;
  groupID: string;
  classes?: Class[];
  _id: string;
  chatIDs: string[];
}
export interface ILoginPayload {
  login: ILoginPayloadProps;
}

export interface IMessageUserType {
  _id: string,
  name: string,
  email: string
}

export interface IMessage {
  _id: number;
  text: string;
  createdAt: number;
  user: IMessageUserType;
}

export interface IGetFamilyInput {
  groupID: string;
}

export interface IGetFamilyPayload {
  getFamily: IUser[];
}
export interface ISearchUserPayload {
  searchUsers: IUser[];
}

export interface ISearchClassesPayload {

}

export interface ISearchInput {
  searchTerm: string;
}
