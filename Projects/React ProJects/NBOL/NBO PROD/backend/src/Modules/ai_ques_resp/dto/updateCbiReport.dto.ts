import { cbiProgressStatus } from "../model/core_ques_resp.model";

export class UpdateCbiReportDto {
    strengths: string;
    development_areas: string;
    recommendations: string;
    is_report_submitted: cbiProgressStatus;
}