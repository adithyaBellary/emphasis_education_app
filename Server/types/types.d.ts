export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type MessageTypeInput = {
  id: Scalars['String'];
  text: Scalars['String'];
  user: UserInput;
  chatID: Scalars['String'];
};

export type MessagePayload = {
  __typename?: 'MessagePayload';
  text: Scalars['String'];
  MessageId: Scalars['Int'];
  createdAt: Scalars['String'];
  user: MessageUser;
};

export type UserInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  _id?: Maybe<Scalars['String']>;
};

export type MessageUser = {
  __typename?: 'MessageUser';
  _id: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
};

export type MessageType = {
  __typename?: 'MessageType';
  _id: Scalars['String'];
  text: Scalars['String'];
  createdAt: Scalars['String'];
  user: MessageUser;
};

export type TestUser = {
  __typename?: 'TestUser';
  _id: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  userType: Permission;
  chatIDs: Array<Maybe<Scalars['String']>>;
};

export enum Permission {
  Student = 'Student',
  Tutor = 'Tutor',
  Admin = 'Admin'
}

export enum Classes {
  Math = 'Math',
  Science = 'Science',
  History = 'History'
}

export type LoginPayload = {
  __typename?: 'LoginPayload';
  res: Scalars['Boolean'];
  chatIDs: Array<Maybe<Scalars['String']>>;
};

export type UserType = {
  __typename?: 'UserType';
  email: Scalars['String'];
  password: Scalars['String'];
  userType: Scalars['String'];
  phoneNumber: Scalars['String'];
  classes: Array<Scalars['String']>;
};

export type UserInfoType = {
  __typename?: 'UserInfoType';
  name: Scalars['String'];
  email: Scalars['String'];
  phoneNumber: Scalars['String'];
  groupID: Scalars['String'];
};

export type UserInfoTypeArr = {
  __typename?: 'UserInfoTypeArr';
  users: Array<Maybe<UserInfoType>>;
};

export type Query = {
  __typename?: 'Query';
  getMessages?: Maybe<Array<Maybe<MessageType>>>;
  getUserID?: Maybe<Scalars['String']>;
  getUser?: Maybe<TestUser>;
  getClasses?: Maybe<Array<Maybe<Scalars['String']>>>;
  queryUserID?: Maybe<Scalars['Int']>;
  getAllUsers?: Maybe<Array<Maybe<UserType>>>;
};


export type QueryGetMessagesArgs = {
  chatID?: Maybe<Scalars['String']>;
  init: Scalars['Int'];
};


export type QueryGetUserArgs = {
  id: Scalars['String'];
};


export type QueryQueryUserIdArgs = {
  email?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<LoginPayload>;
  sendMessage: MessagePayload;
  createUser?: Maybe<Scalars['Boolean']>;
  addClass?: Maybe<Scalars['Boolean']>;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSendMessageArgs = {
  messages?: Maybe<Array<Maybe<MessageTypeInput>>>;
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  userType: Permission;
};


export type MutationAddClassArgs = {
  subject: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  messageReceived: MessagePayload;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

