import { BaseObjInterface } from "./base";

export interface AssessorColumnsInterface extends BaseObjInterface {
  client_name: string;
  participants: string;
  assessment_name: string;
  room_name: string;
  date: Date;
}
export interface ParticipantAssessmentColumnsInterface
  extends BaseObjInterface {
  assessment_name: string;
  scenario: string;
}
export interface ParticipantColumnsInterface extends BaseObjInterface {
  assessment_name: string;
}
export interface AssessmentConfigColumsInterface extends BaseObjInterface {
  assessment_name: string;
  status?: boolean;
  is_quesionnaire?: boolean;
  scenerios?: any[];
}

export interface AssessmentLinkScenarioPrensentationInterface
  extends BaseObjInterface {
  scenerio_name: string;
  description: string;
  file_location: string;
}
export interface AssessmentLinkScenarioQuestionnaireInterface
  extends BaseObjInterface {
  quesionnaire_name: string;
  questions: string[];
}

export interface scenarioInterface {
  file: any;
  description: string;
  scenerio_name: string;
  assessment_id: any;
  quesionnaire_name: string;
  questions: any[];
}

export interface AssessmentInterface extends BaseObjInterface {
  assessment_name: string;
  is_group_activity: boolean;
  is_quesionnaire: boolean;
  display_name: string;
}
