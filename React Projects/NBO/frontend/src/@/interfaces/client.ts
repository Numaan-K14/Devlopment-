import { BaseObjInterface } from "./base";

export interface ContactPersonsInterface {
  department: string | null | undefined;
  email: string | null | undefined;
  mobile: string | null | undefined;
  name: string;
}
export interface ClientInfoInterface extends BaseObjInterface {
  client_name: string;
  project_name: string;
  contact_persons: ContactPersonsInterface[];
}
export interface ProjectInterface extends BaseObjInterface {
  client_name: string;
  project_name: string;
  started_on?: Date;
  completed_on?: Date;
  leadership_level?: string;
}
export interface ProjectConfigInterface {
  client_id: any;
  project_name: string;
  start_date?: Date;
  end_date?: Date;
  nbol?: any;
  client?: any;
  nbol_ll_id?: string;
}
export interface ClientCreateInterface {
  id?: string;
  client_name: string;
  assoc_companies?: any;
  is_grp_comp?: boolean;
  is_grp_of_comp?: boolean;
  associate_comp?: any;
  is_360_client?: boolean;
  nbol_client_name?: any;
  nbol_client_schema?: string;
  nbol_client_id?: string;
  contact_persons: ContactPersonsInterface[];
  logo?: any;
}

export interface Client360InfoInterface {
  schema_name: string;
  id: string;
  is_channel_partner: boolean;
  name: string;
}
