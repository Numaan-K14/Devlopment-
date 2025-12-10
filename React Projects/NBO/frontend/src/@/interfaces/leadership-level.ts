import { BaseObjInterface } from "./base";

export interface LeaderShipLevelInterface extends BaseObjInterface {
    leadership_level:string
    description:string
  }
  export interface ClientLeaderShipLevelInterface extends BaseObjInterface {
    role:string
    linked_to_nbol_leadership_levels:string
  }
export interface LeaderShipLevelCreateInterface  {
    leadership_level:string
    description:string
  }
export interface ClientLeaderShipLevelCreateInterface  {
    role:string[]
    nbolId:any
  }