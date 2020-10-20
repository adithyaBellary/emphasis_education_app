// can i really have a generic set of props to pass into all the screens?
export interface IProps {
  navigation: any;
  route: any;
}

// this determines state for the user input form
export interface IUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  userType: Permission;
  gender: string;
  dob: string;
}

export interface IUsableUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: Permission;
  gender: string;
  dob: string;
}

interface AdminChatUser {
  firstName: string;
  lastName: string;
  email: string;
}

interface AdminChat {
  chatID: string;
  user: AdminChatUser;
}

// this will be the user type that we get back from the backend
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: Permission;
  groupID: string;
  chatIDs?: string[];
  classes?: Class[];
  _id: string;
  gender: string;
  adminChat: AdminChat[]
  dob: string;
}

export interface GenericResponse {
  res: boolean;
  message?: string;
}

// interface ICreateUserResponse {
//   success: boolean;
// }

// export interface ICreateUserPayload {
//   createUser: ICreateUserResponse;
// }

export interface ChatUserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

// make all of these optional because we know almost nothing on user creation
export interface Class {
  // we wont be sending this to the backend
  // _id?: string;
  displayName: string;
  className: string;
  userInfo: ChatUserInfo[];
  tutorInfo: ChatUserInfo;
  chatID: string;
}

export interface ICreateChatInput {
  displayName: string;
  className: string;
  userInfo: ChatUserInfo[];
  tutorInfo: ChatUserInfo;
}

export interface ICreateChatPayload {
  res: boolean;
}

export enum Permission {
  Student = 'Student',
  // need to distinguish the parents
  Parent = 'Guardian',
  Tutor = 'Tutor',
  Admin = 'Admin'
}

// basically res + IUser
export interface ILoginPayloadProps {
  res: string;
  user: IUser;
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
  image?: string;
  chatID: string;
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

interface ISearchClasses {
  classes: string[];
}

export interface ISearchClassesPayload {
  searchClasses: ISearchClasses;
}

export interface ISearchInput {
  searchTerm: string;
}
