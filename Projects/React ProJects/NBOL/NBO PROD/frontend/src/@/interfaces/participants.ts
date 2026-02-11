import { BaseObjInterface } from "./base";

export interface ParticipantsInterface extends BaseObjInterface {
  participant_name: string;
  email: string;
  perf1: string;
  perf2: string;
  perf3: string;
  department: string;
  job_grade: string;
  division: string;
  dateOfJoining: Date;
  age: number;
  client_name: string;
}
export interface SingleParticipantInterface {
  client_id: string;
  cohort_id: string;
  client_roles: any;
  cohorts: any;
  participant_name: string;
  email: string;
  job_grade: any;
  perf1: string;
  perf2: string;
  perf3: string;
  department: string;
  division: string;
  date_of_joining: Date;
  date_of_birth: Date;
  age: number;
  lead_level: string;
  client?: any;
  position?: string;
}
