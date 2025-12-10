// import { ButtonFooter, ConfirmDialog, Label, PageHeading } from "@/components";
// import CustomButton from "@/components/button";
// import RichTextEditor from "@/components/inputs/rich-text";
// import { axios } from "@/config/axios";
// import { queryClient } from "@/config/query-client";
// import { useQuery } from "@/hooks/useQuerry";
// import { useMutation } from "@tanstack/react-query";
// import { FieldArray, Form, Formik } from "formik";
// import { useState } from "react";
// import { FiAlertCircle } from "react-icons/fi";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "sonner";

import AppBar from "@/components/app-bar";
import CustomTab from "@/components/custom-tab";
import { useQuery } from "@/hooks/useQuerry";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import ParticipantAssessmetDetails from "../components/ParticipantAssessmetDetails";
import ReportEditComponent from "../components/ReportEdit";

const ReportEdit = () => {
  const [tabValue, setTabValue] = useState<any>("0");
  const { state } = useLocation();

  const { data: Data } = useQuery<any>({
    queryKey: [`/report/participant-details/${state?.ParticipantId}`],
    select: (data: any) => data?.data?.data,
    enabled: true,
  });

  const { data: ParticipnatAssessmentDetails } = useQuery<any>({
    queryKey: [`/report/part-assessment-responses/${state?.ParticipantId}`],
    select: (data: any) => data?.data?.data,
    enabled: true,
  });

  // console.log(state, "<--------asdfds");
  return (
    <div>
      <AppBar subTitle='edit report' title='Report Edit' />
      <div>
        <CustomTab
          setValue={setTabValue}
          tabs={[
            { label: "Edit Report", value: 0 },
            { label: "Participant Assessment Details", value: 1 },
          ]}
          value={tabValue}
          className='flex my-10 items-center justify-center'
        />
        {tabValue == 0 && (
          <>
            <ReportEditComponent Data={Data} />
          </>
        )}
        {tabValue == 1 && (
          <>
            <ParticipantAssessmetDetails
              Data={ParticipnatAssessmentDetails}
              paricipant_id={state?.ParticipantId}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ReportEdit;
