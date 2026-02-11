import { queryClient } from "@/config/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "components/protected-route";
import AssessNowPage from "pages/assessments/assess -now/page";
import AssessmentsPage from "pages/assessments/page";
import { LoginPage } from "pages/auth/page";
import CoachingSessionPage from "pages/coaching-session/page";
import AddScenarioPage from "pages/configs/assessment/add-scenario/page";
import AssessmentConfigPage from "pages/configs/assessment/page";
import AssessorsPage from "pages/configs/assessors/page";
import ClientsPage from "pages/configs/clients/page";
import ExpectedBehaviorsPage from "pages/configs/competencies/expected-behaviors/page";
import CompetenciesPage from "pages/configs/competencies/page";
import NewConfiguredClass from "pages/configs/configured-classess/new-configured-class/page";
import ConfiguredClasses from "pages/configs/configured-classess/page";
import FacilitiesPage from "pages/configs/facilities/page";
import ExpectedBehaviorsPageForLeaddershipLevel from "pages/configs/leadership-levels/expected-behaviors/page";
import LeadershipLevelsPage from "pages/configs/leadership-levels/page";
import NewClassConfig from "pages/configs/new-class/page";
import ParticipantsPage from "pages/configs/participants/page";
import ParticipantsForm from "pages/configs/participants/participantsForm/page";
import ProjectsPage from "pages/configs/projects/page";
import UsersPage from "pages/configs/users/page";
import WeightageConfigPage from "pages/configs/weightage/page";
import Layout from "pages/layout";
import ReportUI from "pages/report-ui/page";
import ReportsPage from "pages/report/page";
import ReportEdit from "pages/report/report-edit/page";
import ScoreCardPage from "pages/report/scorecard/page";
import SingleClassReport from "pages/report/single-class-report/page";
import SchedulesPage from "pages/schedules/page";
import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
import "react-quill-new/dist/quill.snow.css";

import CBIAsessment from "pages/cbi/assessment/page";
import AssessmentQuestionPage from "pages/cbi/assessment/question/page";
import CompetencyConfig from "pages/cbi/competency/page";
import Dashboard from "pages/cbi/dashboard/page";
import ParticipantConfig from "pages/cbi/participant-config/page";
import CbiReportUIPage from "pages/cbi/report/cbi-report-ui/page";
import CbiReportPage from "pages/cbi/report/page";
import CbiRportEditPage from "pages/cbi/report/report-edit/page";
import NbolCompetenciesPage from "pages/configs/nbol-competencies/page";
import ParticipantDashboard from "pages/participant-dashboard/page";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import "./index.css";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/report-ui/:id' element={<ReportUI />} />
            <Route path='/cbi-report-ui/:id' element={<CbiReportUIPage />} />
            <Route element={<Navigate to='login' />} path='/' />
            <Route element={<Layout />}>
              {/* Admin only routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path='cbi'>
                  <Route index element={<Dashboard />} />
                  {/* <Route path='dashboard' element={<Dashboard />} /> */}
                  <Route path='participant' element={<ParticipantConfig />} />
                  <Route path='competency' element={<CompetencyConfig />} />

                  <Route path='final-score' element={<CbiReportPage />} />
                  <Route path='edit-report' element={<CbiRportEditPage />} />
                </Route>
                <Route
                  path='facilities-configuration'
                  element={<FacilitiesPage />}
                />
                <Route path='participant-configuration'>
                  <Route index element={<ParticipantsPage />} />
                  <Route
                    path='participantsForm'
                    element={<ParticipantsForm />}
                  />
                </Route>
                {/* <Route
                path='leadership-levels-configuration'
                element={<LeadershipLevelsPage />}
              /> */}
                <Route path='leadership-levels-configuration'>
                  <Route index element={<LeadershipLevelsPage />} />
                  <Route
                    path=':id'
                    element={<ExpectedBehaviorsPageForLeaddershipLevel />}
                  />
                </Route>
                <Route path='competencies-configuration'>
                  <Route index element={<CompetenciesPage />} />
                  <Route path=':id' element={<ExpectedBehaviorsPage />} />
                </Route>
                <Route path='assessors' element={<AssessorsPage />} />
                <Route
                  path='activity-weightages'
                  element={<WeightageConfigPage />}
                />
                {/* <Route
                path='class-configuration'
                element={<ClassConfigurationPage />}
              /> */}
                <Route path='generate-schedule' element={<NewClassConfig />} />
                <Route path='client-configuration' element={<ClientsPage />} />

                <Route path='draft-schedule'>
                  <Route index element={<ConfiguredClasses />} />
                  <Route path='class/:id' element={<NewConfiguredClass />} />
                </Route>
                <Route
                  path='project-configuration'
                  element={<ProjectsPage />}
                />
                <Route path='activities'>
                  <Route index element={<AssessmentConfigPage />} />
                  <Route path='add-scenario' element={<AddScenarioPage />} />
                </Route>
                <Route path='users' element={<UsersPage />} />
                <Route
                  path='nbol-competencies'
                  element={<NbolCompetenciesPage />}
                />
              </Route>

              {/* Admin and Assessor routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin", "assessor"]} />
                }
              ></Route>

              {/* All roles routes */}
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "assessor", "participant"]}
                  />
                }
              >
                <Route path='dashboard' element={<ParticipantDashboard />} />
                <Route path='assessments'>
                  <Route index element={<AssessmentsPage />} />
                  <Route path='assess-now' element={<AssessNowPage />} />
                </Route>
                <Route path='reports'>
                  <Route index element={<ReportsPage />} />
                  <Route
                    path='single-class-report'
                    element={<SingleClassReport />}
                  />
                  <Route path='report-edit' element={<ReportEdit />} />
                  <Route
                    path='participant-assessment-detail'
                    element={<AssessNowPage />}
                  />

                  <Route path='scorecard/:id' element={<ScoreCardPage />} />
                </Route>
                <Route path='activity-calendar' element={<SchedulesPage />} />
                <Route
                  path='coaching-session'
                  element={<CoachingSessionPage />}
                />

                <Route path='cbi'>
                  <Route path='cbi-assessment'>
                    <Route index element={<CBIAsessment />} />
                    <Route path=':id' element={<AssessmentQuestionPage />} />
                  </Route>
                </Route>
              </Route>

              {/* Assessor only routes */}
              <Route element={<ProtectedRoute allowedRoles={["assessor"]} />}>
                <Route path='reports'>
                  <Route index element={<ReportsPage />} />
                  <Route path='report-edit' element={<ReportEdit />} />
                  <Route
                    path='single-class-report'
                    element={<SingleClassReport />}
                  />
                </Route>
              </Route>
            </Route>
          </Routes>
          <Toaster
            position='bottom-center'
            richColors
            expand
            // className='!text-center'
            toastOptions={{
              classNames: {
                toast: "!text-center flex justify-center", // applies to the toast box
                description: "!text-center", // applies to description text
                title: "!text-center", // applies to title text
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </CookiesProvider>
  </React.StrictMode>,
  // <React.StrictMode>
  //   <Layout>
  //     <RouterProvider router={router} />
  //   </Layout>
  // </React.StrictMode>
);
