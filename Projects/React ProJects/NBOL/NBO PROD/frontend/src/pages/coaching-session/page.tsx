import { Label, PageHeading } from "@/components";
import CustomButton from "@/components/button";
import { DeleteItem } from "@/components/delete-item";
import { DatePickerComponent } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import CustomSelect from "@/components/inputs/custom-select";
import TimeRangePicker from "@/components/inputs/range-time-picker";
import SelectCommonOptions from "@/components/inputs/select-client";
import { Datagrid } from "@/components/ui/datagrid/data-table-new";
import { Separator } from "@/components/ui/separator";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useQuery } from "@/hooks/useQuerry";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Form, Formik } from "formik";
import moment from "moment";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";
import * as Yup from "yup";
import CoachingSessionDialoag from "./components/coaching-session-dialoag";
import CommentDialoag from "./components/comment-dialoag";

const CoachingSessionPage = () => {
  const adminColumns: ColumnDef<any>[] = [
    {
      header: "Participant",
      accessorKey: "participant",
      cell({ row }: { row: any }) {
        return row?.original?.participant?.participant_name;
      },
    },
    {
      header: "Assessor",
      accessorKey: "assessor",
      cell({ row }: { row: any }) {
        return row?.original?.assessor?.assessor_name;
      },
    },
    {
      header: "Session Date",
      accessorKey: "session_date",
      cell({ row }: { row: any }) {
        return moment(row?.original?.date).format("DD MMM YYYY");
      },
    },
    {
      header: "Session Format",
      accessorKey: "session",
    },
    {
      header: "Venue",
      accessorKey: "vanue",
      cell({ row }: { row: any }) {
        return row?.original?.vanue ? row?.original?.vanue : "-";
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell({ row }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            <span
              className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
              onClick={() => {
                // eslint-disable-next-line
                setOpen(true);
                setSelectedRow(row?.original);
              }}
            >
              <BiEditAlt className='text-[#006F6D] size-[14px]' />
              Edit
            </span>
            <Separator
              orientation='vertical'
              className='!h-[15px] text-red-500'
            />

            <DeleteItem
              endPoint={`/coaching/${row?.original?.id}`}
              itemName={`${""}`}
              title='Delete Coaching '
              refetchUrl={["/coaching"]}
            />
          </div>
        );
      },
    },
  ];
  const assessorColums: ColumnDef<any>[] = [
    {
      header: "Participant Name",
      accessorKey: "participant_name",
    },

    {
      header: "Client Name",
      accessorKey: "client_name",
      cell({ row }: { row: any }) {
        return row?.original?.client?.client_name;
      },
    },
    {
      header: "Project Name",
      accessorKey: "project_name",
      cell({ row }: { row: any }) {
        return row?.original?.project?.project_name;
      },
    },
    {
      header: "Cohort Name",
      accessorKey: "cohort_name",
      cell({ row }: { row: any }) {
        return row?.original?.cohorts?.cohort_name;
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell({ row }) {
        return (
          <div className='flex justify-start items-center gap-5'>
            {row?.original?.coaching?.[0]?.commentStatus === "completed" && (
              <span
                className='flex gap-1 items-center cursor-pointer text-[#4338CA]'
                onClick={() => {
                  // eslint-disable-next-line
                  setOpenComment(true);
                  setSelectedRow(row?.original);
                }}
              >
                <IoEyeOutline className='text-[#4338CA] size-[14px]' />
                View Comment
              </span>
            )}
            {row?.original?.coaching?.[0]?.commentStatus === "pending" && (
              <span
                className='flex gap-1 items-center cursor-pointer text-[#4338CA]'
                onClick={() => {
                  // eslint-disable-next-line
                  setOpenComment(true);
                  setSelectedRow(row?.original);
                }}
              >
                <FiPlus className='text-[#4338CA] size-[14px]' />
                Add Comment
              </span>
            )}
            {row?.original?.coaching?.[0]?.commentStatus === "inprogress" && (
              <span
                className='flex gap-1 items-center cursor-pointer text-[#006F6D]'
                onClick={() => {
                  // eslint-disable-next-line
                  setOpenComment(true);
                  setSelectedRow(row?.original);
                }}
              >
                <BiEditAlt className='text-[#006F6D] size-[14px]' />
                Edit Comment
              </span>
            )}
          </div>
        );
      },
    },
  ];

  //---------- state management ------------//
  const [selectedClient, setSelectedClient] = useState<any>();
  const [selectedProject, setSelectedProject] = useState<any>();
  const [selectedCohort, setSelectedCohort] = useState<any>();
  const [open, setOpen] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>();
  const [initialValues, setInitialValues] = useState<any>({
    session: "",
    client_id: "",
    project_id: "",
    cohort_id: "",
    part_id: "",
    start_time: "",
    end_time: "",
    assessor_id: "",
    vanue: "",
    date: new Date(),
  });

  //---------- user object from local storage ----------------//
  const users_obj = localStorage.getItem("users_obj");
  const user = users_obj ? JSON.parse(users_obj) : null;

  //----------- validations -------------//
  const validationSchema = Yup.object().shape({
    session: Yup.string().required("This field is required"),
    part_id: Yup.object().required("This field is required"),
    start_time: Yup.string().required("This field is required"),
    assessor_id: Yup.object().required("This field is required"),
    end_time: Yup.string().required("This field is required"),
    vanue: Yup.string().when("session", {
      is: (val: string) => val === "In-Person",
      then: (schema) => schema.required("This field is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
  //-------------- get api calls ------------------//
  const { data: ParticipantData } = useQuery<any>({
    queryKey: [
      `/participant/participant-filter?client_id=${selectedClient?.id}&project_id=${selectedProject?.id}&cohort_id=${selectedCohort?.id}`,
    ],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!selectedClient && !!selectedProject && !!selectedCohort,
  });
  const { data: AssessorsData } = useQuery<any>({
    queryKey: [`/assessors/active-assessors`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: true,
  });
  const { data: ParticipantLoginData } = useQuery<any>({
    // queryKey: [`/coaching/particpant-session/${user?.participant_id}`],
    queryKey: [`/coaching/particpant-session/${user?.participant_id}`],
    select: (data: any) => data?.data?.data,
    enabled: user?.role === "participant",
  });

  //-------------- mutate functions -----------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.post("/coaching", data),
    onSuccess(data) {
      toast.success(data.data.msg || "Successful");
      queryClient.refetchQueries({
        queryKey: [`/coaching`],
        exact: false,
      });
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  let assessorDatagridUrl = `/coaching/assessor-sessions/${user?.assessor_id}`;
  if (selectedClient?.id && selectedProject?.id && selectedCohort?.id) {
    assessorDatagridUrl = `/coaching/assessor-sessions/${user?.assessor_id}/?client_id=${selectedClient.id}&project_id=${selectedProject.id}&cohort_id=${selectedCohort.id}`;
  } else if (selectedClient?.id && selectedProject?.id) {
    assessorDatagridUrl = `/coaching/assessor-sessions/${user?.assessor_id}/?client_id=${selectedClient.id}&project_id=${selectedProject.id}`;
  } else if (selectedClient?.id) {
    assessorDatagridUrl = `/coaching/assessor-sessions/${user?.assessor_id}/?client_id=${selectedClient.id}`;
  }

  // For resetting values on Clear Form
  const [formKey, setFormKey] = useState(0);
  const handleClearForm = (resetForm: any) => {
    resetForm({ values: initialValues }); // resets to your defaults
    // setInitialValues({ date: null }) // for date reset
    setInitialValues((prev: any) => ({ ...prev, date: null }));
    setFormKey((prev) => prev + 1); // force re-render if needed
  };

  return (
    <div>
      <PageHeading>Feedback Session</PageHeading>
      <div>
        {user?.role === "admin" && (
          <div className={`border-b   pb-10`}>
            <Formik
              key={formKey}
              validationSchema={validationSchema}
              initialValues={initialValues}
              onSubmit={(values: any) => {
                let data = {
                  session:
                    values?.session === "Virtual"
                      ? "virtual"
                      : values?.session === "In-Person"
                        ? "inperson"
                        : "",
                  client_id: selectedClient?.id || "",
                  project_id: selectedProject?.id || "",
                  cohort_id: selectedCohort?.id || "",
                  part_id: values?.part_id?.id || "",
                  start_time: values?.start_time || "",
                  end_time: values?.end_time || "",
                  assessor_id: values?.assessor_id?.id || "",
                  assessor_email: values?.assessor_id?.email,
                  assessor_name: values?.assessor_id?.assessor_name,
                  part_email: values?.part_id?.email,
                  part_name: values?.part_id?.participant_name,
                  vanue: values?.vanue || "",
                  date: values?.date
                    ? format(values?.date, "yyyy-MM-dd")
                    : new Date(),
                };
                mutate(data);
              }}
            >
              {({ setFieldValue, values, resetForm, errors }) => (
                <Form>
                  <div className='flex  flex-col gap-10'>
                    <div className='flex !flex-wrap gap-8'>
                      <SelectCommonOptions
                        handleChange={setSelectedClient}
                        required={true}
                        handleDataChange={(client: any | null) => {
                          setSelectedClient(client);
                          localStorage.setItem(
                            "client",
                            JSON.stringify(client),
                          );
                        }}
                        localStorageName='client'
                        url='/client/getall-clients'
                        className='!w-[362.25px]'
                      />

                      {selectedClient && (
                        <SelectCommonOptions
                          required={true}
                          className='!w-[362.25px]'
                          handleDataChange={(project: any | null) => {
                            setSelectedProject(project);
                            localStorage.setItem(
                              "project",
                              JSON.stringify(project),
                            );
                          }}
                          localStorageName='project'
                          url={`/projects/client-projects/${selectedClient?.id}`}
                        />
                      )}
                      {selectedClient && selectedProject && (
                        <SelectCommonOptions
                          required={true}
                          className='!w-[362.25px]'
                          handleDataChange={(cohort: any | null) => {
                            setSelectedCohort(cohort);
                            localStorage.setItem(
                              "cohort",
                              JSON.stringify(cohort),
                            );
                          }}
                          localStorageName='cohort'
                          url={`/participant/get-project-cohorts/${selectedProject?.id}`}
                        />
                      )}
                    </div>

                    <div className='flex !flex-wrap gap-8'>
                      <CustomSelect
                        required
                        label='Participant Name'
                        name='part_id'
                        getOptionLabel={(item) => item?.participant_name}
                        getOptionValue={(item) => item?.id}
                        options={ParticipantData ? ParticipantData : []}
                        className='!w-[362.25px]'
                      />
                      <CustomSelect
                        required
                        label='Assessor Name'
                        name='assessor_id'
                        getOptionLabel={(item) => item?.assessor_name}
                        getOptionValue={(item) => item?.id}
                        options={AssessorsData ? AssessorsData : []}
                        className='!w-[362.25px]'
                      />
                      <DatePickerComponent
                        name='date'
                        label='Session Date'
                        className='!w-[362.25px]'
                        minDate={new Date()}
                      />
                      <TimeRangePicker
                        label='Session Time'
                        startTimeName='start_time'
                        endTimeName='end_time'
                      />
                    </div>

                    <div className='flex !flex-wrap gap-8'>
                      <CustomSelect
                        required
                        label='Session Format'
                        name='session'
                        getOptionLabel={(item) => item}
                        getOptionValue={(item) => item}
                        options={["In-Person", "Virtual"]}
                        className='!w-[362.25px]'
                      />
                      {values?.session === "In-Person" && (
                        <CustomInput
                          required
                          label='Venue'
                          name='vanue'
                          className='!w-[362.25px]'
                        />
                      )}
                    </div>

                    <div className='flex justify-end'>
                      <div className='flex gap-4'>
                        <CustomButton
                          variant='outline'
                          onClick={() => {
                            handleClearForm(resetForm);
                          }}
                        >
                          Clear Form
                        </CustomButton>
                        <CustomButton
                          type='submit'
                          disabled={isPending}
                          isPending={isPending}
                        >
                          Save
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {user?.role === "assessor" && (
          <div className='flex !flex-wrap gap-8'>
            <SelectCommonOptions
              handleChange={setSelectedClient}
              required={true}
              handleDataChange={(client: any | null) => {
                setSelectedClient(client);
                localStorage.setItem("client", JSON.stringify(client));
              }}
              localStorageName='client'
              url='/client/getall-clients'
              className='!w-[362.25px]'
            />

            {selectedClient && (
              <SelectCommonOptions
                required={true}
                className='!w-[362.25px]'
                handleDataChange={(project: any | null) => {
                  setSelectedProject(project);
                  localStorage.setItem("project", JSON.stringify(project));
                }}
                localStorageName='project'
                url={`/projects/client-projects/${selectedClient?.id}`}
              />
            )}
            {selectedClient && selectedProject && (
              <SelectCommonOptions
                required={true}
                className='!w-[362.25px]'
                handleDataChange={(cohort: any | null) => {
                  setSelectedCohort(cohort);
                  localStorage.setItem("cohort", JSON.stringify(cohort));
                }}
                localStorageName='cohort'
                url={`/participant/get-project-cohorts/${selectedProject?.id}`}
              />
            )}
          </div>
        )}
        {user?.role !== "participant" && (
          <div className='pt-3'>
            <Datagrid
              columns={
                user?.role === "admin"
                  ? adminColumns
                  : user?.role === "assessor"
                    ? assessorColums
                    : []
              }
              disableFilters
              url={
                user?.role === "admin"
                  ? `/coaching`
                  : user?.role === "assessor"
                    ? assessorDatagridUrl
                    : ""
              }
            />
          </div>
        )}

        {user?.role === "participant" && (
          <>
            <div className='flex gap-10'>
              <CustomSelect
                getOptionLabel={(item: any) => item?.assessor_name}
                getOptionValue={(item: any) => item?.id}
                options={[ParticipantLoginData?.assessor]}
                value={ParticipantLoginData?.assessor}
                className='w-[362.25px]'
                disabled
                label='Assessor Name'
              />
              <CustomInput
                label='Session Date'
                disabled
                value={moment(ParticipantLoginData?.date).format("DD MMM YYYY")}
                className='w-[362.25px]'
              />
            </div>
            <div className='mt-10'>
              <Label>Comment</Label>
              <div
                className=' border border-[#DAE0E6] opacity-[70%] text-[#919BA7] rounded-[5px] px-5 py-5'
                dangerouslySetInnerHTML={{
                  __html: ParticipantLoginData?.comment,
                }}
              >
                {/* {ParticipantLoginData?.comment} */}
              </div>
            </div>
          </>
        )}
      </div>
      {open && (
        <CoachingSessionDialoag
          handleClose={setOpen}
          row={selectedRow}
          assessorsData={AssessorsData}
        />
      )}
      {openComment && (
        <CommentDialoag
          handleClose={setOpenComment}
          row={selectedRow}
          refetchUrl={assessorDatagridUrl}
        />
      )}
    </div>
  );
};

export default CoachingSessionPage;
