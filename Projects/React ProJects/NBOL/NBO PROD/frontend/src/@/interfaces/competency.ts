import { BaseObjInterface } from "./base";

export interface CompetiencyInterface extends BaseObjInterface {
  competency: string;
  nbol_leadership_level: { leadership_level: string; id: string };
}
export interface ClientCompetiencyInterface extends BaseObjInterface {
  leadership_level: string;
  competency: string;
  competency_type: string;
  nbol_leadership_level: any;
  client_id: string;
  nbol_client_competencies: any;
}
export interface CompetiencyCreateInterface {
  competency: string;
  description: string;
  expected_behaviours: [{ expected_behaviour: string }];
}
