import { SequelizeModule } from '@nestjs/sequelize';
import { Contactperson } from '../Modules/client-contact-persons/contactPerson.model';
// import { Projects } from 'src/client_project/project.model';
import { Clients } from '../Modules/clients/model/clients.model';
import { Rooms } from '../Modules/facilities/model/rooms.model';
import { NbolLeadLevels } from '../Modules/nbol-leadershiplevels/model/leadLevel.model';
import { Participants } from '../Modules/participants/model/participants.model';
import { ExpectedBehaviours } from 'src/Modules/competencies/model/expected_behaviour.model';
import { Competencies } from 'src/Modules/competencies/model/competency.model';
import { Assessros } from 'src/Modules/assessors/model/assessor.model';
import { Assessments } from 'src/Modules/assessment/model/assessment.model';
import { Scenerios } from 'src/Modules/assessment/model/scenerio.model';
import { ClientAssessments } from 'src/Modules/assessment/model/client-assessments.model';
import { Users } from 'src/Modules/users/model/user.model';
import { NbolClientCompetency } from 'src/Modules/competencies/model/nbol_client_competency.model';
import { Class } from 'src/Modules/class-configration/model/class.model';
import { ClassCompetencies } from 'src/Modules/class-configration/model/classAssessmentsCompetencies';
import { ParticipantsAssessments } from 'src/Modules/class-configration/model/participantAssessments.model';
import { ClassAssessors } from 'src/Modules/class-configration/model/classPartAssessmAssessors.model';
import { ClassAssessments } from 'src/Modules/class-configration/model/classAsessments.model';
import { ClientRoles } from 'src/Modules/client-roles-levels/model/role.model';
import { Facilities } from 'src/Modules/facilities/model/facility.model';
import { AssessmentResponse } from 'src/Modules/class-configration/model/participantsAssessmentsResponse.model';
import { ParticipantScore } from 'src/Modules/class-configration/model/participantScore.model';
import { Questions } from 'src/Modules/assessment/model/questions.model';
import { Quessionnaires } from 'src/Modules/assessment/model/quessionnaire.model';
import { QuessionnaireResponse } from 'src/Modules/class-configration/model/participantQuessionaireResponse.model';
import { ClassPartReport } from 'src/Modules/report/model/class_part_report.model';
import { ParticipantAvgComp } from 'src/Modules/report/model/part_average_comp_score.model';
import { Projects } from 'src/Modules/client-project/project.model';
import { Cohorts } from 'src/Modules/project-cohort/model/cohort.model';
import { ClassDraft } from 'src/Modules/class-configration/model/classDraft.model';

export const DatabaseModule = SequelizeModule.forRoot({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Bismillah@123',
  database: process.env.DB_NAME || 'NBOL',
  models: [
    Clients,
    Contactperson,
    Projects,
    Cohorts,
    Facilities,
    Rooms,
    Participants,
    NbolLeadLevels,
    ClientRoles,
    Competencies,
    ExpectedBehaviours,
    Assessros,
    Assessments,
    Scenerios,
    ClientAssessments,
    Users,
    NbolClientCompetency,
    Class,
    ClassPartReport,
    Participants,
    ClassAssessors,
    ClassCompetencies,
    ParticipantsAssessments,
    ClassAssessors,
    ClassAssessments,
    AssessmentResponse,
    ParticipantScore,
    Questions,
    Quessionnaires,
    QuessionnaireResponse,
    ParticipantAvgComp,
    ClassDraft
  ],
  // synchronize: true,
  // autoLoadModels: true,
  // sync:{
  //   alter:true
  // }
});
