import { BaseObjInterface } from "./base";

export interface FacilityInterface extends BaseObjInterface {
    facility_name:string
    address:string;
    rooms:[{room:string}]
  }
export interface FacilityCreateInterface  {
    facility_name:string
    address:string;
    rooms:[{
      room_id: any;room:string
}]
  }