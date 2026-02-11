import { CustomDialog } from "@/components";
import CustomButton from "@/components/button";
import CheckBoxAutocomplet from "@/components/checkbox-autocomplet";
import CustomSelect from "@/components/inputs/custom-select";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, Formik } from "formik";

const levels = [
  { id: 1, label: "Level 1" },
  { id: 2, label: "Level 2" },
  { id: 3, label: "Level 3" },
  { id: 4, label: "Level 4" },
];
const LinkDialog = ({ setOpen }: { setOpen: any }) => {
  return (
    <div>
      <CustomDialog title='Add Facility' className={"max-w-[1116px]"}>
        <Formik
          initialValues={{}}
          onSubmit={() => {
            setOpen(false);
          }}
        >
          <Form>
            <div className='flex gap-5 flex-wrap items-center'>
              <CheckBoxAutocomplet
                className={"w-[514px]"}
                label='Link with Client Role Levels'
                levels={levels}
                name='test'
              />
              <CustomSelect
                name='facility_name'
                label='Facility Name'
                className='w-[514px]'
                getOptionLabel={(item) => item?.name}
                getOptionValue={(item) => item?.name}
                options={[]}
              ></CustomSelect>
            </div>
          </Form>
        </Formik>

        <DialogFooter className='py-4 px-6 border-t'>
          <div className='flex justify-end items-center gap-5'>
            <CustomButton variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </CustomButton>
            <CustomButton>Add</CustomButton>
          </div>
        </DialogFooter>
      </CustomDialog>
    </div>
  );
};

export default LinkDialog;
