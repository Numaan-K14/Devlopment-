import { ButtonFooter } from "@/components";
import AppBar from "@/components/app-bar";
import CustomButton from "@/components/button";
import { Autocomplete, DatePickerComponent } from "@/components/inputs";
// import { DatePicker } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import CustomSelect from "@/components/inputs/custom-select";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useQuery } from "@/hooks/useQuerry";
import { ClientInfoInterface, ProjectInterface } from "@/interfaces/client";
import { CohortInterface } from "@/interfaces/common";
import { SingleParticipantInterface } from "@/interfaces/participants";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";

const ParticipantsForm = () => {
  //------- state management ---------//
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedClient = state?.selectedClient ?? "";
  const selectedProjectData = state?.selectedProject ?? "";
  const selectedCohort = state?.selectedCohort ?? "";
  const ClientData = state?.ClientData ?? [];
  const ProjectData = state?.ProjectData ?? [];
  const row = state?.rowData ?? "";
  const [selectedProject, setSelectedProject] = useState<any>("");

  console.log(ClientData, "<------------ client");
  //-------- initial values ---------//
  const [initialValues, setInitialValues] = useState<any>({
    client_id: "",
    project: "",
    cohort: "",
    participant_name: "",
    email: "",
    job_grade: "",
    perf1: "",
    perf2: "",
    perf3: "",
    department: "",
    division: "",
    position: "",
    date_of_joining: "",
    date_of_birth: "",
    lead_level: "",
    age: "",
  });

  //----------- yup validation ---------//
  const validationSchema = Yup.object().shape({
    client_id: Yup.object().required("This field is required"),
    project: Yup.object().required("This field is required"),
    cohort: Yup.object().required("This field is required"),
    job_grade: Yup.object().required("This field is required"),
    participant_name: Yup.string().required("This field is required"),
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("This field is required"),
    perf1: Yup.string().required("This field is required"),
  });

  //-------- api calls --------//
  const { data: SingleParticipantData } = useQuery<SingleParticipantInterface>({
    queryKey: [`/participant/getparticipant/${row?.id}`],
    select: (data: any) => data?.data?.data,
    enabled: !!row?.id,
  });

  const { data: JobGradeData } = useQuery<any>({
    queryKey: [
      row
        ? `/participant/get-participant-jobgrades/${
            SingleParticipantData?.client_id
          }/${SingleParticipantData?.cohorts?.project?.nbol_ll_id}/${SingleParticipantData?.cohorts?.project?.id}`
        : `/participant/get-participant-jobgrades/${selectedClient?.id}/${selectedProject?.nbol?.id}/${selectedProject?.id}`,
    ],
    select: (data: any) => data?.data?.data,
    enabled: row ? !!SingleParticipantData : !!selectedProject,
  });

  const { data: ProjectCohort } = useQuery<CohortInterface[]>({
    queryKey: [
      SingleParticipantData
        ? `/participant/get-project-cohorts/${SingleParticipantData?.cohorts?.project?.id}`
        : `/participant/get-project-cohorts/${selectedProject?.id}`,
    ],
    select: (data: any) => data?.data?.data?.rows,
    enabled: (!!row && !!SingleParticipantData) || !!selectedProject,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      row?.id
        ? axios.put(`/participant/update-particiapnt/${row?.id}`, data)
        : axios.post(`/participant/${selectedClient?.id}`, data),
    onSuccess: (data) => {
      navigate(-1);
      toast.success(
        data.data.msg || row?.id
          ? "Participant Updated Successfully"
          : "Participant Created Successfully",
      );
      queryClient.invalidateQueries({
        queryKey: [
          `/participant/participant-filter?client_id=${selectedClient.id}`,
        ],
      });
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  //----------- useEffect hooks ---------//
  useEffect(() => {
    if (selectedProjectData) {
      setSelectedProject(selectedProjectData);
    }
  }, [selectedProjectData]);

  useEffect(() => {
    if (SingleParticipantData) {
      setInitialValues({
        client_id: SingleParticipantData?.client || "",
        project: SingleParticipantData?.cohorts?.project || "",
        cohort: SingleParticipantData?.cohorts || "",
        participant_name: SingleParticipantData?.participant_name || "",
        email: SingleParticipantData?.email || "",
        job_grade: JobGradeData?.jobGrades?.length
          ? SingleParticipantData?.client_roles
          : SingleParticipantData?.cohorts?.project?.nbol || "",
        perf1: SingleParticipantData?.perf1 || "",
        perf2: SingleParticipantData?.perf2 || "",
        perf3: SingleParticipantData?.perf3 || "",
        department: SingleParticipantData?.department || "",
        division: SingleParticipantData?.division || "",
        date_of_joining: SingleParticipantData?.date_of_joining || "",
        date_of_birth: SingleParticipantData?.date_of_birth || "",
        lead_level: SingleParticipantData?.lead_level || "",
        position: SingleParticipantData?.position || "",
      });
    }
  }, [SingleParticipantData, JobGradeData]);

  useEffect(() => {
    if (state) {
      setInitialValues((prev: any) => ({
        ...prev,
        client_id: selectedClient || "",
        project: selectedProjectData || "",
        cohort: selectedCohort || "",
      }));
    }
  }, [state]);

  return (
    <div>
      {/* <PageHeading>
        {SingleParticipantData
          ? `Update Participant : ${SingleParticipantData?.participant_name}`
          : "Add New Participant"}
      </PageHeading> */}

      <AppBar
        title='Participant Management'
        subTitle='Add, Edit and Manage Participants'
      />
      <div className=''>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values) => {
            mutate({
              ...values,
              job_grade: JobGradeData?.jobGrades?.length
                ? values?.job_grade?.id
                : null,
              client_id: values?.client_id?.id,
              project_id: values?.project?.id,
              cohort_id: values?.cohort?.id,
            });
          }}
        >
          {({ values, handleSubmit }) => (
            // console.log(values),
            <>
              <Form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-6 mb-20'>
                  <div className='flex flex-wrap gap-6'>
                    <CustomSelect
                      key={values.client_id?.id}
                      name='client_id'
                      label='Client Name'
                      className='w-[475.33px] '
                      options={ClientData || []}
                      disabled
                      getOptionLabel={(item: ClientInfoInterface) =>
                        item?.client_name
                      }
                      getOptionValue={(item: ClientInfoInterface) => item?.id}
                      required
                    />
                    <CustomSelect
                      key={values.project?.id}
                      required
                      className='w-[475.33px] '
                      label='Select Project Name'
                      name='project'
                      getOptionLabel={(item: ProjectInterface) =>
                        item?.project_name
                      }
                      getOptionValue={(item: ProjectInterface) => item?.id}
                      options={ProjectData || []}
                      onChange={(item) => {
                        setSelectedProject(item);
                      }}
                    />

                    {/* <CustomSelect
                      key={values.cohort?.id}
                      required
                      className='w-[494.33px] h-[48px]'
                      label='Select Cohort Name'
                      name='cohort'
                      getOptionLabel={(item: CohortInterface) =>
                        item?.cohort_name
                      }
                      getOptionValue={(item: CohortInterface) => item?.id}
                      options={ProjectCohort || []}
                    /> */}
                    <Autocomplete
                      required
                      className='w-[475.33px] '
                      label='Select Cohort Name'
                      name='cohort'
                      getOptionLabel={(item: CohortInterface) =>
                        item?.cohort_name
                      }
                      getOptionValue={(item: CohortInterface) => item?.id}
                      options={ProjectCohort || []}
                    />
                  </div>
                  <div className='flex flex-wrap gap-6'>
                    <CustomInput
                      name='participant_name'
                      label='Participant Name'
                      className='w-[475.33px] '
                      required
                    />
                    <CustomInput
                      name='email'
                      label='Email ID'
                      type='email'
                      className='w-[475.33px] '
                      required
                    />

                    <CustomSelect
                      key={values.job_grade?.id}
                      required
                      className='w-[475.33px] '
                      label='Job Grade'
                      name='job_grade'
                      value={SingleParticipantData?.client_roles}
                      getOptionLabel={(item) =>
                        JobGradeData?.jobGrades?.length
                          ? item?.role
                          : item?.leadership_level
                      }
                      getOptionValue={(item) => item?.id}
                      options={
                        JobGradeData?.jobGrades?.length
                          ? JobGradeData?.jobGrades
                          : JobGradeData?.leadLevel || []
                      }
                    />
                    <CustomInput
                      name='perf1'
                      label='Performance Current Year'
                      className='w-[475.33px] '
                      required
                    />
                    <CustomInput
                      name='perf2'
                      label='Performance Previous Year'
                      className='w-[475.33px] '
                    />
                    <CustomInput
                      name='perf3'
                      label='Performance Year Before Last'
                      className='w-[475.33px] '
                    />
                    <CustomInput
                      label='Department'
                      name='department'
                      className='w-[475.33px] '
                    />
                    <CustomInput
                      label='Division'
                      name='division'
                      className='w-[475.33px] '
                    />
                    <CustomInput
                      label='Position / Role'
                      name='position'
                      className='w-[475.33px] '
                    />
                    <DatePickerComponent
                      name='date_of_birth'
                      label='Date of Birth'
                      className='w-[475.33px] '
                      maxDate={new Date()}
                    />
                    <DatePickerComponent
                      minDate={new Date(values?.date_of_birth)}
                      name='date_of_joining'
                      label='Date of Joining'
                      className='w-[475.33px] '
                    />
                  </div>
                </div>
                <ButtonFooter>
                  <div className='flex gap-4 justify-end'>
                    <CustomButton
                      variant='outline'
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton
                      type='submit'
                      isPending={isPending}
                      disabled={isPending}
                    >
                      {row?.id ? "Update" : "Create"} Participant
                    </CustomButton>
                  </div>
                </ButtonFooter>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ParticipantsForm;
