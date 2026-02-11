import { PageHeading } from "@/components";
import CustomButton from "@/components/button";
import { DatePickerComponent } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import CustomSelect from "@/components/inputs/custom-select";
import { Drawer } from "@/components/ui/drawer";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useQuery } from "@/hooks/useQuerry";
import { ProjectConfigInterface } from "@/interfaces/client";
import { NbolLeadershipLevelInterface } from "@/interfaces/common";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
const ProjectConfigDialog = ({
  handleClose,
  id,
  refetchUrl,
  selectedClient,
  open,
}: {
  handleClose: any;
  selectedClient: any;
  id?: string;
  refetchUrl?: string;
  open: boolean;
}) => {
  //--------- validation schema -----------//
  const validationSchema = Yup.object().shape({
    client_id: Yup.object().required("This field is required"),
    project_name: Yup.string().required("This field is required"),
    nbol_ll_id: Yup.object().required("This field is required"),
    start_date: Yup.string().required("This field is required"),
    end_date: Yup.string().required("This field is required"),
  });

  //-------- api call ---------//
  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      id
        ? axios.put(`/projects/${id}`, data)
        : axios.post(`/projects/${selectedClient?.id}`, data),
    onSuccess(data) {
      handleClose();
      toast.success(
        data.data.msg || id
          ? "Project Updated Successfully"
          : "Project Added Successfully",
      );
      queryClient.refetchQueries({
        queryKey: [refetchUrl],
        exact: false,
      });
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  const { data: SingleGetData } = useQuery<ProjectConfigInterface>({
    queryKey: [`/projects/${id}`],
    select: (data: any) => data?.data?.data,
    enabled: !!id,
  });

  const { data: NbolLeadershipData } = useQuery<NbolLeadershipLevelInterface[]>(
    {
      queryKey: [`/projects/client-lead-level/${SingleGetData?.client?.id}`],
      select: (data: any) => data?.data?.data,
      enabled: !!SingleGetData?.client || !!selectedClient,
    },
  );
  // console.log(SingleGetData, "<---------- SingleGetData", NbolLeadershipData);
  //-------- state management --------//
  const [initialValues, setInitialValues] = useState<ProjectConfigInterface>({
    client_id: selectedClient ? selectedClient : "",
    project_name: "",
    start_date: new Date(),
    end_date: new Date(),
    nbol_ll_id: "",
  });

  useEffect(() => {
    if (SingleGetData) {
      setInitialValues({
        client_id: SingleGetData?.client || "",
        project_name: SingleGetData?.project_name || "",
        end_date: SingleGetData?.end_date || new Date(),
        start_date: SingleGetData?.start_date || new Date(),
        nbol_ll_id: SingleGetData?.nbol || "",
      });
    }
  }, [SingleGetData]);

  return (
    // <CustomDialog
    //   title={id ? "Update Project" : "Add Project"}
    //   className={"max-w-[1116px] !overflow-visible "}
    //   onOpenChange={(isOpen) => {
    //     if (!isOpen) handleClose(false);
    //   }}
    // >
    <Drawer open={open} onOpenChange={handleClose} width='613px'>
      <div className=' h-full  overflow-y-auto '>
        <div className='h-[60px] w-full absolute top-0 z-50 border-b bg-white border-[#D0D0D7] px-5 text-[18px] font-bold  py-[16px]'>
          {SingleGetData ? "Update Project" : "Add Project"}
        </div>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={(values: any) => {
            mutate({
              ...values,
              client_id: values?.client_id?.id,
              nbol_ll_id: values?.nbol_ll_id?.id,
            });
          }}
          validationSchema={validationSchema}
        >
          {({ values }) => (
            <Form>
              <div className='flex py-14 px-5  flex-col gap-10'>
                <div className='flex gap-[13px]  py-5 flex-wrap'>
                  <PageHeading variant='secondary' className='!mb-[3px]'>
                    Project Details
                  </PageHeading>
                  <div className='flex gap-[13px] mb-2'>
                    <CustomSelect
                      key={values.client_id?.id}
                      value={
                        selectedClient ? selectedClient : SingleGetData?.client
                      }
                      disabled={true}
                      name='client_id'
                      label='Client Name'
                      className='w-[280px]'
                      options={
                        selectedClient
                          ? [selectedClient]
                          : [SingleGetData?.client]
                      }
                      getOptionLabel={(item: any) => `${item?.client_name}`}
                      getOptionValue={(item: any) => item}
                      required
                    />
                    <CustomInput
                      name='project_name'
                      label='Project Name'
                      className='w-[280px]'
                      required
                    />
                  </div>
                  <div className='flex gap-[13px] mb-2'>
                    <DatePickerComponent
                      minDate={new Date()}
                      name='start_date'
                      label='Tentative Start Date'
                      className='w-[280px]'
                    />
                    <DatePickerComponent
                      minDate={new Date()}
                      name='end_date'
                      label='Tentative Completion Date'
                      className='w-[280px]'
                    />
                  </div>
                  <CustomSelect
                    key={values.nbol_ll_id}
                    name='nbol_ll_id'
                    label='Link with NBOL Leadership Level'
                    className='w-[280px] '
                    options={NbolLeadershipData || []}
                    getOptionLabel={(item: NbolLeadershipLevelInterface) =>
                      item?.leadership_level
                    }
                    getOptionValue={(item: NbolLeadershipLevelInterface) =>
                      item?.id
                    }
                    required
                  />
                </div>
                {/* <DialogFooter className='py-4 mt-[-25px] px-6 border-t'> */}

                <div className=' mx-[28px] bg-white  w-full  flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
                  <div className='flex absolute bg-white  bottom-0 right-0 border-t w-full justify-end items-center px-[28px] py-[16px] gap-5'>
                    <CustomButton
                      variant='outline'
                      onClick={() => handleClose(false)}
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton
                      type='submit'
                      isPending={isPending}
                      disabled={isPending}
                    >
                      {id ? "Update" : "Add"}
                    </CustomButton>
                  </div>
                </div>
                {/* </DialogFooter> */}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Drawer>
    // </CustomDialog>
  );
};

export default ProjectConfigDialog;
