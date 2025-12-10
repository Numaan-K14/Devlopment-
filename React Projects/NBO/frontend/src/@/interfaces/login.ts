import { BaseObjInterface } from "./base";

export interface LoginInterface {
  email: string;
  password: string;
}
export interface UserInterface extends BaseObjInterface {
  email: string;
  password: string;
  name: string;
  phone: number;
}
export interface UserCreateInterface {
  email: string;
  name: string;
  phone_number: number;
  is_assessor: Boolean;
}
