// can i really have a generic set of props to pass into all the screens?
export interface IProps {
  navigation: any;
  route: any;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  userType: string;
  classes: string;
}

// dont want the confirmPassword stuff for when we write to the database
export type IUser = Pick<IUserInput, 'name'>;
