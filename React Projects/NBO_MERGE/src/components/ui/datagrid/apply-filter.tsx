import CustomButton from "@/components/button";
import { CustomDialog } from "@/components/dialog";
import { Autocomplete } from "@/components/inputs";
import CustomInput from "@/components/inputs/custom-input";
import { useQuery } from "@/hooks/useQuerry";
import { FilterColumnInterface } from "@/interfaces/data-grid";
import { Column } from "@tanstack/react-table";
import { FieldArray, Form, Formik, getIn, useFormikContext } from "formik";
import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { IoFunnelOutline } from "react-icons/io5";
import * as yup from "yup";
import { DialogFooter } from "../dialog";

type Props = {
  columns: Column<any>[];
  setFilters: any;
  filters: FilterColumnInterface[];
  changePage: any;
};

const operators = [
  { value: "=", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: ">", label: "Greater Than" },
  { value: "<", label: "Less Than" },
  {
    value: ">=",
    label: "Greater Than Equal To",
  },
  {
    value: "<=",
    label: "Less Than Equal To",
  },
];

const validations = yup.object({
  filters: yup.array().of(
    yup.object({
      column: yup.mixed().required("This field is required"),
      operator: yup.mixed().required("This field is required"),
      value: yup.mixed().required("This field is required"),
    }),
  ),
});

const ValueField = ({ index, getError }: any) => {
  const {
    values,
    setFieldTouched,
    setFieldValue,
    getFieldProps,
  } = useFormikContext<any>();
  const { data } = useQuery<any>({
    queryKey: values.filters[index].column
      ? [values.filters[index].column.apiURL]
      : [""],
    enabled: Boolean(
      values.filters[index].column && values.filters[index].column.apiURL,
    ),
  });
  if (
    values.filters[index].column &&
    (values.filters[index].column.apiURL ||
      values.filters[index].column.options)
  ) {
    return (
      <Autocomplete
        options={values.filters[index].column.options || data?.rows || []}
        defaultValue={getFieldProps(`filters[${index}].value`)?.value || []}
        // getOptionLabel={(option: any) =>
        //   typeof option === "string"
        //     ? option
        //     : option[values.filters[index].column.optionAccessor || "label"] ||
        //       ""
        // }

        onChange={(value: any) => {
          setFieldValue(`filters[${index}].value`, value);
        }}
        id={`value${index}`}
        onBlur={() => setFieldTouched(`filters[${index}].value`, true, true)}
        // renderInput={(params: any) => (
        //   <CustomInput
        //     {...params}
        //     error={Boolean(
        //       getError(errors, touched, `filters[${index}].value`),
        //     )}
        //     helperText={getError(errors, touched, `filters[${index}].value`)}
        //   />
        // )}
      />
    );
  }
  return (
    <CustomInput
      // onChange={handleChange}
      // onBlur={handleBlur}
      type={
        values.filters[index]?.column?.type
          ? values.filters[index].column.type
          : "text"
      }
      // value={getFieldProps(`filters[${index}].value`).value}
      name={`filters[${index}].value`}
      //   error={Boolean(getError(errors, touched, `filters[${index}].value`))}
      //   id={`value${index}`}
      //   helperText={getError(errors, touched, `filters[${index}].value`)}
    />
  );
};

export const ApplyFilter = ({
  columns,
  setFilters,
  filters,
  changePage,
}: Props) => {
  const [initialState, setInitialState] = useState<{
    filters: FilterColumnInterface[];
  }>({
    filters: [],
  });

  useEffect(() => {
    if (filters.length) {
      setInitialState({ filters });
    } else {
      setInitialState({
        filters: [],
      });
    }
  }, [filters]);

  const columnsOptions = useMemo(
    () =>
      columns
        .filter((item) => item.getIsVisible())
        .reduce(
          (prev: any, curr: any) =>
            !curr.columnDef?.meta?.disableFilters
              ? [
                  ...prev,
                  {
                    ...curr.columnDef.meta,
                    header: curr.columnDef.header,
                  },
                ]
              : prev,
          [],
        ),
    [columns],
  );

  const getError = (errors: any, touched: any, name: string) => {
    const error = getIn(errors, name);
    const touch = getIn(touched, name);

    return touch && error ? error : null;
  };

  return (
    <CustomDialog
      className='!max-w-[900px]'
      title='Apply Filter'
      button={
        <CustomButton className='h-10 hidden md:flex' variant='outline'>
          <IoFunnelOutline />
          Apply Filter
        </CustomButton>
      }
    >
      {({ onClose }: any) => (
        <Formik
          initialValues={initialState}
          enableReinitialize
          validationSchema={validations}
          onSubmit={(values) => {
            setFilters(values.filters);
            onClose();
            changePage(values.filters);
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            getFieldProps,
            submitForm,
          }) => (
            <Form className='w-full block h-full'>
              <div className='flex flex-col gap-5 px-5 pb-5 h-full justify-between'>
                <FieldArray
                  name='filters'
                  render={({ push, remove }) => (
                    <div>
                      {values?.filters.map((filter: any, index: number) => (
                        <div
                          className='grid grid-cols-1 border-b pb-5 md:grid-cols-3 gap-5 mb-5'
                          key={index}
                        >
                          <Autocomplete
                            options={columnsOptions || []}
                            className='w-full'
                            // getOptionDisabled={(option: any) =>
                            //   values.filters
                            //     .map((item: any) =>
                            //       item.column ? item.column.header : null
                            //     )
                            //     .includes(option.header)
                            // }
                            // getOptionLabel={(option: any) => option.header || ""}
                            // fullWidth
                            defaultValue={
                              getFieldProps(`filters[${index}].column`).value
                            }
                            onChange={(value: any) => {
                              setFieldValue(`filters[${index}].column`, value);
                              setFieldValue(
                                `filters[${index}].operator`,
                                "",
                                false,
                              );
                              setFieldValue(
                                `filters[${index}].value`,
                                "",
                                false,
                              );
                            }}
                            id={`column${index}`}
                            onBlur={() =>
                              setFieldTouched(
                                `filters[${index}].column`,
                                true,
                                true,
                              )
                            }
                            // renderInput={(params: any) => (
                            //   <CustomInput
                            //     {...params}
                            //     error={Boolean(
                            //       getError(
                            //         errors,
                            //         touched,
                            //         `filters[${index}].column`,
                            //       ),
                            //     )}
                            //     helperText={getError(
                            //       errors,
                            //       touched,
                            //       `filters[${index}].column`,
                            //     )}
                            //   />
                            // )}
                          />
                          <Autocomplete
                            className='w-[250px]'
                            onChange={(value: any) =>
                              setFieldValue(`filters[${index}].operator`, value)
                            }
                            value={
                              getFieldProps(`filters[${index}].operator`).value
                            }
                            onBlur={() =>
                              setFieldTouched(
                                `filters[${index}].operator`,
                                true,
                                true,
                              )
                            }
                            id={`operator${index}`}
                            options={
                              filter?.column?.operators
                                ? operators.filter((item) =>
                                    filter.column.operators.includes(
                                      item.value,
                                    ),
                                  )
                                : operators
                            }
                            // fullWidth
                            getOptionLabel={(option: any) => option.label || ""}
                            // isOptionEqualToValue={(option: any, value: any) =>
                            //   option.value === value.value
                            // }
                            // renderInput={(params: any) => (
                            //   <CustomInput
                            //     {...params}
                            //     error={Boolean(
                            //       getError(
                            //         errors,
                            //         touched,
                            //         `filters[${index}].operator`,
                            //       ),
                            //     )}
                            //     helperText={getError(
                            //       errors,
                            //       touched,
                            //       `filters[${index}].operator`,
                            //     )}
                            //   />
                            // )}
                          />
                          <div className='flex justify-between items-end gap-3'>
                            <ValueField index={index} getError={getError} />
                            <Trash2
                              size={20}
                              color={"red"}
                              onClick={() => remove(index)}
                            />
                          </div>
                        </div>
                      ))}
                      <div className='flex justify-end items-center gap-5 mt-5'>
                        <CustomButton
                          variant='outline'
                          onClick={() =>
                            push({
                              columns: {},
                              operator: "",
                              value: [],
                              id: Date.now(),
                            })
                          }
                        >
                          Add More Title
                        </CustomButton>
                        <CustomButton
                          variant='outline'
                          onClick={() => setFieldValue("filters", [])}
                        >
                          Clear All Filter
                        </CustomButton>
                      </div>
                    </div>
                  )}
                ></FieldArray>
                <DialogFooter className='py-4 px-6 border-t col-span-2'>
                  <div className='flex justify-end items-center gap-5'>
                    <CustomButton variant='outline' onClick={onClose}>
                      Close
                    </CustomButton>
                    <CustomButton
                      variant='default'
                      onClick={submitForm}
                      // startIcon={
                      //   isPending && (
                      //     <AiOutlineLoading3Quarters className='animate-spin' />
                      //   )
                      // }
                    >
                      Save Changes
                    </CustomButton>
                  </div>
                </DialogFooter>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </CustomDialog>
  );
};
