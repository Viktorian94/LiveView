export enum UserSexEnum  {
  Male = "male",
  Female = "female",
  None = "none"
}

export type createUserType = {
  name: string;
  email?: string;
  policy: boolean;
  country: string;
  sex: UserSexEnum;
}