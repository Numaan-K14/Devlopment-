import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import CheckBoxAutocomplet from "@/components/checkbox-autocomplet";
import { DialogFooter } from "@/components/ui/dialog";
import { axios } from "@/config/axios";
import { queryClient } from "@/config/query-client";
import { useQuery } from "@/hooks/useQuerry";
import { CompetiencyInterface } from "@/interfaces/competency";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { toast } from "sonner";

const LinkNbolCompetiencyDialog = ({
  setOpen,
  refetchQuire,
  ClientId,
  ProjectId,
  NbolId,
}: {
  setOpen: (item: boolean) => void;
  refetchQuire: string;
  ClientId: string;
  ProjectId: string;
  NbolId: string;
}) => {
  //-------- api call ---------//
  const { data: NbolCompetiencyData } = useQuery<CompetiencyInterface[]>({
    queryKey: [`/competency/nbol-lead-proj-comp/${ProjectId}`],
    select: (data: any) => data?.data?.data?.rows,
    enabled: !!ProjectId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.post(
        `/competency/nbol-client-competency/${NbolId}/${ClientId}`,
        data,
      ),
    onSuccess: (data) => {
      toast.success(
        data.data.msg ||
          "NBOL Competencies successfully imported and linked to the selected role levels!",
      );
      queryClient.refetchQueries({ queryKey: [refetchQuire] });
      setOpen(false);
    },
    onError: (resp: any) => {
      toast.error(resp?.response?.data?.message || "Something went wrong!");
    },
  });
  return (
    <div>
      <CustomDialog
        title='Import NBOL Competencies'
        className={"max-w-[385px]"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(false);
        }}
      >
        <Formik
          initialValues={{ ref_nbol_compt_id: [] }}
          onSubmit={(values) => {
            const tempData = values?.ref_nbol_compt_id.map(
              (item: any) => item?.id,
            );
            mutate({ ref_nbol_compt_id: tempData });
          }}
        >
          {({ values }) => (
            <Form>
              <div className='flex gap-5 flex-wrap pt-5 pb-10 items-center'>
                <CheckBoxAutocomplet
                  required
                  className={"w-[335px]"}
                  label='Link with Client Role Levels'
                  levels={NbolCompetiencyData || []}
                  name='ref_nbol_compt_id'
                />
              </div>
              <DialogFooter className='py-4 px-6 border-t'>
                <div className='flex justify-end items-center gap-5'>
                  <CustomButton
                    variant='outline'
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton
                    type='submit'
                    isPending={isPending}
                    disabled={
                      isPending || values?.ref_nbol_compt_id?.length === 0
                    }
                  >
                    Add
                  </CustomButton>
                </div>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </CustomDialog>
    </div>
  );
};

export default LinkNbolCompetiencyDialog;
