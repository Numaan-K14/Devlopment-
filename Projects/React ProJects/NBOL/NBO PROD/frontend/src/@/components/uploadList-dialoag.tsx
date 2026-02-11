import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import CustomButton from "./button";
import { CustomDialog } from "./dialog";
import { DropZone } from "./inputs";
import CustomSelect from "./inputs/custom-select";
import { PageHeading } from "./page-heading";
import SuccessDialog from "./SuccessDialog";
import { DialogFooter } from "./ui/dialog";

const UploadListDialoag = ({
  handleClose,
  refetchQuire,
  url,
  title,
  nbolLeaderShipData,
  showNbolDropdown = false,
  data,
  downloadURL,
}: {
  handleClose: any;
  refetchQuire: any;
  clientId?: string;
  url: string;
  title?: string;
  nbolLeaderShipData?: any;
  showNbolDropdown?: boolean;
  data?: any;
  downloadURL?: string;
}) => {
  const validationSchema = Yup.object().shape({
    file: Yup.mixed().required("This field is required"),
    ...(showNbolDropdown && {
      nbol_id: Yup.object()
        .nullable()
        .shape({
          id: Yup.string().required("This field is required"),
        })
        .required("This field is required"),
    }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.post(`${url}`, data),
    onSuccess: (data) => {
      toast.success(data.data.msg || "uploaded successfully.");
      queryClient.refetchQueries({ queryKey: [refetchQuire] });
      setOpen(true);
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });

  const [open, setOpen] = useState(false);
  const [selectedNbolLeadershipRow, setSelectedNbolLeadershipRow] =
    useState(null);

  const { mutate: download, isPending: downloadPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.get(downloadURL ? downloadURL : "");
      return response.data;
    },
    onSuccess: (res) => {
      const url = res?.data?.filePath.split("/").slice(1).join("/");
      const link = document.createElement("a");
      link.href = `${process.env.REACT_APP_API_BASE_URL}/${url}`;
      link.target = "_blank";
      link.click();
    },
  });

  const onDownload = () => {
    download();
  };
  return (
    <div>
      <CustomDialog
        title={title}
        className={"max-w-[1116px]"}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose(false);
        }}
      >
        <PageHeading variant='secondary'>Upload {title} List</PageHeading>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            file: "",
            nbol_id: { id: "" },
          }}
          onSubmit={(values) => {
            const formData = new FormData();
            formData.append("file", values?.file[0]);
            {
              showNbolDropdown &&
                formData.append("nbol_id", values?.nbol_id?.id);
            }
            mutate(formData);
          }}
        >
          {({ values, handleSubmit }) => (
            <Form>
              <div className='flex flex-col gap-10 pb-10'>
                {showNbolDropdown && (
                  <div>
                    <CustomSelect
                      key={values?.nbol_id?.id}
                      required
                      name='nbol_id'
                      className='w-[494.33px] h-[48px]'
                      label='NBO Leadership Level'
                      options={nbolLeaderShipData}
                      getOptionLabel={(item: any) => item?.leadership_level}
                      getOptionValue={(item: any) => item?.id}
                      onChange={(item) =>
                        setSelectedNbolLeadershipRow(item?.id)
                      }
                    />
                  </div>
                )}
                <div className='flex'>
                  <div className='w-1/2 flex flex-col  '>
                    <DropZone name='file' className='w-[478px]' />
                  </div>
                  <div className='w-1/2 pl-8 flex flex-col items-center '>
                    <div className='w-[478px]'>
                      <h2 className='text-sm font-normal mb-6'>
                        Steps to Upload Document
                      </h2>
                      <div className='bg-[#F5F5F5] rounded-[5px] pl-10 py-6'>
                        <ul>
                          <li className='list-disc'>
                            Download the sample template
                          </li>
                          <li className='list-disc'>Fill the data</li>
                          <li className='list-disc'>Upload the file</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className='py-4 px-6 border-t'>
                <div className='flex justify-end items-center gap-5'>
                  <CustomButton variant='outline' onClick={() => handleClose()}>
                    Cancel
                  </CustomButton>
                  <CustomButton
                    variant='outline'
                    isPending={downloadPending}
                    disabled={
                      showNbolDropdown
                        ? !selectedNbolLeadershipRow
                        : false || downloadPending
                    }
                    onClick={() => onDownload()}
                  >
                    Download Template
                  </CustomButton>
                  <CustomButton
                    type='submit'
                    disabled={
                      showNbolDropdown
                        ? !selectedNbolLeadershipRow
                        : false || isPending
                    }
                    isPending={isPending}
                  >
                    Save
                  </CustomButton>
                </div>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </CustomDialog>
      {open && <SuccessDialog setOpen={setOpen} handleClose={handleClose} />}
    </div>
  );
};

export default UploadListDialoag;
