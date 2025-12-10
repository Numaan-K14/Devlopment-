import { AssessmentInterface } from "./assessments";
import { BaseObjInterface } from "./base";

export interface ClassColumeInterface extends BaseObjInterface {
  assessment_name: string;
  competency: string;
  status: boolean;
  assessment: AssessmentInterface;
}
