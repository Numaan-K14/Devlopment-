import { BaseObjInterface } from "./base";

export interface AssessorsInterface extends BaseObjInterface {
    assessor_name:string;
    email:string;
    credential:string;
    status:string;
  }
export interface AssessorsCreateInterface  {
    assessor_name:string;
    email:string;
    credential:string;
    status:boolean
  }
