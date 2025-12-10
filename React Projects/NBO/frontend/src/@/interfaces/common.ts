import { BaseObjInterface } from "./base";

export interface NbolLeadershipLevelInterface  {
    id:string;
    leadership_level:string;
    description:string
  }

export interface CohortInterface extends BaseObjInterface{
    cohort_name: string;
    project_id:string
}